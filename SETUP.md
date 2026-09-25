# Getting this live

Code-side, the signup form and analytics are wired up. What's left needs your
own accounts (Supabase, Google, GitHub, Vercel), so it has to happen from your
side rather than something I can do for you.

## 1. Supabase (leads database)

1. Create a project at supabase.com (or reuse an existing org project — this
   just needs one extra table, it doesn't need to be its own project).
2. Open the SQL Editor and run `supabase/schema.sql` from this repo. It
   creates a `signups` table and locks it down with Row Level Security so the
   public key can only ever INSERT, never read/update/delete.
3. Go to Project Settings > API and copy the Project URL and the `anon`
   public key.
4. Put them in `.env.local` (copy `.env.example` first) for local testing.
5. To browse or export leads later: Supabase dashboard > Table Editor >
   `signups`. That view uses your logged-in session, which bypasses RLS, so
   you'll see everything even though the public key can't read it.

## 2. Google Analytics 4 (time on site, dwell time, scroll depth)

1. Create a GA4 property at analytics.google.com, add a Web data stream for
   the domain this will live on.
2. Copy the Measurement ID (looks like `G-XXXXXXXXXX`).
3. Confirm **Enhanced measurement** is turned on for that data stream (it's
   on by default for new streams) — this is what gives you scroll depth
   (fires at 90%), outbound clicks, and engagement/dwell time automatically,
   with no extra code.
4. Put the Measurement ID in `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
5. GA4 data only reports in production (the script is gated to
   `NODE_ENV === 'production'`), so you won't see anything from local `pnpm dev`
   — that's expected, verify it after the first real deploy instead.

## 3. Push to GitHub

```
git init
git add -A
git commit -m "Initial commit"
```

Then create an empty repo on GitHub and push:

```
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## 4. Deploy to Vercel

1. Import the GitHub repo at vercel.com/new.
2. Add the three env vars from `.env.example` (with your real values) in
   the Vercel project's Environment Variables settings.
3. Deploy.
4. Attach your domain under Project Settings > Domains — Vercel handles SSL
   automatically.

## 5. Verify end to end

- Submit a real test email on the live URL, then check it shows up in
  Supabase's Table Editor.
- Check GA4's Realtime report to confirm the pageview (and, after scrolling
  the page, the scroll event) is showing up.
- Try submitting the same email twice — it should show a normal success
  state both times (duplicates are treated as already-subscribed, not an
  error).
