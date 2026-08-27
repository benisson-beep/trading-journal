# Trading Journal — Project Progress

## Project Goal
Building a professional trading journal SaaS (like TradeZella/Edgewonk) as a learning project.
Explicit goal: become a professional full-stack developer through the build, not just ship an app.
Mentor working style: architecture explained before code, every file/line explained, no code dumps
without explanation, flag shortcuts vs. production approaches, occasional understanding checks.

## Tech Stack
- Next.js 16 (App Router, Turbopack), React, TypeScript
- Tailwind CSS, shadcn/ui (Base UI primitives, Nova preset)
- PostgreSQL via Supabase (session pooler), Prisma ORM v7 (`prisma-client` generator + `PrismaPg` driver adapter — required in Prisma 7, not optional)
- Auth.js v5 (`next-auth@beta`) with Google OAuth
- Supabase Storage (screenshots — complete)
- Recharts (analytics charts)
- Repo: `https://github.com/benisson-beep/trading-journal.git` (main branch)
- Local path: `C:\Users\user\Projects\trading-journal`

## Current Architecture
- `app/page.tsx` — public landing page, redirects to `/dashboard` if logged in
- `app/dashboard/layout.tsx` — protected layout (session check + redirect), header with nav (Dashboard, Trades, Analytics) + sign-out
- `app/dashboard/page.tsx` — overview with stat cards
- `app/dashboard/trades/page.tsx` — trade list (includes tags, notes preview, P&L, screenshot thumbnail)
- `app/dashboard/trades/new/page.tsx` — add trade form (symbol, direction, entry/exit price, quantity, contractSize, fees, date, tags, notes, screenshot)
- `app/dashboard/trades/[id]/edit/page.tsx` — edit trade form, pre-filled, includes tags and current screenshot preview
- `app/dashboard/trades/actions.ts` — Server Actions: `createTrade`, `updateTrade`, `deleteTrade`, `getOrCreateTags`, `getUserTags`, `uploadScreenshot`, plus internal `saveScreenshot` helper
- `app/dashboard/analytics/page.tsx` — full analytics dashboard
- `lib/trade-utils.ts` — **single source of truth** for all calculations (pure functions): `calculatePnl`, `calculateStats`, `calculateEquityCurve`, `calculateDailyPerformance`, `calculateMonthlyPerformance`
- `lib/supabase-admin.ts` — service-role Supabase client (`supabaseAdmin`) and `getScreenshotUrl(path)` helper for generating signed URLs
- `components/charts/` — `equity-curve-chart.tsx`, `win-loss-pie-chart.tsx`, `monthly-performance-chart.tsx`, `performance-calendar.tsx` (all Client Components, "use client")
- `auth.ts` — Auth.js config, Google provider (explicit clientId/clientSecret), Prisma signIn callback (upserts User on login)

## Database Schema (Prisma)
- `User`: id, email (unique), name, trades[], tags[]
- `Trade`: id, userId (FK), symbol, direction (enum LONG/SHORT), entryPrice, exitPrice, quantity (Decimal), contractSize (Decimal, default 1), fees, date, notes (String?), screenshotPath (String?), tags (many-to-many via Tag[]), createdAt
- `Tag`: id, name, userId (FK), trades[], `@@unique([userId, name])`
- Migrations applied in order: init → contract size → decimal quantity → tags → trade notes → screenshot path

## Features Completed (full MVP + beyond)
1. ✅ Google sign-in/sign-out, protected routes
2. ✅ Add/edit/delete trades, scoped securely to logged-in user (never trust client-provided ID alone — always filter by userId too)
3. ✅ Trade list with correct P&L for lot-based instruments (quantity × contractSize)
4. ✅ Full Analytics dashboard: Total Trades, Net P&L, Win Rate, Gross Profit/Loss, Profit Factor, Avg Win/Loss, Risk/Reward, Expectancy, Equity Curve chart, Win/Loss Pie chart, Monthly Performance bar chart, Daily Performance calendar heatmap
5. ✅ Trade tags (proper many-to-many relation, not comma-string shortcut)
6. ✅ Trade notes (textarea, truncated preview in list)
7. ✅ Screenshot uploads via Supabase Storage (private bucket + signed URLs)

## Completed: Screenshot Uploads (Supabase Storage)
**Architecture:** private bucket + signed URLs (not public bucket), since screenshots may contain
sensitive account info. Flow: browser form → Server Action → buffer → service-role Supabase client →
upload to Storage → store `screenshotPath` (not URL) on the Trade row → generate a fresh signed URL
on-demand whenever a trade with a screenshot is displayed.

