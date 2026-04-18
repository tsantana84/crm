# Requirements: CRM Security & Quality Hardening

**Defined:** 2026-04-18
**Core Value:** Sales reps can trust the CRM with real customer data — protected, validated, and reliable.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password via Supabase Auth
- [ ] **AUTH-02**: User can log in and session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Unauthenticated users are redirected to login page for all routes
- [ ] **AUTH-05**: All server actions reject requests without a valid session

### Validation

- [ ] **VALID-01**: `createContact` / `updateContact` actions validate input with Zod server-side before DB write
- [ ] **VALID-02**: `createDeal` / `updateDeal` / `updateDealStage` actions validate input server-side
- [ ] **VALID-03**: `createActivity` / `updateActivity` actions validate input server-side
- [ ] **VALID-04**: Validation errors return structured error state to client (not thrown exceptions)

### Database Security

- [ ] **DB-01**: RLS enabled on `contacts` table — users can only read/write their own rows
- [ ] **DB-02**: RLS enabled on `deals` table — users can only read/write their own rows
- [ ] **DB-03**: RLS enabled on `activities` table — users can only read/write their own rows
- [ ] **DB-04**: Foreign key constraint enforced on `activities.deal_id → deals.id`

### Error Handling

- [ ] **ERR-01**: Root `error.tsx` boundary catches and displays unhandled errors without crashing app
- [ ] **ERR-02**: Server actions return `{ error: string } | { data: T }` — no unhandled throws to client
- [ ] **ERR-03**: Kanban board rolls back optimistic state when `updateDealStage` action fails
- [ ] **ERR-04**: Silent `catch {}` in `src/lib/supabase/server.ts:20` replaced with logged error handling

### Test Coverage

- [ ] **TEST-01**: Vitest configured with Next.js-compatible setup
- [ ] **TEST-02**: Server actions tested (contacts, deals, activities — create/update/delete paths)
- [ ] **TEST-03**: DB layer functions tested against Supabase test instance or mocked client
- [ ] **TEST-04**: Form validation flows tested (valid input, invalid input, server error response)

## v2 Requirements

### Observability

- **OBS-01**: Audit log table records who changed what and when
- **OBS-02**: Server-side error logging to external service (Sentry or similar)
- **OBS-03**: Dashboard metrics use materialized views or cached counters at scale

### Data Integrity

- **DATA-01**: Soft deletes on contacts, deals, activities (deleted_at column)
- **DATA-02**: Environment variable validation schema at app startup

### Performance

- **PERF-01**: Dashboard metrics cached with `revalidateTag` instead of `revalidatePath`
- **PERF-02**: Database indexes on `status`, `completed_at`, `deal_id` columns

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-tenancy / org isolation | Single-user CRM for now; add when team use is confirmed |
| Rate limiting | No public surface once auth is enforced |
| OAuth / social login | Email/password sufficient for v1 |
| Soft deletes | Deferred to v2 — adds complexity before auth is proven |
| Mobile app | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| DB-01 | Phase 1 | Pending |
| DB-02 | Phase 1 | Pending |
| DB-03 | Phase 1 | Pending |
| DB-04 | Phase 1 | Pending |
| VALID-01 | Phase 2 | Pending |
| VALID-02 | Phase 2 | Pending |
| VALID-03 | Phase 2 | Pending |
| VALID-04 | Phase 2 | Pending |
| ERR-01 | Phase 2 | Pending |
| ERR-02 | Phase 2 | Pending |
| ERR-03 | Phase 2 | Pending |
| ERR-04 | Phase 2 | Pending |
| TEST-01 | Phase 3 | Pending |
| TEST-02 | Phase 3 | Pending |
| TEST-03 | Phase 3 | Pending |
| TEST-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after initial definition*
