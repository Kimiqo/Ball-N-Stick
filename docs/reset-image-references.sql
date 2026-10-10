-- MANUAL, ONE-TIME RESET. Run only AFTER emptying bs-images through Storage API
-- or Dashboard. Keep uploads paused until this transaction completes.
-- This preserves content records and bundled/external images. Do not schedule
-- this as a normal migration: running it again would clear new uploads.
begin;

do $$ begin
  if exists (select 1 from storage.objects where bucket_id = 'bs-images') then
    raise exception 'bs-images still has files. Empty it using Storage API/Dashboard first.';
  end if;
end $$;

-- Clear only URLs that point into the bucket being reset.
do $$
declare table_name text;
begin
  foreach table_name in array array['bs_events', 'bs_gallery', 'bs_stories', 'bs_partners', 'bs_people', 'bs_projects'] loop
    execute format(
      'update public.%I set image_url = %L where image_url ~ %L',
      table_name, '', '/storage/v1/(object|render/image)/(public|sign|authenticated)/bs-images/'
    );
  end loop;
end $$;

-- Remove dead photo entries, retaining collections and accurate photo counts.
with affected as (
  delete from public.bs_gallery_images
  where image_url ~ '/storage/v1/(object|render/image)/(public|sign|authenticated)/bs-images/'
  returning collection_id
)
update public.bs_gallery g
set image_count = (
  select count(*) from public.bs_gallery_images i
  where i.collection_id = g.id
    and i.image_url !~ '/storage/v1/(object|render/image)/(public|sign|authenticated)/bs-images/'
)
where g.id in (select collection_id from affected);

-- Recursively scrub settings, including carousel arrays and nested promotion.
create or replace function pg_temp.clear_bs_image_urls(value jsonb)
returns jsonb language plpgsql as $$
declare result jsonb; item record;
begin
  if jsonb_typeof(value) = 'string' then
    if (value #>> '{}') ~ '/storage/v1/(object|render/image)/(public|sign|authenticated)/bs-images/' then
      return '""'::jsonb;
    end if;
    return value;
  elsif jsonb_typeof(value) = 'object' then
    result := '{}'::jsonb;
    for item in select key, val from jsonb_each(value) as e(key, val) loop
      result := result || jsonb_build_object(item.key, pg_temp.clear_bs_image_urls(item.val));
    end loop;
    return result;
  elsif jsonb_typeof(value) = 'array' then
    select coalesce(jsonb_agg(cleaned order by position), '[]'::jsonb) into result
    from (
      select pg_temp.clear_bs_image_urls(val) as cleaned, position
      from jsonb_array_elements(value) with ordinality as e(val, position)
    ) items where cleaned <> '""'::jsonb;
    return result;
  end if;
  return value;
end $$;

update public.bs_settings
set data = pg_temp.clear_bs_image_urls(data::jsonb)
where id = 'global';

-- Keep the supplied event flyer available if its old file was in this bucket.
update public.bs_settings
set data = jsonb_set(data::jsonb, '{event_promotion,image_url}', '"/events/nextgen-hockey-festival-2026.jpeg"'::jsonb)
where id = 'global'
  and data::jsonb #>> '{event_promotion,title}' = 'NextGen Hockey Festival'
  and data::jsonb #>> '{event_promotion,image_url}' = '';

commit;
