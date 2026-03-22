# DREAMEVO Minimal Owner Admin Setup

This project now includes `frontend/admin.html` for owner-only settings.
There is no public "Sign In" button on the landing page.

## 1) Set owner emails

In `frontend/config.js`, add your owner emails:

```js
window.DREAMEVO_OWNER_EMAILS = ['you@yourdomain.com'];
```

Also set a private owner route key:

```js
window.DREAMEVO_OWNER_ROUTE_KEY = 'change-this-private-key';
```

## 2) Create table in Supabase

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.site_settings (
  id integer primary key,
  start_cta_text text,
  instagram_reel_url text,
  show_reel_button boolean not null default true,
  show_choose_own_dream boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, start_cta_text, show_reel_button, show_choose_own_dream)
values (1, 'START YOUR JOURNEY', false, true)
on conflict (id) do nothing;
```

## 3) Enable RLS + policies (owner-only write)

Policy below is prefilled for your owner email.

```sql
alter table public.site_settings enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "owner write site_settings" on public.site_settings;
create policy "owner write site_settings"
on public.site_settings for all
to authenticated
using (auth.jwt() ->> 'email' = 'adityamuke@gmail.com')
with check (auth.jwt() ->> 'email' = 'adityamuke@gmail.com');
```

If you have multiple owners, create one policy with an `in (...)` check:

```sql
auth.jwt() ->> 'email' in ('owner1@yourdomain.com', 'owner2@yourdomain.com')
```

## 4) Enable magic-link auth

In Supabase Auth settings:
- Enable Email provider.
- Enable Magic Link / OTP.
- Add your deployed `admin.html` URL as an allowed redirect URL.

## 5) Use admin panel

- Open `/admin.html?k=YOUR_PRIVATE_ROUTE_KEY`
- Enter owner email and send magic link.
- Click email link and then "refresh session".
- Save site settings.

The public landing (`index.html`) automatically reads `site_settings` and applies:
- Hero CTA text
- Reel URL + show/hide reel button
- Show/hide "Choose your own dream" section
