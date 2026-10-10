# Empty bs-images and start with compressed uploads

This reset removes every stored file from **bs-images only**. Other buckets and content records are preserved. Until you re-upload, gallery photos and images stored in this bucket will be absent. The supplied partner logos and NextGen flyer are bundled with the website, so this reset does not remove them.

## Order

1. Deploy the current website first, so admin re-uploads use compression and the bundled logos are available. Pause uploads during the reset. Retain originals locally if you want to re-upload them; the reset script's inventory is not a file backup.
2. Run `supabase/migrations/202610100001_storage_limits_and_supplied_logos.sql` in Supabase SQL Editor after the earlier migrations. It sets the bs-images upload limit to **1 MiB (1048576 bytes)**, permits the five supported image formats, and assigns the five supplied logos. It does not delete files or alter access policies.
3. Empty the bucket using the Storage API script below. This deletes actual bytes, unlike deleting storage.objects rows. Never DELETE/TRUNCATE storage.objects in SQL.
4. When the script confirms the bucket is empty, run `docs/reset-image-references.sql` in SQL Editor. It refuses to run while files remain. It clears only bs-images URLs in the site's content tables/settings, removes deleted gallery photo entries, and recalculates affected gallery counts. Text records, collections, bundled images, external URLs, phone numbers and settings remain.
5. Re-upload through the website admin. Do not re-upload original large files in Supabase Dashboard: it bypasses frontend compression (the 1 MiB guard still applies). Keep the reference cleanup script as a one-time manual operation; rerunning it after another emptying would clear those new references too.
6. Run `docs/storage-cleanup.sql` to see current file totals and bytes. Supabase's billing-period average does not immediately reset to the current usage.

## Storage API script

From the repository folder, supply server-side credentials in your own terminal. **Do not send the service key in chat or add it to VITE_* variables.** SUPABASE_URL is your project's URL; SUPABASE_SERVICE_ROLE_KEY is an administrator key for this maintenance script.

```sh
export SUPABASE_URL='https://YOUR-PROJECT.supabase.co'
read -s 'SUPABASE_SERVICE_ROLE_KEY?Supabase service role key: '
export SUPABASE_SERVICE_ROLE_KEY
node scripts/reset-image-bucket.mjs
```

The default command saves a timestamped inventory under ignored `tmp/storage-reset/` and deletes nothing. After checking the inventory and confirming the project, run:

```sh
node scripts/reset-image-bucket.mjs --empty bs-images
unset SUPABASE_SERVICE_ROLE_KEY
```

The script targets only bs-images, stops on API errors, and checks for remaining objects before declaring success. For Supabase's bulk-empty operation limit (200,000 files), or queued deletion, follow the official Storage deletion guidance and wait for a verified empty inventory before running reference cleanup. Avoid concurrent uploads until cleanup is finished.

## Upload behaviour

The deployed admin resizes static raster images toward a maximum 1920px edge and encodes WebP, targeting 500 KiB. Efficient originals may be retained. Every uploaded output is capped at 1 MiB; animations and SVG files are preserved only if under that cap. The bucket limit rejects larger uploads from other clients; it does not compress them. There is no automatic total-bucket quota in this migration, so continue checking the inventory as the photo library grows.

Prepared locally; no live files have been deleted and no live migration has been applied.

Sources: https://supabase.com/docs/guides/storage/management/delete-objects and https://supabase.com/docs/guides/storage/uploads/file-limits