**Implementation:**
- `lib/supabase-admin.ts` — exports `supabaseAdmin` (service-role client, server-only) and
  `getScreenshotUrl(path)` (generates a 1-hour signed URL, returns `null` on error instead of throwing)
- `app/dashboard/trades/actions.ts` — shared internal `saveScreenshot(userId, tradeId, formData)`
  helper, called from `createTrade`, `updateTrade`, and the standalone `uploadScreenshot` action
- `Trade.screenshotPath String?` — stores the storage path, not a URL (signed URLs expire, so we
  never persist one)
- File inputs added to both new-trade and edit-trade forms (`name="screenshot"`,
  `accept="image/png,image/jpeg,image/webp"`)
- Trades list page shows a small thumbnail (linking to full-size signed URL) per trade with a screenshot
- Edit page shows the current screenshot above the file input before replacing it

**Lessons learned during this feature:**
- Dev server caches the generated Prisma Client in memory — after `prisma migrate dev`, a running
  dev server can still throw "Unknown argument" on new fields until fully restarted (not just
  hot-reloaded). Fix: stop server → `npx prisma generate` → `Remove-Item -Recurse -Force .next` →
  restart
- VS Code editor can show a file as saved when the actual file on disk is empty — always verify with
  `Get-Content` after creating a new file, not just visually
- When using `action={serverActionFn}` directly on a `<form>`, Next.js handles multipart FormData
  automatically — no need for `encType="multipart/form-data"` (that's only required for traditional
  non-JS form submissions)
- Supabase free-tier projects auto-pause after a period of inactivity; dashboard access (including
  the API Keys page) is hidden until the project is manually restored
- Supabase has renamed/reorganized dashboard navigation — keys now live under Settings → API Keys,
  with legacy `service_role`/`anon` keys separate from newer `secret`/`publishable` keys (we're using
  legacy `service_role` for now, deliberately, for simplicity while learning fundamentals)

## Post-MVP Ideas (from competitor research — FreeTradeJournal, TradeZella, Edgewonk)
- Calendar heatmap (supportable by existing schema without redesign)
- Enhanced equity curve
- Eventual Vercel deployment

## Recurring Lessons / Debugging Patterns Learned
- **Always regenerate Prisma Client after schema changes**: `npx prisma generate` — forgetting this causes "Unknown field" errors even when schema/migration are correct
- **Prisma 7 requires explicit driver adapter**: `new PrismaPg({ connectionString })` passed into `new PrismaClient({ adapter })` — bare `new PrismaClient()` fails
- **`updateMany` cannot write relations** (like tags `connect`/`set`) — must verify ownership via `findFirst` then use `update` by unique id instead
- **PowerShell `-Path` mishandles `[brackets]`** (e.g. `[id]` dynamic route folders) — always use `-LiteralPath` for these
- **Verify every file save via terminal**, not just the VS Code editor view — `Get-Content`/`Select-String` are ground truth; the editor can show stale/unsaved state
- **Stale Turbopack cache** can cause phantom errors after schema/dependency changes — `Remove-Item -Recurse -Force .next` then restart fixes it when other fixes don't
- **`npm audit` findings**: mostly dev-tooling peer dependency noise across this project; deliberately deferred, not ignored — revisit before deployment
- **Auth.js v5 env var convention differs from v4** — bare `providers: [Google]` looks for `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`; we instead pass `clientId`/`clientSecret` explicitly from `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` to avoid ambiguity
- **Percent-encode `.env` connection string passwords carefully** — a literal `@` in the password must become `%40`, but the connection string's own structural `@` (before the host) must stay literal — don't double-encode
- **Decimal fields**: pass to Prisma as strings (from FormData), not JS numbers, to avoid floating-point precision issues; convert with `Number()` only for display/math, never for storage
- **Contract size / lot sizing**: for stocks, contractSize=1; for forex/indices/CFDs, contractSize = point value per lot (broker-specific, must be checked in broker's contract specs) — quantity alone is not enough for accurate P&L on non-stock instruments

## Working Habits Established
- Git commit after every meaningful step, imperative-mood messages, verify with `git status`/`git push` before moving on
- Check for and clean up stray/duplicate files immediately (happened a few times: `trade-stats.ts`, root-level `trade-utils.ts`, a stray `.zip`)
- Never paste real secrets in full — mask values, rotate anything accidentally exposed
- `.gitignore` covers `.env*`, `/lib/generated`, `*.zip`