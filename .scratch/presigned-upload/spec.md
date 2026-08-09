# Direct-to-R2 Presigned Uploads

Status: ready-for-agent

## Problem Statement

Vercel caps serverless request bodies at ~4.5MB, but the platform uploads media — course covers, bootcamp flyers, ebook covers and PDFs, lesson videos (up to 500MB) — as multipart/form-data proxied through the Nuxt server, which then pushes the bytes to Cloudflare R2. Large uploads, especially lesson videos, exceed the Vercel cap or are slow/fragile because every kilobyte crosses the server twice. Uploads must stop flowing through the server.

## Solution

Instead of uploading file bytes to the server, the client gets a short-lived presigned PUT URL from a new file-upload endpoint, uploads directly to R2, then submits the ordinary create/update JSON with the generated R2 key(s). The server keeps a ledger of issued uploads (`pending` rows) and each module flips its row to `success` only when its own database-write transaction commits. A scheduled sweeper deletes abandoned `pending` uploads and their R2 objects. Per-directory config declares allowed file types, size caps, and required role — the size/type enforcement that previously lived in multipart zod schemas now lives behind the presigning endpoint.

## User Stories

1. As an admin creating a course, I want to upload a cover image directly to Cloudflare, so that the submission fits within Vercel's payload limit.
2. As an admin creating a course lesson, I want to upload a large video file directly to Cloudflare, so that I am not blocked by the ~4.5MB server payload cap.
3. As an admin editing a bootcamp, I want to replace its flyer and keep any untouched fields intact, so that I can update details without re-uploading media.
4. As an admin creating an ebook, I want to upload both a cover image and a PDF, so that both files are available in a single save.
5. As a user editing my profile, I want to upload my own profile photo directly to Cloudflare, so that profiles aren't restricted by the server payload limit.
6. As a user on a slow connection, I want uploads to go straight from my browser to Cloudflare, so that my bytes don't bounce through the server.
7. As an admin, I want the server to reject upload requests that exceed the declared size cap for that category, so that storage cannot be abused with oversized blobs.
8. As an admin, I want the server to reject upload requests whose file type is not allowed for that category, so that e.g. a lesson can only store video types.
9. As a user, I want uploading a file whose type or size doesn't match what was requested for it to fail at the R2 edge, so that bytes can't be swapped after signing.
10. As a system operator, I want abandoned uploads (the browser never completed the submission) to be cleaned up automatically, so that orphaned blobs don't accumulate in the bucket.
11. As a platform owner, I want the storage ledger row to stay linked to the upload's actual commit, so that an object in use by a product or profile is never garbage-collected.
12. As a user, I want uploaded media to still be displayable from the existing asset domain, so that nothing about how images/videos are served changes.
13. As an admin, I want multiple files within one form (e.g. ebook cover + PDF) to each receive their own presigned URL, so that a single save can produce multiple stored keys.
14. As a user, I want to be unable to claim a forged R2 key in my submission, so that products can't reference objects that were never uploaded.
15. As a platform owner, I want per-category role gating on who may mint an upload URL, so that a logged-in member can't mint uploads for admin-only categories like course videos.

## Implementation Decisions

- **Upload transport**: client requests a presigned PUT URL, uploads bytes directly to Cloudflare R2, then sends the resulting R2 key in the regular create/update request body. Multipart upload through the server is removed.

- **Presign endpoint** (`POST` + JSON body): `{ dir, filename, filesize, filetype }` returns `{ key, url }`. POST is used rather than GET-with-query because minting a URL creates a ledger row (a mutation). The `key` is minted server-side as `${dir}/${uuid}${ext-from-filename}` and always returned to the caller; the client never fabricates keys.

- **Dir tokens replace raw dirs**. A size/type config cannot be keyed on the current `uploadFile` dir strings because a single dir is reused for different limits (e.g. `"course"` holds both a 5MB cover and a 500MB lesson video). Each upload site gets a distinct token:
  - `course` — cover image, 5MB, jpeg/png/webp, admin
  - `course-video` — lesson video, 500MB, mp4/webm/ogg/quicktime, admin
  - `bootcamp` — flyer, 5MB, jpeg/png/webp, admin
  - `ebook` — cover, 5MB, jpeg/png/webp, admin
  - `ebook-pdf` — PDF, 50MB, application/pdf, admin
  - `user-image` — profile photo, 5MB, jpeg/png/webp, authenticated user

- **Per-dir config module**: maps each dir token to `{ maxSize, fileTypes, requiredRole }`. The presign service looks the token up; unknown token, oversize, or disallowed type → 400. Role is enforced per token (`user-image` requires only an authenticated session; all product categories require admin).

