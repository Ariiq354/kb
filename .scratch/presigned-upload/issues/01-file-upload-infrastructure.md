# 01 — File upload infrastructure (presign + ledger + sweeper + client helper)

**What to build:** The end-to-end file-upload transport that everything else depends on. An admin or user can request a presigned R2 PUT URL for a named upload category (`dir` token), have the request adjudicated against that category's size/type limits and role, upload bytes directly to Cloudflare R2, and the platform records the upload in a ledger as `pending` until a submission promotes it to `success`. Abandoned `pending` uploads older than one hour — and their R2 objects — are swept by a scheduled job. A shared client helper wraps presign+PUT so later tickets can upload in one line.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] A POST endpoint accepts `{ dir, filename, filesize, filetype }` and returns `{ key, url }`, where `key` is minted server-side as `dir/<uuid>.<ext-from-filename>` and `url` is a presigned R2 PUT signed with the exact content type and content length.
- [ ] Requests are adjudicated per `dir` token: unknown token, `filesize` over the category max, or `filetype` outside the allowed set are all rejected with 400.
- [ ] Role is enforced per `dir` token: `user-image` requires only an authenticated session; all product categories (`course`, `course-video`, `bootcamp`, `ebook`, `ebook-pdf`) require admin.
- [ ] Every minted key is inserted into the `file_upload` ledger (`key`, `dir`, `filename`, `filetype`, `filesize`, `status` = `pending`, timestamps).
- [ ] The ledger exposes a `markSuccess(tx, keys)` operation that can run inside another module's transaction.
- [ ] A GET route (guarded by a cron secret header, scheduled via Vercel cron) deletes `pending` ledger rows older than one hour **and** their corresponding R2 objects.
- [ ] A shared client-side helper presigns and PUTs a `File` to the returned URL with its exact `Content-Type`, returning the `key` for later submission.
- [ ] Presign-and-PUT flow verified end-to-end against a real bucket: uploaded object is readable from the asset domain at its key.
