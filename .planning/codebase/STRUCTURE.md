# Codebase Structure

**Analysis Date:** 2026-04-18

## Directory Layout

```
crm/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── contacts/           # Contacts feature pages
│   │   ├── deals/              # Deals feature pages
│   │   ├── activities/         # Activities feature pages
│   │   ├── layout.tsx          # Root layout wrapper
│   │   ├── page.tsx            # Dashboard homepage
│   │   └── globals.css         # Global Tailwind styles
│   ├── actions/                # Server Actions (mutations)
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # App frame components
│   │   ├── contacts/           # Contact-specific components
│   │   ├── deals/              # Deal-specific components
│   │   ├── activities/         # Activity-specific components
│   │   └── kanban/             # Kanban board components
│   ├── lib/                    # Utilities and shared logic
│   │   ├── db/                 # Database query functions
│   │   ├── supabase/           # Supabase client configuration
│   │   ├── types.ts            # All TypeScript type definitions
│   │   └── utils.ts            # Shared utilities
│   └── middleware.ts           # (Not present - would be for auth/redirects)
├── public/                     # Static assets (favicon, etc)
├── supabase/                   # Supabase project files
│   ├── migrations/             # SQL migrations
│   └── config.toml             # Supabase config
├── .planning/                  # Planning and analysis documents
│   └── codebase/               # Codebase analysis output
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.ts              # Next.js configuration
└── README.md                   # Project documentation
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router pages and layouts
- Contains: Page components (`.tsx`), dynamic route segments, layout wrappers
- Key files: `page.tsx` (homepage), `layout.tsx` (root layout)
- Structure: Directories map directly to URL routes (`/contacts` → `src/app/contacts/page.tsx`)

**src/app/contacts:**
- Purpose: Contact management pages
- Contains: Contact list, detail view, create/edit forms
- Key files: `page.tsx` (list), `[id]/page.tsx` (detail), `[id]/edit/page.tsx` (edit), `new/page.tsx` (create), `delete-contact-button.tsx`, `contact-search.tsx`

**src/app/deals:**
- Purpose: Deal management pages
- Contains: Kanban board view, detail view, create/edit forms
- Key files: `page.tsx` (Kanban board), `[id]/page.tsx` (detail), `[id]/edit/page.tsx` (edit), `new/page.tsx` (create), `[id]/delete-deal-button.tsx`

**src/app/activities:**
- Purpose: Activity management pages
- Contains: Activity list with filters, detail view, create/edit forms
- Key files: `page.tsx` (list), `[id]/edit/page.tsx` (edit), `new/page.tsx` (create), `activity-filters.tsx`, `toggle-complete-button.tsx`, `delete-activity-button.tsx`

**src/actions:**
- Purpose: Server Action definitions for mutations
- Contains: Async functions marked with `'use server'`
- Key files: `contacts.ts`, `deals.ts`, `activities.ts`
- Pattern: Each file wraps DB operations and handles `revalidatePath()`

**src/components:**
- Purpose: Reusable React components
- Contains: UI library, layout wrappers, feature-specific components

**src/components/ui:**
- Purpose: Base UI component library from shadcn/ui
- Contains: Button, Card, Dialog, Form, Input, Select, Table, Tabs, Tooltip, etc.
- Pattern: Each file exports one component with Tailwind styling

**src/components/layout:**
- Purpose: Application frame structure
- Key files: `app-shell.tsx` (responsive layout wrapper), `nav-links.tsx` (navigation sidebar/header)

**src/components/contacts:**
- Purpose: Contact feature components
- Key files: `contact-form.tsx` (reusable create/edit form with Zod validation)

**src/components/deals:**
- Purpose: Deal feature components
- Key files: `deal-form.tsx` (reusable create/edit form)

**src/components/activities:**
- Purpose: Activity feature components
- Key files: `activity-form.tsx` (reusable create/edit form)

**src/components/kanban:**
- Purpose: Drag-and-drop Kanban board implementation
- Key files: `kanban-board.tsx` (main board with dnd-kit), `deal-card.tsx` (draggable card), `deal-card-overlay.tsx` (drag preview)

**src/lib:**
- Purpose: Shared utilities and data access layer
- Contains: Database functions, Supabase client, types, utilities

**src/lib/db:**
- Purpose: Database query layer
- Key files: `contacts.ts`, `deals.ts`, `activities.ts`
- Pattern: Async CRUD functions with consistent error handling

**src/lib/supabase:**
- Purpose: Supabase client instantiation
- Key files: `server.ts` (SSR client with cookie-based sessions), `client.ts` (if present, for client-side operations)

**src/lib/types.ts:**
- Purpose: Single source of truth for all TypeScript types
- Contains: Entity types (Contact, Deal, Activity), Insert variants, enums (DealStage, ActivityType), color mappings (STAGE_COLORS, ACTIVITY_TYPE_COLORS)

**public:**
- Purpose: Static assets served directly
- Contains: `favicon.ico` and other static files

**supabase/migrations:**
- Purpose: SQL migration files for database schema
- Contains: `.sql` files numbered by creation timestamp

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout that wraps entire app with providers (TooltipProvider, Toaster)
- `src/app/page.tsx`: Dashboard homepage showing summary metrics and recent activity
- `next.config.ts`: Next.js build and runtime configuration

**Configuration:**
- `package.json`: Dependencies (Next.js, React, Supabase, shadcn/ui, Tailwind, Zod)
- `tsconfig.json`: TypeScript compiler options, path aliases (`@/*` → `./src/*`)
- `tailwind.config.ts`: Tailwind CSS theme customization
- `.env.local` (not tracked): Supabase URLs and API keys

**Core Logic:**
- `src/lib/types.ts`: All entity types and enums
- `src/lib/db/contacts.ts`: Contact CRUD operations
- `src/lib/db/deals.ts`: Deal CRUD operations (includes stage summary)
- `src/lib/db/activities.ts`: Activity CRUD operations (includes filtering, upcoming/recent)
- `src/actions/contacts.ts`: Contact mutations with cache invalidation
- `src/actions/deals.ts`: Deal mutations with cache invalidation
- `src/actions/activities.ts`: Activity mutations with cache invalidation

**Presentation:**
- `src/components/layout/app-shell.tsx`: Responsive layout wrapper with sidebar/header
- `src/app/contacts/page.tsx`: Contact list with search
- `src/app/deals/page.tsx`: Kanban board for deal pipeline
- `src/app/activities/page.tsx`: Activity list with type/completion filters
- `src/app/page.tsx`: Dashboard with KPIs and activity overview

**Testing:**
- Not present - no test files in codebase

## Naming Conventions

**Files:**
- Page files: `page.tsx` (Next.js convention)
- Component files: `PascalCase.tsx` (React convention) — e.g., `ContactForm.tsx`, `KanbanBoard.tsx`
- Server Action files: `camelCase.ts` — e.g., `contacts.ts`, `deals.ts`
- Database files: `camelCase.ts` — e.g., `contacts.ts`, `deals.ts`
- Button components (small): `kebab-case.tsx` — e.g., `delete-contact-button.tsx`, `toggle-complete-button.tsx`
- Utility/Helper files: `camelCase.ts` — e.g., `utils.ts`, `types.ts`

**Directories:**
- Feature directories: `kebab-case` (lowercase) — e.g., `src/app/contacts`, `src/components/kanban`
- Logical groupings: `lowercase` — e.g., `lib/`, `actions/`, `components/`

**Components (within files):**
- Component functions: `PascalCase` — e.g., `ContactForm`, `KanbanBoard`, `DealCard`
- Helper functions: `camelCase` — e.g., `onSubmit`, `handleDragEnd`, `createClient`
- Exported types: `PascalCase` — e.g., `Contact`, `Deal`, `ContactInsert`

**Constants:**
- Enums and option arrays: `SCREAMING_SNAKE_CASE` — e.g., `DEAL_STAGES`, `ACTIVITY_TYPES`, `STAGE_COLORS`

## Where to Add New Code

**New Feature (e.g., Notes):**
1. Create type in `src/lib/types.ts` — `export type Note = { ... }`
2. Create DB queries in new file `src/lib/db/notes.ts` — functions like `createNote()`, `updateNote()`, `deleteNote()`
3. Create Server Actions in new file `src/actions/notes.ts` — wrap DB calls with `revalidatePath()`
4. Create form component in `src/components/notes/note-form.tsx` — use react-hook-form + Zod
5. Create pages in new directory `src/app/notes/` — list page (`page.tsx`), detail (`[id]/page.tsx`), edit (`[id]/edit/page.tsx`), create (`new/page.tsx`)

**New Component:**
1. If UI primitive (button variant, badge style): Add to `src/components/ui/`
2. If feature-specific (contact card, deal summary): Add to `src/components/[feature]/`
3. If layout (sidebar, header): Add to `src/components/layout/`

**New Utility Function:**
- Shared logic: `src/lib/utils.ts`
- Database-adjacent: `src/lib/db/` (create new file if needed)
- Data transformation: Create alongside the code that uses it or in `src/lib/`

**New Route/Page:**
- Client page: `src/app/[route]/page.tsx` (async server component by default)
- Dynamic route: `src/app/[route]/[id]/page.tsx` (use `params` prop)
- Nested layout: `src/app/[route]/layout.tsx` (wraps all pages in segment)

## Special Directories

**src/.next:**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No (in .gitignore)
- Rebuild on deploy: Always runs `next build` in CI/CD

**node_modules:**
- Purpose: NPM package dependencies
- Generated: Yes
- Committed: No (in .gitignore)
- Install locally: Run `npm install`

**supabase/.temp:**
- Purpose: Temporary Supabase CLI files
- Generated: Yes
- Committed: No (in .gitignore)

**supabase/.branches:**
- Purpose: Supabase environment branch configurations
- Generated: Yes
- Committed: Partially (tracked for branch management)

**.planning/codebase:**
- Purpose: Codebase analysis documents generated by GSD tools
- Generated: Yes (by GSD agents)
- Committed: Yes (for team reference)

---

*Structure analysis: 2026-04-18*
