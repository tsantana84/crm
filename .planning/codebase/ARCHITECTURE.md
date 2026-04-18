# Architecture

**Analysis Date:** 2026-04-18

## Pattern Overview

**Overall:** Next.js 16 Server Component architecture with Server Actions for mutations and real-time database synchronization via Supabase.

**Key Characteristics:**
- Server-First Rendering: Pages are async server components that fetch data on demand
- Server Actions: Mutations (create/update/delete) isolated in `src/actions/` and wrapped with `revalidatePath()`
- Layered Data Access: Database operations abstracted in `src/lib/db/` with consistent patterns
- UI Component Library: shadcn/ui components in `src/components/ui/` for consistent design
- Supabase Integration: Real-time database with eager relationship loading on queries

## Layers

**Presentation Layer (Pages & Client Components):**
- Purpose: Render pages and interactive UI elements
- Location: `src/app/` (route pages) and `src/components/` (reusable components)
- Contains: Next.js page files (`.tsx`), client-side forms, layout wrappers
- Depends on: Server Actions (`src/actions/`), UI components, types from `src/lib/types.ts`
- Used by: Browser/End user

**Server Action Layer:**
- Purpose: Handle server-side mutations (create/update/delete) with cache invalidation
- Location: `src/actions/`
- Contains: Async functions marked with `'use server'`
- Depends on: Database layer (`src/lib/db/`)
- Used by: Client forms and interactive components

**Data Access Layer:**
- Purpose: Execute all Supabase queries with consistent error handling
- Location: `src/lib/db/`
- Contains: CRUD functions for each entity (contacts, deals, activities)
- Depends on: Supabase client (`src/lib/supabase/server.ts`)
- Used by: Server Actions and server components

**Database Client Layer:**
- Purpose: Instantiate and configure Supabase client for server-side execution
- Location: `src/lib/supabase/server.ts`
- Contains: Supabase SSR client with cookie-based session management
- Depends on: `@supabase/ssr` package
- Used by: Data access layer functions

**Type Layer:**
- Purpose: Single source of truth for all application types and enums
- Location: `src/lib/types.ts`
- Contains: Entity types (Contact, Deal, Activity), Insert variants, enums (DealStage, ActivityType), color mappings
- Depends on: Nothing (leaf module)
- Used by: All other layers

**Utility Layer:**
- Purpose: Shared helper functions and constants
- Location: `src/lib/utils.ts` (minimal in this codebase)
- Contains: String utilities, formatting helpers
- Depends on: Nothing significant
- Used by: Components and pages

**Layout/Shell Layer:**
- Purpose: Application frame and navigation structure
- Location: `src/components/layout/` (AppShell, NavLinks)
- Contains: Responsive layout wrapper, main navigation
- Depends on: UI components, Next.js navigation
- Used by: All pages via root layout

## Data Flow

**Entity Display Flow (Read):**

1. Server Component requests data (e.g., `getContacts()` from `src/app/contacts/page.tsx`)
2. Calls database function in `src/lib/db/contacts.ts`
3. DB function creates Supabase client via `src/lib/supabase/server.ts`
4. Supabase query executes with eager relationship loading (`.select('*, contacts(*)')`)
5. Data returned and typed against `src/lib/types.ts`
6. Component renders with data directly in JSX

**Entity Creation Flow (Write):**

1. Client-side form in component (e.g., `ContactForm` in `src/components/contacts/contact-form.tsx`)
2. User submits form with react-hook-form + Zod validation
3. Form calls Server Action (e.g., `createContactAction()` from `src/actions/contacts.ts`)
4. Server Action invokes DB function (e.g., `db.createContact()`)
5. DB function inserts into Supabase and returns created entity
6. Server Action calls `revalidatePath('/contacts')` to invalidate cache
7. Client receives result, shows toast, redirects to list page

**Entity Update Flow (Write):**

1. Edit page renders with current entity data (e.g., `src/app/contacts/[id]/edit/page.tsx`)
2. Form pre-fills with entity data via component props
3. User modifies and submits form
4. Form calls Server Action (e.g., `updateContactAction()`)
5. Server Action invokes DB function with partial update
6. DB function updates timestamp and calls `revalidatePath()` for multiple paths
7. Client receives success toast and redirects

**Kanban Stage Update Flow (Write with Optimistic UI):**

1. DealCard in Kanban board dragged to new stage (client component)
2. `updateDealStageAction()` called immediately with new stage
3. Server Action executes DB update with `updateDealStage()`
4. Multiple paths revalidated (deals, deal details, dashboard)
5. Client UI reflects change immediately, server confirms via revalidation

