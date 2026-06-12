# Europe's Bride — Growth Portal

Client dashboard for the Europe's Bride engagement (Rank Local Now). Next.js + Supabase + Vercel, implementing the approved v2 design: Dashboard / Strategy / Monthly Report tabs, admin + client roles, comments, and revenue attribution (bookings × $450).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

With no `.env.local` the app runs in **demo mode**: mock data from `lib/demo-data.js`, simulated role-picker login, comments stored in the browser. Perfect for design review — and it deploys to Vercel this way too.

## Go live with Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. In the SQL Editor, paste and run `supabase/schema.sql`.
3. Copy `.env.local.example` → `.env.local`; fill in the Project URL + anon key (Settings → API), the service role key, and pick passwords for the two seed users.
4. `npm run seed` — creates the admin (Joshua) and client (Ivan) accounts, their roles, and uploads the dashboard document.
5. Restart `npm run dev` — login is now real email/password; comments persist in Postgres with row-level security (clients can read everything and post comments; only admins can edit dashboard data).

## Deploy

```bash
# GitHub (one-time): install GitHub CLI, authenticate, create the repo
brew install gh
gh auth login
gh repo create europes-bride-dashboard --private --source . --push

# Vercel: import the GitHub repo at vercel.com/new (framework auto-detects Next.js).
# Add the two NEXT_PUBLIC_SUPABASE_* env vars in Vercel → Project → Settings → Environment Variables.
```

## The monthly update

All dashboard content — KPIs, trends, bookings, strategy task statuses, and the monthly reports — lives in **one document**:

- **Demo mode:** edit `lib/demo-data.js`.
- **Live:** edit `lib/demo-data.js` then run `npm run seed` (or edit the `dashboard_state` row directly in Supabase → Table Editor).

Add the new month's report to the front of the `reports` array, update `kpis`/`sessionsTrend`/`bookings`, advance strategy task `status` values (`done` / `progress` / `upcoming`) — the progress bars and ring recompute automatically.

## Roadmap (live data sync)

| Source | Plan |
|---|---|
| Google Analytics 4 | Scheduled job (Vercel Cron) pulling the Data API into `dashboard_state` |
| AI referrals | Derived from GA4 referrers (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com) |
| Google Business Profile | Business Profile Performance API, same cron |
| Bookings | GoHighLevel webhook → Supabase (insert per booking) |
