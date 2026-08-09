# The Wire Desk — Production News Platform

Full-stack news publishing platform: Next.js 14 (App Router) + Supabase (Postgres, Auth, Storage) + Vercel.

## What's included

- **Public site**: hero slider, "developing" breaking-news ticker, sidebar (trending/newsletter/sections), category & tag pages, full-text search, single-article pages with related stories, share buttons.
- **Admin panel** (`/admin`): dashboard, post editor (Markdown, drafts/publish, featured/breaking flags, categories, tags, cover image + inline YouTube/audio embeds), category manager, media library (Supabase Storage), site settings (branding, AdSense slot IDs, social links).
- **SEO**: per-page metadata, Open Graph/Twitter cards, `NewsArticle` JSON-LD, dynamic `sitemap.xml`, `robots.txt`.
- **Google AdSense**: script loader + `AdSlot` component wired into header/sidebar/in-article positions, plus `public/ads.txt`.
- **Auth**: Supabase Auth email/password, protected `/admin/*` via middleware, row-level security in Postgres.

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates every table, RLS policy, the `increment_post_views` function, and a public `media` storage bucket.
3. Go to **Authentication → Users → Add user** and create your first admin login (email + password). A `profiles` row is auto-created for them with `role = 'admin'` via a trigger.
4. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose client-side)

## 2. Local setup

```bash
npm install
cp .env.example .env.local
# fill in .env.local with the values from step 1
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` to sign in.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: production news platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 4. Deploy to Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (same as `.env.local`, plus set `NEXT_PUBLIC_SITE_URL` to your final Vercel/custom domain).
4. Deploy. Every push to `main` redeploys automatically.

## 5. Google AdSense

1. Get approved at [adsense.google.com](https://adsense.google.com) and create ad units (header, sidebar, in-article) to get slot IDs.
2. In `/admin/settings`, paste your `ca-pub-...` client ID and the three slot IDs.
3. Edit `public/ads.txt` with the exact line AdSense gives you, commit, and redeploy (ads.txt must be served as a static file at your domain root — this repo already places it correctly).

## 6. Publishing content

- `/admin/posts/new` — write in Markdown. Drop `[youtube:VIDEO_ID_OR_FULL_URL]` or `[audio:https://file.mp3]` anywhere in the body to embed inline, in addition to the dedicated cover/YouTube/audio fields for the article header.
- Mark a post **Featured** to put it in the homepage hero slider, or **Breaking** to put it in the developing ticker.
- Categories and tags are managed from the sidebar; tags are created automatically if you type a new one into the post editor.

## 7. Optional: instant revalidation

Public pages use ISR (60s). For instant updates on publish, add a **Database Webhook** in Supabase (Database → Webhooks) on the `posts` table for INSERT/UPDATE/DELETE, pointing to:

```
https://your-domain.vercel.app/api/revalidate?secret=YOUR_REVALIDATE_SECRET
```

(`REVALIDATE_SECRET` must match the value in your Vercel environment variables.)

## Architecture notes

- `lib/supabase/client.ts` — browser client (Client Components, direct inserts like newsletter/uploads).
- `lib/supabase/server.ts` — server client respecting the signed-in user's session + RLS.
- `lib/supabase/admin.ts` — service-role client, server-only, bypasses RLS (not currently required anywhere but available for future admin tooling).
- `lib/actions.ts` — all Server Actions used by the admin panel (`savePost`, `deletePost`, `saveCategory`, `saveSiteSettings`, media helpers, auth).
- `middleware.ts` — redirects unauthenticated visitors away from `/admin/*` (except `/admin/login`).
- Editorial content is Markdown rendered through `react-markdown` with a sanitize schema that additionally allow-lists `<iframe>`/`<audio>` so inline embeds render safely.
