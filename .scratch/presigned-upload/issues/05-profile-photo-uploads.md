# 05 — Profile photo uploads

**What to build:** Any logged-in user can update their profile photo, uploaded straight from the browser to Cloudflare R2. This is the first category gated by plain authentication rather than admin — it exercises the per-token role gate end to end. The profile update is JSON carrying the minted key; the key is promoted to `success` inside the same transaction as the profile write, and the old photo object is deleted on replace.

**Blocked by:** 01 — File upload infrastructure.

**Status:** ready-for-agent

- [ ] A logged-in user presigns and uploads their photo (`user-image`) via the shared helper and submits it as `file` key in JSON to the profile update endpoint.
- [ ] A member without admin role can upload to `user-image` but is rejected from any admin-only category.
- [ ] Replacing an existing photo deletes the old R2 object; removing the photo (clearing it) deletes the object as well.
- [ ] A failed save promotes nothing — the ledger row stays `pending` so the sweeper reclaims it.
- [ ] Profile edit form no longer submits multipart form data.
