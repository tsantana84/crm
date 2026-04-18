# Coding Conventions

**Analysis Date:** 2026-04-18

## Naming Patterns

**Files:**
- Kebab-case for component files: `delete-contact-button.tsx`, `contact-form.tsx`, `kanban-board.tsx`, `app-shell.tsx`
- Kebab-case for utility/library files: `contact-search.tsx`, `activity-filters.tsx`, `deal-card.tsx`
- Server component files use `.ts` or `.tsx` extension; client components use `.tsx` with `'use client'` directive

**Functions:**
- camelCase for function names: `createContactAction()`, `getContact()`, `handleDragStart()`, `findContainer()`
- Handler functions prefixed with `handle`: `handleDelete()`, `handleDragEnd()`, `handleDragCancel()`, `handleDragOver()`
- Async server functions suffixed with `Action`: `createContactAction()`, `updateContactAction()`, `deleteContactAction()`, `updateDealStageAction()`
- Database query functions prefixed with verb: `getContacts()`, `getContact()`, `createContact()`, `updateContact()`, `deleteContact()`

**Variables:**
- camelCase for all variable names: `contact`, `initialDeals`, `isEditing`, `contactSchema`, `lastOverId`
- Prefixes for state variables using React hooks: `activeId`, `isOver`, `isSubmitting`
- React state variables follow pattern: `[state, setState]` in useState hooks
- Type-specific boolean prefixes: `is*`, `has*`: `isEditing`, `isSubmitting`, `isOver`

**Types:**
- PascalCase for type names: `Contact`, `ContactInsert`, `Deal`, `DealInsert`, `Activity`, `ActivityInsert`, `DealStage`, `ActivityType`
- PascalCase for interface names: `ContactFormValues`
- Type names reflect domain entities or form values
- Union type literals use snake_case: `'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'`
- Constants for domain values (DEAL_STAGES, ACTIVITY_TYPES, STAGE_COLORS) use UPPER_SNAKE_CASE

## Code Style

**Formatting:**
- No explicit Prettier config found in repo; inferred from code:
  - Single quotes for strings: `'use client'`, `'name'`, `'email'`
  - Spaces around braces in JSX: `{ children }`, `{ field }`
  - Template literals used for dynamic content: `` `${search}%` ``
  - No semicolons at end of statements (inferred from code samples)

**Linting:**
- ESLint config via `eslint.config.mjs` uses:
  - `eslint/config` defineConfig format (flat config)
  - `eslint-config-next/core-web-vitals` for Next.js best practices
  - `eslint-config-next/typescript` for TypeScript support
  - Config: `/Users/thiagosantana/projects/crm/eslint.config.mjs`
  - Run: `npm run lint` (defined in package.json)

## Import Organization

**Order:**
1. React and Next.js framework imports: `import { useState, useCallback, useRef } from 'react'`, `import Link from 'next/link'`
2. Third-party library imports: `import { useForm, Controller } from 'react-hook-form'`, `import { zodResolver } from '@hookform/resolvers/zod'`
3. Component imports: `import { Button } from '@/components/ui/button'`
4. Type imports: `import type { Contact, ContactInsert } from '@/lib/types'`
5. Utility imports: `import { cn } from '@/lib/utils'`
6. Action/handler imports: `import { createContactAction } from '@/actions/contacts'`

**Path Aliases:**
- `@/*` resolves to `./src/*` (configured in `tsconfig.json`)
- All imports use alias pattern: `@/components/`, `@/lib/`, `@/actions/`, `@/app/`
- No relative imports used (consistent use of path aliases)

## Error Handling

**Patterns:**
- Try-catch blocks with generic error handling:
  ```typescript
  try {
    await deleteContactAction(contactId)
    toast.success('Contact deleted')
  } catch {
    toast.error('Failed to delete contact')
  }
  ```
- Server-side query errors thrown directly:
  ```typescript
  const { data, error } = await supabase.from('contacts').select('*')
  if (error) throw error
  ```
- Client-side errors handled via toast notifications (sonner library)
- No explicit error typing; catch blocks use implicit unknown type
- Form submission errors handled via try-catch with toast feedback

## Logging

**Framework:** Console logging not observed in codebase

**Patterns:**
- No explicit logging infrastructure found
- Toast notifications used for user feedback: `toast.success()`, `toast.error()`
- Errors communicated via toast to user rather than console logs

## Comments

**When to Comment:**
- Minimal commenting observed; code is self-documenting through function and variable names
- Complex logic (like Kanban drag-and-drop collision detection) contains inline comments explaining algorithm

**JSDoc/TSDoc:**
- Not used; no JSDoc comments observed in source files
- Type information comes from TypeScript type annotations rather than JSDoc

## Function Design

**Size:** Functions are small and focused:
- Database functions ~15-25 lines
- Component functions ~40-150 lines for complex interactive components
- Handler functions ~5-15 lines
- UI wrapper components ~20-30 lines

**Parameters:**
- Destructured object parameters used extensively: `{ contact }`, `{ stage, deals, children }`, `{ data, error }`
- React component props destructured in function signature
- Avoid positional parameters; use named parameters with object destructuring

**Return Values:**
- Functions return typed values: `Contact[]`, `Contact`, `void` for actions
- Async functions always return promises (implicit in async function syntax)
- Form handlers don't return values, rely on side effects (navigation, toast)

## Module Design

**Exports:**
- Named exports preferred: `export function getContacts()`, `export type Contact = {}`
- Named exports over default exports throughout codebase
- React components exported as named exports: `export function ContactForm()`, `export function KanbanBoard()`

**Barrel Files:**
- Not used; each file has single responsibility
- Direct imports from specific files rather than index files

---

*Convention analysis: 2026-04-18*
