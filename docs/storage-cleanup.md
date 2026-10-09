# Storage size and image uploads

## New uploads

All admin image uploads use src/lib/api.ts → compressImage.ts before sending bytes to bs-images. Static JPEG/PNG/WebP images are resized proportionally toward a maximum 1920px edge and encoded as WebP starting at quality 0.82. Further quality passes target 500 KiB. An already smaller original is retained, so it can keep its original dimensions. No output larger than 1 MiB is uploaded. Transparency is preserved. SVGs and animated GIF/PNG/WebP files are preserved unchanged only if within 1 MiB; larger ones require manual optimisation. HEIC/unsupported files are rejected with guidance. Inputs above 30 MiB or decoded static images above 50 MP are rejected. Browser resources are released after processing. Encoding failures do not silently upload a large original.

This changes future uploads from the deployed B&S admin only. Direct Dashboard/API uploads bypass this code. As a server-side guard, configure bs-images maximum file size as 1 MiB (1048576 bytes) in its bucket settings. Check that permitted MIME types include image/webp along with JPEG, PNG, GIF and SVG if those are required. This does not compress existing objects.

Browser smoke tests: open /tests/image-compression.html with Vite running. Checks include real encoding, aspect ratio, alpha transparency, small SVG preservation, unsupported/corrupt/oversized animation rejection and the supplied flyer. In the test browser the flyer went from 209183 bytes to 138626 bytes. Results vary with image and browser.

## Existing files

The screenshot reports an organisation-wide billing-period average of 1.40 GB, not necessarily current bs-images usage. Select the affected project and run storage-cleanup.sql in its SQL Editor to identify current bucket totals and the largest 50 objects. Do not assume every file is an image or belongs to this website.

1. Download original copies of candidate files for a local backup.
2. Compress images to WebP or optimised JPEG with a suitable resolution. Keep logos transparent and check flyer text legibility. Retain original encoding for animations unless deliberately converting to a still.
3. If preserving URLs, replace the existing object through the Storage API with the correct Content-Type. A same-path replacement requires UPDATE permissions and may remain cached temporarily. Prefer preserving the actual file format as well when replacing at an existing .jpg/.png path.
4. Alternatively upload under a new name, update every reference in content tables and bs_settings.data, and verify the website before removing the original. This temporarily uses extra storage. Saving a replacement through current admin forms does not automatically delete the prior object.
5. Delete verified unused originals through Supabase Storage Dashboard or Storage API, not SQL. Deleting database rows alone does not delete file bytes. Gallery image deletion currently leaves the original object, so unreferenced assets need a separate audit. Do not automatically delete a file just because it appears absent from one table: it can be shared across content records or settings.
6. Re-run the read-only inventory. The billing-period average will not immediately become the new current total.

No live objects were changed or deleted during this task. A full inventory and reference audit are still needed before a bulk cleanup.

Supabase Image Transformations optimise served responses and do not replace stored originals; they cannot reclaim existing original storage by themselves. Hosted transformations currently require Pro or above.

Sources:
- https://supabase.com/docs/guides/storage/serving/image-transformations
- https://supabase.com/docs/guides/platform/manage-your-usage/storage-size
- https://supabase.com/docs/guides/storage/management/delete-objects
- https://supabase.com/docs/guides/storage/uploads/file-limits
