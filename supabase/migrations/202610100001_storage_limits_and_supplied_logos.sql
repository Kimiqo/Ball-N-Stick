-- Apply after previous partner migrations. Does not delete any objects.
begin;

-- Server-side guard for all upload clients, including the Dashboard.
update storage.buckets
set file_size_limit = 1048576,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
where id = 'bs-images';

do $$ begin
  if not exists (select 1 from storage.buckets where id = 'bs-images') then
    raise exception 'bs-images bucket is missing; create it before applying this migration';
  end if;
end $$;

-- Supplied artwork deliberately replaces these five logos. Bundled files do
-- not consume Supabase Storage and survive an empty-bucket operation.
update public.bs_partners p set image_url = logos.path
from (values
  ('field hockey canada', '/partners/field-hockey-canada.webp'),
  ('flora tissues', '/partners/flora-tissues.webp'),
  ('verna', '/partners/verna.webp'),
  ('akosombo international school', '/partners/akosombo-international.webp'),
  ('gimpa', '/partners/gimpa.webp')
) as logos(name, path)
where lower(trim(p.name)) = logos.name;

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Field Hockey Canada', 'partner', 'Partner', 'https://fieldhockey.ca/', '', '/partners/field-hockey-canada.webp'
where not exists (select 1 from public.bs_partners where lower(trim(name)) = 'field hockey canada');

commit;
