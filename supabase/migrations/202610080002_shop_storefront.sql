-- Set the supplied Storefront URL without replacing other site settings.
insert into public.bs_settings (id, data)
values ('global', '{"shop_url":"https://paystack.shop/ball-and-stick-shop"}'::jsonb)
on conflict (id) do update
set data = coalesce(bs_settings.data::jsonb, '{}'::jsonb)
  || '{"shop_url":"https://paystack.shop/ball-and-stick-shop"}'::jsonb;
