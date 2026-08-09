# 06 — Remove multipart machinery

**What to build:** With every upload migrated to presigned keys, the server-side multipart upload path is dead code. Remove the server-side `uploadFile` and the multipart zod/validator helpers and their backing route handlers, leaving only `createPresignedUpload` and `deleteFile` as the file API. The build and typecheck confirm nothing references them anymore.

**Blocked by:** 02, 03, 04, 05.

**Status:** ready-for-agent

- [ ] No server code path reads multipart/form-data for uploads anymore.
- [ ] The single-file server-side `uploadFile` is removed along with the multipart validation helpers it served.
- [ ] `createPresignedUpload` and `deleteFile` remain as the only file utilities.
- [ ] Typecheck and lint pass with no dangling imports or references.
