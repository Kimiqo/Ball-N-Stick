// Server-side maintenance only. Never expose a service role key in VITE_*.
import { createClient } from '@supabase/supabase-js';
import { mkdir, writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node scripts/reset-image-bucket.mjs [--empty bs-images]\nDefault: inventory only. Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(0);
}
if (args.length && (args.length !== 2 || args[0] !== '--empty' || args[1] !== 'bs-images')) {
  throw new Error('Only --empty bs-images is accepted. Omit arguments for an inventory.');
}
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in this terminal. Do not put the service key in frontend .env files.');
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = 'bs-images';
const objects = [];
async function inventory(prefix = '') {
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await client.storage.from(bucket).list(prefix, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw error;
    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) objects.push({ path, bytes: Number(entry.metadata?.size || 0) });
      else await inventory(path);
    }
    if (data.length < 100) break;
  }
}
await inventory();
const bytes = objects.reduce((sum, object) => sum + object.bytes, 0);
console.log(`${bucket}: ${objects.length} files, ${(bytes / 1048576).toFixed(2)} MiB`);
await mkdir('tmp/storage-reset', { recursive: true });
const manifest = `tmp/storage-reset/bs-images-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
await writeFile(manifest, JSON.stringify({ bucket, captured_at: new Date().toISOString(), bytes, objects }, null, 2));
console.log(`Inventory saved to ${manifest}. This is a list, not a backup of file contents.`);
if (!args.length) {
  console.log('No files deleted. Use --empty bs-images to permanently empty this bucket.');
} else {
  const { error } = await client.storage.emptyBucket(bucket);
  if (error) throw error;
  objects.length = 0;
  await inventory();
  if (objects.length) throw new Error(`${objects.length} objects remain. Wait for any queued deletion, stop uploads, and run inventory again before SQL cleanup.`);
  console.log('Bucket is empty. Run docs/reset-image-references.sql next, then re-upload through the deployed admin.');
}
