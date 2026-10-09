-- Apply after the 20261008 migrations. Preserve unrelated settings and uploaded artwork.
begin;

update public.bs_partners
set name = 'Top Choco', category = 'sponsor',
    website = case when coalesce(website, '') = '' then 'https://topchoco.com.gh/' else website end,
    image_url = case when coalesce(image_url, '') = '' then '/partners/top-choco.svg' else image_url end
where lower(trim(name)) = 'choco';

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Top Choco', 'sponsor', 'Sponsor', 'https://topchoco.com.gh/', '', '/partners/top-choco.svg'
where not exists (select 1 from public.bs_partners where lower(trim(name)) = 'top choco');

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Flora Tissues', 'sponsor', 'Sponsor', 'https://deltapapermill.com/products/', '', ''
where not exists (select 1 from public.bs_partners where lower(trim(name)) = 'flora tissues');

update public.bs_partners set category = 'sponsor'
where lower(trim(name)) in ('top choco', 'flora tissues');

update public.bs_partners
set image_url = '/partners/top-choco.svg'
where lower(trim(name)) = 'top choco' and coalesce(image_url, '') = '';

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Act Global', 'partner', 'Partner', 'https://www.actglobal.com/', '', '/partners/act-global.png'
where not exists (select 1 from public.bs_partners where lower(trim(name)) = 'act global');

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Harrow Sports', 'partner', 'Partner', 'https://www.harrowsports.com/', '', '/partners/harrow-sports.png'
where not exists (select 1 from public.bs_partners where lower(trim(name)) = 'harrow sports');

update public.bs_partners set image_url = '/partners/act-global.png'
where lower(trim(name)) = 'act global' and coalesce(image_url, '') = '';
update public.bs_partners set image_url = '/partners/harrow-sports.png'
where lower(trim(name)) = 'harrow sports' and coalesce(image_url, '') = '';

insert into public.bs_settings (id, data)
values ('global', '{"phone2":"0244 241 809","addressStreet":"Nikoi Olai Street, Bubuashie","addressCity":"Accra"}'::jsonb)
on conflict (id) do update
set data = coalesce(bs_settings.data::jsonb, '{}'::jsonb)
  || '{"phone2":"0244 241 809","addressStreet":"Nikoi Olai Street, Bubuashie","addressCity":"Accra"}'::jsonb;

commit;
