# External Integrations

**Analysis Date:** 2026-04-18

## APIs & External Services

**Not detected** - No third-party APIs integrated (Stripe, Twilio, SendGrid, etc.)

## Data Storage

**Databases:**
- PostgreSQL via Supabase
  - Connection: Environment variable `NEXT_PUBLIC_SUPABASE_URL`
  - Client: @supabase/supabase-js (browser) and @supabase/ssr (server)
  - ORM: Direct SQL queries via Supabase client

**Database Schema:**
- `contacts` table - CRM contact records (id, name, email, phone, company, notes, timestamps)
- `deals` table - Sales pipeline deals (id, title, value, stage, contact_id FK, notes, timestamps)
- `activities` table - Customer activities (id, type, title, description, due_date, completed, contact_id FK, deal_id FK, timestamps)
- Indexes on: stage, contact_id, deal_id, due_date, completed

**File Storage:**
- Local filesystem only - No external storage service detected

**Caching:**
- None detected - Uses Next.js built-in caching (revalidatePath for ISR)

## Authentication & Identity

**Auth Provider:**
- Custom/Row-level security through Supabase
- Supabase RLS (Row-Level Security) likely configured but not visible in application code
- No authentication middleware detected in routes
- All database operations use Supabase clients initialized with public API keys

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Rollbar, or similar service

**Logs:**
- Console logging only - Standard console API
- No centralized logging service detected

## CI/CD & Deployment

**Hosting:**
- Supabase (cloud-hosted PostgreSQL and API)
- Deployment platform: Not detected (likely Vercel based on Next.js convention)

**CI Pipeline:**
- None detected - No GitHub Actions, CircleCI, or similar configured

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, exposed to client)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key (public, exposed to client)
- `.env.local` file present but not visible

**Secrets location:**
- `.env.local` - Local environment file (not committed to git)

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Not detected

## Data Flow Pattern

**Browser Client:**
- Supabase client initialized via `createBrowserClient()` in `src/lib/supabase/client.ts`
- Direct database queries from client-side components
- Public API key used for all operations

**Server-Side:**
- Supabase SSR client initialized via `createServerClient()` in `src/lib/supabase/server.ts`
- Server actions in `src/actions/` execute database mutations
- Cookie-based session management for authenticated requests
- Server functions: `createContact`, `updateContact`, `deleteContact`, `createDeal`, `updateDeal`, `updateDealStage`, `deleteDeal`, `createActivity`, `updateActivity`, `deleteActivity`

## Database Operations Pattern

All database access through Supabase client:
- `createClient()` returns authenticated instance
- Queries use `.from(table).select()/insert()/update()/delete()`
- No transaction support visible in current code
- Error handling returns `{ data, error }` tuple pattern

---

*Integration audit: 2026-04-18*