- **Signed length + content type**: the presigned URL signs `ContentType` and `ContentLength` exactly. R2 rejects any PUT whose content-length differs by a byte or whose content-type header doesn't match — so the claimed type and size are enforced at the edge. This is a header-match check, not byte-inspection: a client that sends `Content-Type: image/png` with arbitrary bytes passes. (Same weakness the current `fileTypes` arrays had.) Note R2 can't cap an oversized client body itself; the size cap is enforced at presign time against the declared size.

- **Storage ledger** (`file_upload` table): `id`, `key` (unique), `dir`, `filename`, `filetype`, `filesize`, `status` (`pending`|`success`, default `pending`), timestamps. A presign inserts a `pending` row; a module marks it `success`.

- **Pending → success is transactional**: each module's create/update does its database write and flips the referenced key's rows to `success` inside the **same** `db.transaction` — repo methods gain a `keys` parameter. If the write throws, everything rolls back and the rows stay `pending`, so the sweeper may reclaim them. Submit endpoints verify the submitted keys exist and are `pending` before committing, closing the forged/fabricated-key hole.

- **Sweeper**: a GET route run by a Vercel cron (via `vercel.json`) deletes `pending` rows older than a threshold (1 hour recommended) **and** their R2 objects (server-side existing delete creds, keyed by stored key). Guarded by a cron secret header so it can only be invoked by Vercel. Existing replace/delete flows keep using the server-side delete directly — only new-upload transport changes.

- **files util**: `createPresignedUpload(dir, filename, filetype, filesize)` → `{ key, url }` built with a pre-signed `PutObjectCommand`. Existing `deleteFile` is retained; `uploadFile` is removed once all callers migrate.

- **Model schemas**: multipart file fields (`file`, `pdfFile`, `videoFile`) become plain `z.string()` key fields in course/ebook/bootcamp/user-profile schemas; those endpoints switch from multipart validation to JSON body validation.

- **Frontend**: a shared upload helper presigns then PUTs, returning the key; it is called once per selected file (ebook: two calls), then the modal submits JSON `{ ...fields, file: key }` (or `pdfFile`/`videoFile`). FormData-based submissions are removed from the five affected forms (bootcamp create, course create, course lesson create/edit, ebook create, profile update). If the user swaps the file after an upload, re-presign rather than reusing the stale URL.

- **Vercel cap context**: this supersedes the multipart path entirely, so no server handler ever receives raw file bytes; only key references travel in request bodies.

- **ADR**: transport swap + ledger + cron qualifies for an ADR (hard to reverse — new table, signed-length contract, bucket CORS; surprising without context; a real tradeoff vs multipart-proxy). An ADR (`direct-upload-presigned-urls`) should accompany the implementation.

## Testing Decisions

- **What makes a good test**: test external behavior only — the adjudicated outcomes of presigning (reject oversize/wrong-type/unknown-dir/unprivileged), the ledger transitions (pending→success only when the module commit succeeds), and the sweeper reclaiming stale pending rows and their objects. Do not test the S3 SDK, the signing internals, or the JavaScript upload helper.

- **Modules to test**: the file module (config lookups, presign adjudication, sweeper) and the module service/repo pairs that now flip ledger rows inside their transactions (course, ebook, bootcamp, user-profile).

- **Prior art**: the codebase currently has no test suite; these are the first tests. Prefer a unit-test seam at the module `service`/`repo` boundary (validate/reject logic and transaction composition) over route-level handlers, since the routes are thin wrappers. The sweeper is testable at the repo/service seam with a mocked S3 delete.

## Out of Scope

- Upload progress bars or resumable/multipart R2 uploads for very large videos.
- Serving media through a CDN layer or image optimization other than the existing asset domain.
- Detecting content-type forgery by inspecting bytes (byte-sniffing); header-match only.
- Migrating existing stored keys or backfilling the ledger for already-persisted objects (`file_upload` only holds newly-minted presigns).
- Client-side chunking or parallel multi-part PUTs.

## Further Notes

- Presigned URLs expire at 5 minutes; any ledger row older than the sweep threshold has outlived a usable URL and is safe to reclaim even if a `success` flip was never recorded.
- The filename is passed on presign both for key extension derivation and for the ledger, so the `UploadImage` component and lesson form must expose the raw `File` (name, type, size).
- Lesson video `500 * 1024 * 1024` and all multipart `maxSize`/`fileTypes` constants move into the per-dir config; the zod schema constants are deleted with their multipart fields.
