-- Extends the existing production schema; apply before deploying the frontend.
-- Existing bs_partners RLS/storage policies remain unchanged and must be audited.
begin;
alter table public.bs_partners add column if not exists category text not null default 'partner'
  check (category in ('partner', 'school', 'sponsor'));
create index if not exists bs_partners_category_idx on public.bs_partners(category);

-- Idempotent seed: preserve any existing records and administrator edits.
insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Association International School', 'school', 'School Partner', 'https://ais.edu.gh/', '', '/partners/school-0.jpg'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Association International School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Akosombo International School', 'school', 'School Partner', 'https://vraschools.com/', '', ''
where not exists (select 1 from public.bs_partners where lower(name) = lower('Akosombo International School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Canadian Independent College', 'school', 'School Partner', 'https://ghanacic.com/', '', '/partners/school-2.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Canadian Independent College'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'East Airport International School', 'school', 'School Partner', 'https://eais-edu.com/', '', '/partners/school-3.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('East Airport International School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Hope College', 'school', 'School Partner', 'https://www.hopecollege.edu.gh/', '', '/partners/school-4.jpeg'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Hope College'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Galaxy International School', 'school', 'School Partner', 'https://galaxy.edu.gh/', '', '/partners/school-5.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Galaxy International School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Legacy Girls’ College', 'school', 'School Partner', 'https://www.lgc.edu.gh/', '', '/partners/school-6.jpg'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Legacy Girls’ College'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Lincoln Community School', 'school', 'School Partner', 'https://www.lincoln.edu.gh/', '', '/partners/school-7.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Lincoln Community School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'SOS Hermann Gmeiner College', 'school', 'School Partner', 'https://www.soshgic.edu.gh/', '', '/partners/school-8.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('SOS Hermann Gmeiner College'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Life International College', 'school', 'School Partner', 'https://lic.edu.gh/', '', '/partners/school-9.jpg'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Life International College'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Tema International School', 'school', 'School Partner', 'https://www.tis.edu.gh/', '', '/partners/school-10.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Tema International School'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Academic City University', 'school', 'School Partner', 'https://acity.edu.gh/', '', '/partners/school-11.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Academic City University'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Ashesi University', 'school', 'School Partner', 'https://ashesi.edu.gh/', '', '/partners/school-12.webp'
where not exists (select 1 from public.bs_partners where lower(name) = lower('Ashesi University'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'GIMPA', 'school', 'School Partner', 'https://gimpa.edu.gh/', '', '/partners/school-13.png'
where not exists (select 1 from public.bs_partners where lower(name) = lower('GIMPA'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'University of Ghana', 'school', 'School Partner', 'https://www.ug.edu.gh/', '', '/partners/school-14.svg'
where not exists (select 1 from public.bs_partners where lower(name) = lower('University of Ghana'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Verna', 'sponsor', 'Sponsor', 'https://twellium.com/verna-mineral-water/', '', ''
where not exists (select 1 from public.bs_partners where lower(name) = lower('Verna'));

insert into public.bs_partners (name, category, type, website, description, image_url)
select 'Choco', 'sponsor', 'Sponsor', '', '', ''
where not exists (select 1 from public.bs_partners where lower(name) = lower('Choco'));

-- Popup configuration is stored inside the existing bs_settings.data JSON object.
-- No live advertisement is enabled by this migration.
commit;
