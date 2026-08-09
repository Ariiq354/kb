# 04 — Ebook cover + PDF uploads

**What to build:** An admin can create and edit an ebook with two separate uploads — a cover image and a PDF — each uploaded directly from the browser to Cloudflare R2. A single save presigns and uploads both files via the shared helper, then submits both keys in one JSON create/update. Each key is promoted to `success` inside the same transaction as the ebook write; replacing/deleting removes the old R2 objects.

**Blocked by:** 01 — File upload infrastructure.

**Status:** ready-for-agent

- [ ] Creating an ebook: cover (`ebook`) and PDF (`ebook-pdf`, up to 50MB) upload directly to R2, submitted together as JSON (`file` + `pdfFile` keys), DB + ledger-success in one transaction.
- [ ] Editing an ebook: a newly-uploaded cover or PDF replaces its old object; untouched files are preserved; each replaced object is deleted from R2.
- [ ] Deleting an ebook removes both its cover and PDF R2 objects.
- [ ] A failed save promotes nothing — the ledger rows stay `pending` so the sweeper reclaims them.
- [ ] Ebook create/edit modal no longer submits multipart form data.