**State Management:**
- Server state: Managed by Next.js caching and `revalidatePath()` invalidation
- Client state: Minimal - forms use react-hook-form, Kanban board uses `useState` for drag state
- No global state management (Redux, Context API not needed for this scope)

## Key Abstractions

**Database Abstraction:**
- Purpose: Hide Supabase SDK details and provide consistent query patterns
- Examples: `src/lib/db/contacts.ts`, `src/lib/db/deals.ts`, `src/lib/db/activities.ts`
- Pattern: Async functions that create client, execute query, handle errors, return typed data

**Server Action Wrapper:**
- Purpose: Encapsulate mutations with cache invalidation
- Examples: `createContactAction()`, `updateDealStageAction()`, `deleteActivityAction()`
- Pattern: `'use server'` functions that call DB layer, invoke `revalidatePath()`, handle errors

**Type System:**
- Purpose: Enforce data contracts across server/client boundary
- Examples: `Contact`, `Deal`, `Activity` and their `Insert` variants
- Pattern: Types defined once in `src/lib/types.ts`, used everywhere for type safety

**Form Component Abstraction:**
- Purpose: Reusable form implementations with validation
- Examples: `ContactForm`, `DealForm`, `ActivityForm`
- Pattern: Client components with react-hook-form + Zod, call Server Actions on submit

**UI Component Library:**
- Purpose: Consistent, accessible UI across the app
- Examples: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/dialog.tsx`
- Pattern: shadcn/ui base components with Tailwind CSS styling

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: App initialization on all pages
- Responsibilities: Wraps entire app with providers (TooltipProvider, Toaster), sets metadata, loads fonts

**Dashboard Page:**
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetches and displays summary metrics, upcoming activities, recent activity, pipeline overview

**Contacts Page:**
- Location: `src/app/contacts/page.tsx`
- Triggers: GET `/contacts` with optional `?q=` search parameter
- Responsibilities: Displays contacts table, handles search via `getContacts(q)`, links to detail/edit/create

**New Contact Page:**
- Location: `src/app/contacts/new/page.tsx`
- Triggers: GET `/contacts/new`
- Responsibilities: Renders `ContactForm` in create mode

**Deals Page (Kanban):**
- Location: `src/app/deals/page.tsx`
- Triggers: GET `/deals`
- Responsibilities: Fetches deals via `getDealsByStage()`, renders `KanbanBoard` with drag-and-drop

**Activities Page:**
- Location: `src/app/activities/page.tsx`
- Triggers: GET `/activities` with optional filters (`?type=` and `?completed=`)
- Responsibilities: Displays activities table with filters, links to edit/delete

## Error Handling

**Strategy:** Try-catch in Server Actions with user-facing toast notifications.

**Patterns:**
- Database errors thrown directly from `src/lib/db/` functions and caught in Server Actions
- Server Action errors caught with `try-catch`, user sees generic "Something went wrong" toast
- Client-side form validation via Zod prevents some errors before submission
- No global error boundary currently (should be added for edge cases)

Example from `src/actions/contacts.ts`:
```typescript
export async function createContactAction(contact: ContactInsert) {
  const result = await db.createContact(contact)  // Throws on error
  revalidatePath('/contacts')
  return result
}
```

Form submission catches and displays toast:
```typescript
async function onSubmit(data: ContactFormValues) {
  try {
    await createContactAction(data)
    toast.success('Contact created')
  } catch {
    toast.error('Something went wrong')
  }
}
```

## Cross-Cutting Concerns

**Logging:** Not implemented. No structured logging or monitoring currently in place.

**Validation:** Two-layer approach:
- Client-side: Zod schemas in form components prevent obviously bad input
- Server-side: Supabase Row-Level Security (RLS) policies should enforce constraints (not visible in this codebase but assumed configured)
- Missing: Server-side re-validation of user input before database write

**Authentication:** Not implemented. No auth layer, middleware, or session verification. All endpoints are publicly accessible.

**Cache Invalidation:** Explicit via `revalidatePath()` calls in Server Actions. Invalidates specific paths when data changes:
- Contact changes: revalidate `/contacts` and `/contacts/[id]`
- Deal changes: revalidate `/deals`, `/deals/[id]`, and `/` (dashboard)
- Activity changes: revalidate `/activities` and `/activities/[id]`

**Relationship Loading:** Eager loading via Supabase query syntax (`.select('*, contacts(*)')`). Foreign keys are joined at query time, not post-fetch.

---

*Architecture analysis: 2026-04-18*
