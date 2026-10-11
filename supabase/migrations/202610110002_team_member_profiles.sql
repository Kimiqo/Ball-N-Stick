-- Optional public profile details. Existing names, roles, emails and photos stay intact.
alter table public.bs_people
  add column if not exists bio text not null default '',
  add column if not exists phone text not null default '',
  add column if not exists linkedin_url text not null default '';
