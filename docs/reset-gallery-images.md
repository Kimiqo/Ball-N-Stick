# Reset gallery images only

Gallery and other site uploads share `bs-images`. Do not empty that bucket for this task. Use `scripts/reset-gallery-images.mjs` to delete only stored images referenced by gallery collections/photo records, while keeping collection names and descriptions. It clears deleted-photo records and cover URLs and recalculates counts.

Files also referenced by events, stories, partners, people, projects or global settings are protected. External images and unreferenced bucket objects are retained: old uploads with no remaining database reference cannot reliably be identified as gallery files. The inventory records those objects for a separate review.

Stop uploads and edits during cleanup. In Terminal at the project root, enter your **Supabase service-role key**, not your Paystack key:

```sh
read -s 'SUPABASE_SERVICE_ROLE_KEY?Supabase service-role key: '
export SUPABASE_SERVICE_ROLE_KEY
node --env-file=.env scripts/reset-gallery-images.mjs
```

The default is an inventory only. It prints the project hostname and size of gallery-only files and saves a metadata manifest in ignored `tmp/storage-reset/`. Check that it is the correct project. This manifest is not a backup of image bytes.

Apply the requested cleanup:

```sh
node --env-file=.env scripts/reset-gallery-images.mjs --apply
unset SUPABASE_SERVICE_ROLE_KEY
```

Then re-upload via Admin → Gallery. Do not run `docs/reset-image-references.sql`: that older helper is for resetting the entire bucket, including unrelated site images.

If the operation fails, some files may already have been deleted. Preserve the manifest, inspect the error and rerun after resolving it; absent objects can be retried and the remaining database references cleared. Never store a service-role key in `.env.example`, Git, frontend `VITE_*` variables or chat.

Local verification: `node scripts/test-gallery-reset.mjs` checks inventory/apply behavior using mocked requests, including protection of shared and unreferenced objects. It makes no live requests.
