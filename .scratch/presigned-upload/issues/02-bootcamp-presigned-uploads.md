# 02 — Bootcamp uploads via presigned keys

**What to build:** An admin can create and edit a bootcamp with a flyer uploaded straight from the browser to Cloudflare R2, rather than through the server. The create/update submission is ordinary JSON carrying the minted key. On save, the bootcamp's ledger key is promoted to `success` inside the same transaction as the bootcamp write; a failed write leaves it `pending` for the sweeper. Replacing or deleting a bootcamp removes the old R2 object.

**Blocked by:** 01 — File upload infrastructure.

**Status:** ready-for-agent

- [ ] Creating a bootcamp: client presigns+uploads the flyer via the shared helper, submits `{ ...bootcamp fields, file: key }` as JSON, and DB + ledger-success happen in one transaction.
- [ ] Editing a bootcamp with a new flyer replaces the image (old R2 object deleted) and promotes the new key.
- [ ] Editing a bootcamp without changing the flyer sends no file key and preserves the existing flyer.
- [ ] Deleting a bootcamp removes its R2 object.
- [ ] A failed save promotes nothing — the ledger row stays `pending` so the sweeper reclaims it.
- [ ] Bootcamp create/edit modal no longer submits multipart form data.
