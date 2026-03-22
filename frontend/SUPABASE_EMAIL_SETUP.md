# Store User Emails in Supabase (Free Tier)

DreamPulse saves each user's email to a Supabase database when they enter it before starting a journey. Supabase's **free tier** is enough for **up to 10,000 users** (and beyond: 500MB database, 50k monthly active users).

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New project**.
3. Pick an organization, name the project (e.g. `dreampulse`), set a database password, and choose a region.
4. Wait for the project to be ready.

## 2. Create the `email_captures` table

In the Supabase dashboard: **SQL Editor** → **New query**. Paste and run:

```sql
-- One row per email (upsert updates captured_at if email already exists)
create table if not exists public.email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  captured_at timestamptz not null default now(),
  source text
);

-- Allow anonymous inserts from the app (required for frontend-only usage)
alter table public.email_captures enable row level security;

create policy "Allow anonymous insert"
  on public.email_captures
  for insert
  to anon
  with check (true);

-- Optional: prevent reads from anon so users can't list emails from the client
create policy "No anon read"
  on public.email_captures
  for select
  to anon
  using (false);
```

## 3. Get your project URL and anon key

1. In the dashboard go to **Settings** (gear) → **API**.
2. Copy:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## 4. Configure the frontend

1. In the `frontend` folder, copy the example config:
   - **Windows:** `copy config.example.js config.js`
   - **Mac/Linux:** `cp config.example.js config.js`
2. Open `config.js` and set:
   - `window.DREAMPULSE_SUPABASE_URL` = your Project URL
   - `window.DREAMPULSE_SUPABASE_ANON_KEY` = your anon public key
3. Add `config.js` to `.gitignore` so you don’t commit keys:
   ```
   frontend/config.js
   ```

After this, every email submitted in the app is stored in `email_captures` (one row per email; if the same email is used again, `captured_at` is updated).

## Viewing captured emails

In Supabase: **Table Editor** → **email_captures**. You can export to CSV or use the API for your own tools.

## Security note

The **anon** key is safe to use in the browser. RLS limits access so that:
- Anonymous users can **insert** rows (so the form can save emails).
- Anonymous users do **not** have **select** on the table (so the list of emails isn’t readable from the client).

Use the **service_role** key only in a secure backend, never in the frontend.
