# CRM — Security & Quality Hardening

## What This Is

A Next.js 16 + Supabase sales CRM for managing contacts, deals (Kanban pipeline), and activities. v1 is fully built and functional. This milestone focuses on hardening it for production: authentication, server-side validation, error handling, and test coverage.

## Core Value

Sales reps can trust the CRM with real customer data — protected, validated, and reliable.

## Requirements

### Validated

- ✓ Contacts CRUD (list, create, edit, delete, search) — existing
- ✓ Deals pipeline with Kanban board and drag-and-drop stage management — existing
- ✓ Activities tracking with filtering by type, status, contact, deal — existing
- ✓ Dashboard with summary metrics (counts, open deals, upcoming activities) — existing
- ✓ Responsive layout with dark/light mode and navigation shell — existing

### Active

- [ ] Authentication — users must log in to access any data
- [ ] Authorization — server actions must verify session before every mutation
- [ ] Server-side input validation — all server actions validate with Zod before DB operations
- [ ] Row-Level Security — Supabase RLS policies on all tables
- [ ] Error handling — error boundaries, action error return types, no silent failures
- [ ] Test coverage — critical paths covered (actions, DB layer, forms)

### Out of Scope

- Multi-tenancy / team accounts — single-user CRM for now; add org isolation if needed later
- Audit logging — useful, deferred until auth + RLS is proven stable
- Soft deletes — low priority; defer to next milestone
- Rate limiting — no public surface area once auth is in place
- Performance optimization (materialized views, caching) — not a bottleneck at current scale

## Context

- Stack: Next.js 16 App Router, React 19, Supabase (Postgres + SSR client), Tailwind 4, shadcn/ui, react-hook-form + Zod
- Supabase Auth is configured in the project but **never wired** — auth helpers exist in `src/lib/supabase/server.ts` but no session checks anywhere
- All server actions in `src/actions/` accept and pass user input to DB without validation
- DB layer in `src/lib/db/` calls Supabase directly with no abstraction or error handling
- Zero test coverage — no test framework configured
- RLS is disabled on all tables (confirmed in audit)
- Kanban optimistic updates can diverge on network failure — needs error rollback
- `src/lib/supabase/server.ts:20` has silent `catch {}` swallowing cookie errors

## Constraints

- **Tech Stack**: Stay on Next.js + Supabase — no framework changes
- **Auth Provider**: Use Supabase Auth (already configured, just unwired) — don't introduce NextAuth
- **Validation**: Reuse existing Zod schemas from `src/lib/types.ts` — no duplicate schemas
- **Testing**: Vitest is the right fit for this stack (works with Next.js without Jest config pain)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase Auth (not NextAuth) | Already in the project, native RLS integration | — Pending |
| Server-side Zod validation in actions layer | Client validation can be bypassed; actions are the trust boundary | — Pending |
| Vitest for testing | Better Next.js/ESM compatibility than Jest; simpler config | — Pending |
| Fix kanban rollback before adding auth | Auth will add complexity; simpler to fix state bugs first | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 after initialization*
