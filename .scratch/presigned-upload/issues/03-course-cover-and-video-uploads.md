# 03 — Course cover + lesson video uploads

**What to build:** An admin can create and edit a course with a cover image, and add/edit lessons whose videos (up to 500MB) upload directly from the browser to Cloudflare R2 — defeating the ~4.5MB server payload cap that currently blocks video uploads. Course and lesson submissions are JSON carrying minted keys; each key is promoted to `success` inside the same transaction as the corresponding write, and replacing/deleting removes the old R2 object.

**Blocked by:** 01 — File upload infrastructure.

**Status:** ready-for-agent

- [ ] Creating a course: cover image uploads via the shared helper, submitted as JSON (`file` key), DB + ledger-success in one transaction.
- [ ] Editing a course with a new cover replaces the image (old R2 object deleted); editing without a new cover preserves the existing one.
- [ ] Adding a lesson uploads its video directly to R2 (`course-video` category, up to 500MB) and submits `videoFile` as a key in JSON.
- [ ] Editing a lesson with a new video replaces it (old R2 object deleted); editing without a new video preserves the existing one.
- [ ] Deleting a course removes its cover; deleting a lesson removes its video object.
- [ ] A failed save promotes nothing — the ledger row stays `pending` so the sweeper reclaims it.
- [ ] Curriculum lesson editor (create + edit) and course create/edit modal no longer submit multipart form data.
