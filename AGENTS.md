<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- GSD:project-start source:PROJECT.md -->
## Project

**CRM — Security & Quality Hardening**

A Next.js 16 + Supabase sales CRM for managing contacts, deals (Kanban pipeline), and activities. v1 is fully built and functional. This milestone focuses on hardening it for production: authentication, server-side validation, error handling, and test coverage.

**Core Value:** Sales reps can trust the CRM with real customer data — protected, validated, and reliable.

### Constraints

- **Tech Stack**: Stay on Next.js + Supabase — no framework changes
- **Auth Provider**: Use Supabase Auth (already configured, just unwired) — don't introduce NextAuth
- **Validation**: Reuse existing Zod schemas from `src/lib/types.ts` — no duplicate schemas
- **Testing**: Vitest is the right fit for this stack (works with Next.js without Jest config pain)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All source code, strict mode enabled
- JavaScript - Build configuration and tooling
- SQL - Database migrations and Supabase schema
## Runtime
- Node.js (LTS) - Required for Next.js runtime
- npm - Specified in package.json
- Lockfile: package-lock.json (present)
## Frameworks
- Next.js 16.2.4 - Full-stack React framework with server components, server actions, and App Router
- React 19.2.4 - UI library
- React DOM 19.2.4 - React DOM rendering
- Tailwind CSS 4 - Utility-first CSS framework
- PostCSS 4 (@tailwindcss/postcss) - CSS processor for Tailwind
- shadcn - Component library built on Tailwind and Radix UI
- class-variance-authority 0.7.1 - Component style variants
- tailwind-merge 3.5.0 - Merge Tailwind classes without conflicts
- tw-animate-css 1.4.0 - Tailwind animation utilities
- Next.js built-in font optimization (Geist, Geist Mono via next/font)
- react-hook-form 7.72.1 - Form state management
- @hookform/resolvers 5.2.2 - Schema validation adapters for react-hook-form
- zod 4.3.6 - TypeScript-first schema validation
- Lucide React 1.8.0 - Icon library
- sonner 2.0.7 - Toast notification library
- @base-ui/react 1.4.0 - Low-level headless component library
- clsx 2.1.1 - Utility for conditional className strings
- next-themes 0.4.6 - Theme management (light/dark mode)
- @dnd-kit/core 6.3.1 - Drag and drop primitives
- @dnd-kit/sortable 10.0.0 - Sortable component addon
- @dnd-kit/utilities 3.2.2 - Utility functions for dnd-kit
- Not detected - No test framework configured
- ESLint 9 - JavaScript/TypeScript linting
- eslint-config-next 16.2.4 - Next.js ESLint configuration
- TypeScript 5 - Type checking
- PostCSS - CSS processing
## Key Dependencies
- @supabase/supabase-js 2.103.3 - Supabase client for browser/client-side database operations
- @supabase/ssr 0.10.2 - Supabase SSR utilities for server-side database operations with cookie handling
- supabase 2.92.1 - Supabase CLI for local development and database migrations
## Configuration
- `.env.local` file present - Contains environment variables (not readable for security)
- Required variables (public):
- `next.config.ts` - Next.js configuration (minimal, uses defaults)
- `tsconfig.json` - TypeScript configuration with strict mode, ES2017 target, path aliases (@/*)
- `eslint.config.mjs` - ESLint configuration with Next.js and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4
- `next-env.d.ts` - Auto-generated Next.js type definitions
- TypeScript strict mode enabled globally
## Platform Requirements
- Node.js (LTS recommended)
- npm or compatible package manager
- Supabase CLI (for local development)
- Next.js standalone deployment target
- Vercel (recommended) or Node.js runtime environment
- Supabase cloud instance (PostgreSQL)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Kebab-case for component files: `delete-contact-button.tsx`, `contact-form.tsx`, `kanban-board.tsx`, `app-shell.tsx`
- Kebab-case for utility/library files: `contact-search.tsx`, `activity-filters.tsx`, `deal-card.tsx`
- Server component files use `.ts` or `.tsx` extension; client components use `.tsx` with `'use client'` directive
- camelCase for function names: `createContactAction()`, `getContact()`, `handleDragStart()`, `findContainer()`
- Handler functions prefixed with `handle`: `handleDelete()`, `handleDragEnd()`, `handleDragCancel()`, `handleDragOver()`
- Async server functions suffixed with `Action`: `createContactAction()`, `updateContactAction()`, `deleteContactAction()`, `updateDealStageAction()`
- Database query functions prefixed with verb: `getContacts()`, `getContact()`, `createContact()`, `updateContact()`, `deleteContact()`
- camelCase for all variable names: `contact`, `initialDeals`, `isEditing`, `contactSchema`, `lastOverId`
- Prefixes for state variables using React hooks: `activeId`, `isOver`, `isSubmitting`
- React state variables follow pattern: `[state, setState]` in useState hooks
- Type-specific boolean prefixes: `is*`, `has*`: `isEditing`, `isSubmitting`, `isOver`
- PascalCase for type names: `Contact`, `ContactInsert`, `Deal`, `DealInsert`, `Activity`, `ActivityInsert`, `DealStage`, `ActivityType`
- PascalCase for interface names: `ContactFormValues`
- Type names reflect domain entities or form values
- Union type literals use snake_case: `'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'`
- Constants for domain values (DEAL_STAGES, ACTIVITY_TYPES, STAGE_COLORS) use UPPER_SNAKE_CASE
## Code Style
- No explicit Prettier config found in repo; inferred from code:
- ESLint config via `eslint.config.mjs` uses:
## Import Organization
- `@/*` resolves to `./src/*` (configured in `tsconfig.json`)
- All imports use alias pattern: `@/components/`, `@/lib/`, `@/actions/`, `@/app/`
- No relative imports used (consistent use of path aliases)
## Error Handling
- Try-catch blocks with generic error handling:
- Server-side query errors thrown directly:
- Client-side errors handled via toast notifications (sonner library)
- No explicit error typing; catch blocks use implicit unknown type
- Form submission errors handled via try-catch with toast feedback
## Logging
- No explicit logging infrastructure found
- Toast notifications used for user feedback: `toast.success()`, `toast.error()`
- Errors communicated via toast to user rather than console logs
## Comments
- Minimal commenting observed; code is self-documenting through function and variable names
- Complex logic (like Kanban drag-and-drop collision detection) contains inline comments explaining algorithm
- Not used; no JSDoc comments observed in source files
- Type information comes from TypeScript type annotations rather than JSDoc
## Function Design
- Database functions ~15-25 lines
- Component functions ~40-150 lines for complex interactive components
- Handler functions ~5-15 lines
- UI wrapper components ~20-30 lines
- Destructured object parameters used extensively: `{ contact }`, `{ stage, deals, children }`, `{ data, error }`
- React component props destructured in function signature
- Avoid positional parameters; use named parameters with object destructuring
- Functions return typed values: `Contact[]`, `Contact`, `void` for actions
- Async functions always return promises (implicit in async function syntax)
- Form handlers don't return values, rely on side effects (navigation, toast)
## Module Design
- Named exports preferred: `export function getContacts()`, `export type Contact = {}`
- Named exports over default exports throughout codebase
- React components exported as named exports: `export function ContactForm()`, `export function KanbanBoard()`
- Not used; each file has single responsibility
- Direct imports from specific files rather than index files
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server-First Rendering: Pages are async server components that fetch data on demand
- Server Actions: Mutations (create/update/delete) isolated in `src/actions/` and wrapped with `revalidatePath()`
- Layered Data Access: Database operations abstracted in `src/lib/db/` with consistent patterns
- UI Component Library: shadcn/ui components in `src/components/ui/` for consistent design
- Supabase Integration: Real-time database with eager relationship loading on queries
## Layers
- Purpose: Render pages and interactive UI elements
- Location: `src/app/` (route pages) and `src/components/` (reusable components)
- Contains: Next.js page files (`.tsx`), client-side forms, layout wrappers
- Depends on: Server Actions (`src/actions/`), UI components, types from `src/lib/types.ts`
- Used by: Browser/End user
- Purpose: Handle server-side mutations (create/update/delete) with cache invalidation
- Location: `src/actions/`
- Contains: Async functions marked with `'use server'`
- Depends on: Database layer (`src/lib/db/`)
- Used by: Client forms and interactive components
- Purpose: Execute all Supabase queries with consistent error handling
- Location: `src/lib/db/`
- Contains: CRUD functions for each entity (contacts, deals, activities)
- Depends on: Supabase client (`src/lib/supabase/server.ts`)
- Used by: Server Actions and server components
- Purpose: Instantiate and configure Supabase client for server-side execution
- Location: `src/lib/supabase/server.ts`
- Contains: Supabase SSR client with cookie-based session management
- Depends on: `@supabase/ssr` package
- Used by: Data access layer functions
- Purpose: Single source of truth for all application types and enums
- Location: `src/lib/types.ts`
- Contains: Entity types (Contact, Deal, Activity), Insert variants, enums (DealStage, ActivityType), color mappings
- Depends on: Nothing (leaf module)
- Used by: All other layers
- Purpose: Shared helper functions and constants
- Location: `src/lib/utils.ts` (minimal in this codebase)
- Contains: String utilities, formatting helpers
- Depends on: Nothing significant
- Used by: Components and pages
- Purpose: Application frame and navigation structure
- Location: `src/components/layout/` (AppShell, NavLinks)
- Contains: Responsive layout wrapper, main navigation
- Depends on: UI components, Next.js navigation
- Used by: All pages via root layout
## Data Flow
- Server state: Managed by Next.js caching and `revalidatePath()` invalidation
- Client state: Minimal - forms use react-hook-form, Kanban board uses `useState` for drag state
- No global state management (Redux, Context API not needed for this scope)
## Key Abstractions
- Purpose: Hide Supabase SDK details and provide consistent query patterns
- Examples: `src/lib/db/contacts.ts`, `src/lib/db/deals.ts`, `src/lib/db/activities.ts`
- Pattern: Async functions that create client, execute query, handle errors, return typed data
- Purpose: Encapsulate mutations with cache invalidation
- Examples: `createContactAction()`, `updateDealStageAction()`, `deleteActivityAction()`
- Pattern: `'use server'` functions that call DB layer, invoke `revalidatePath()`, handle errors
- Purpose: Enforce data contracts across server/client boundary
- Examples: `Contact`, `Deal`, `Activity` and their `Insert` variants
- Pattern: Types defined once in `src/lib/types.ts`, used everywhere for type safety
- Purpose: Reusable form implementations with validation
- Examples: `ContactForm`, `DealForm`, `ActivityForm`
- Pattern: Client components with react-hook-form + Zod, call Server Actions on submit
- Purpose: Consistent, accessible UI across the app
- Examples: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/dialog.tsx`
- Pattern: shadcn/ui base components with Tailwind CSS styling
## Entry Points
- Location: `src/app/layout.tsx`
- Triggers: App initialization on all pages
- Responsibilities: Wraps entire app with providers (TooltipProvider, Toaster), sets metadata, loads fonts
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetches and displays summary metrics, upcoming activities, recent activity, pipeline overview
- Location: `src/app/contacts/page.tsx`
- Triggers: GET `/contacts` with optional `?q=` search parameter
- Responsibilities: Displays contacts table, handles search via `getContacts(q)`, links to detail/edit/create
- Location: `src/app/contacts/new/page.tsx`
- Triggers: GET `/contacts/new`
- Responsibilities: Renders `ContactForm` in create mode
- Location: `src/app/deals/page.tsx`
- Triggers: GET `/deals`
- Responsibilities: Fetches deals via `getDealsByStage()`, renders `KanbanBoard` with drag-and-drop
- Location: `src/app/activities/page.tsx`
- Triggers: GET `/activities` with optional filters (`?type=` and `?completed=`)
- Responsibilities: Displays activities table with filters, links to edit/delete
## Error Handling
- Database errors thrown directly from `src/lib/db/` functions and caught in Server Actions
- Server Action errors caught with `try-catch`, user sees generic "Something went wrong" toast
- Client-side form validation via Zod prevents some errors before submission
- No global error boundary currently (should be added for edge cases)
```typescript
```
```typescript
```
## Cross-Cutting Concerns
- Client-side: Zod schemas in form components prevent obviously bad input
- Server-side: Supabase Row-Level Security (RLS) policies should enforce constraints (not visible in this codebase but assumed configured)
- Missing: Server-side re-validation of user input before database write
- Contact changes: revalidate `/contacts` and `/contacts/[id]`
- Deal changes: revalidate `/deals`, `/deals/[id]`, and `/` (dashboard)
- Activity changes: revalidate `/activities` and `/activities/[id]`
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
