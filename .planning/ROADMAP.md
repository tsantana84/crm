# Roadmap: CRM Security & Quality Hardening

## Overview

The CRM app is already built. This hardening effort fixes the security and quality issues that make it unsafe to use with real customer data. Phases execute in dependency order: identity first (auth + RLS), then trust boundary hardening (server-side validation + error handling), then verification that everything works (test coverage).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Auth & Database Security** - Enforce identity and row-level isolation before any other work
- [ ] **Phase 2: Server Validation & Error Handling** - Harden the trust boundary between client and database
- [ ] **Phase 3: Test Coverage** - Verify that phases 1 and 2 work correctly and remain correct

## Phase Details

### Phase 1: Auth & Database Security
**Goal**: Every request is authenticated and every database row is isolated to its owner
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, DB-01, DB-02, DB-03, DB-04
**Success Criteria** (what must be TRUE):
  1. A user can sign up, log in, and stay logged in across browser refresh
  2. Logging out from any page ends the session and redirects to login
  3. Navigating to any app route while unauthenticated redirects to the login page
  4. A server action called without a valid session returns an error — never executes the DB write
  5. A user cannot read or write contacts, deals, or activities that belong to another user (RLS enforced at DB layer)
**Plans**: TBD

### Phase 2: Server Validation & Error Handling
**Goal**: Server actions validate all inputs before touching the database and return structured errors instead of throwing
**Depends on**: Phase 1
**Requirements**: VALID-01, VALID-02, VALID-03, VALID-04, ERR-01, ERR-02, ERR-03, ERR-04
**Success Criteria** (what must be TRUE):
  1. Submitting invalid data to any contact, deal, or activity form returns a structured error message to the UI — no crash, no unhandled exception
  2. A server action receiving malformed input rejects it with a Zod error before any DB call executes
  3. When `updateDealStage` fails, the Kanban board reverts to its previous state instead of showing stale optimistic data
  4. The app renders a user-facing error boundary instead of a blank crash screen when an unhandled error occurs
  5. The silent `catch {}` in `server.ts` is replaced — errors are logged and surfaced, never swallowed
**Plans**: TBD
**UI hint**: yes

### Phase 3: Test Coverage
**Goal**: Automated tests verify that auth enforcement, validation, and error handling behave correctly
**Depends on**: Phase 2
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04
**Success Criteria** (what must be TRUE):
  1. `vitest` runs successfully in CI against the Next.js app without configuration errors
  2. Server action tests cover create/update/delete paths for contacts, deals, and activities — including the unauthenticated rejection path
  3. Form validation tests confirm that valid input passes, invalid input returns the correct structured error, and server errors are surfaced to the UI
  4. DB layer tests run against a mocked or test Supabase client without requiring live credentials
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth & Database Security | 0/TBD | Not started | - |
| 2. Server Validation & Error Handling | 0/TBD | Not started | - |
| 3. Test Coverage | 0/TBD | Not started | - |
