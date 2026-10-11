begin;

-- Keep this backfill consistent with uploads; the lock lasts only for this migration.
lock table public.bs_gallery_images in share row exclusive mode;
update public.bs_gallery g
set image_count = (select count(*) from public.bs_gallery_images i where i.collection_id = g.id);

-- Maintain totals in the same transaction as adding/removing/moving a photo.
create or replace function public.bs_sync_gallery_photo_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.bs_gallery set image_count = coalesce(image_count, 0) + 1 where id = new.collection_id;
  elsif tg_op = 'DELETE' then
    update public.bs_gallery set image_count = greatest(0, coalesce(image_count, 0) - 1) where id = old.collection_id;
  elsif new.collection_id is distinct from old.collection_id then
    -- Consistent lock order avoids deadlocks when two photos move in opposite directions.
    perform id from public.bs_gallery where id in (old.collection_id, new.collection_id) order by id for update;
    update public.bs_gallery set image_count = greatest(0, coalesce(image_count, 0) - 1) where id = old.collection_id;
    update public.bs_gallery set image_count = coalesce(image_count, 0) + 1 where id = new.collection_id;
  end if;
  return null;
end;
$$;
revoke all on function public.bs_sync_gallery_photo_count() from public, anon, authenticated;
-- Rerunning this migration preserves an existing trigger.
do $migration$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'bs_gallery_photo_count'
      and tgrelid = 'public.bs_gallery_images'::regclass
      and not tgisinternal
  ) then
    create trigger bs_gallery_photo_count
      after insert or delete or update of collection_id on public.bs_gallery_images
      for each row execute function public.bs_sync_gallery_photo_count();
  end if;
end;
$migration$;

commit;
