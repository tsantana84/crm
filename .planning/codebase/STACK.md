# Technology Stack

**Analysis Date:** 2026-04-18

## Languages

**Primary:**
- TypeScript 5.x - All source code, strict mode enabled
- JavaScript - Build configuration and tooling

**Secondary:**
- SQL - Database migrations and Supabase schema

## Runtime

**Environment:**
- Node.js (LTS) - Required for Next.js runtime

**Package Manager:**
- npm - Specified in package.json
- Lockfile: package-lock.json (present)

## Frameworks

**Core:**
- Next.js 16.2.4 - Full-stack React framework with server components, server actions, and App Router
- React 19.2.4 - UI library
- React DOM 19.2.4 - React DOM rendering

**UI/Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- PostCSS 4 (@tailwindcss/postcss) - CSS processor for Tailwind
- shadcn - Component library built on Tailwind and Radix UI
- class-variance-authority 0.7.1 - Component style variants
- tailwind-merge 3.5.0 - Merge Tailwind classes without conflicts
- tw-animate-css 1.4.0 - Tailwind animation utilities

**Fonts:**
- Next.js built-in font optimization (Geist, Geist Mono via next/font)

**Forms & Validation:**
- react-hook-form 7.72.1 - Form state management
- @hookform/resolvers 5.2.2 - Schema validation adapters for react-hook-form
- zod 4.3.6 - TypeScript-first schema validation

**UI Components & Interactions:**
- Lucide React 1.8.0 - Icon library
- sonner 2.0.7 - Toast notification library
- @base-ui/react 1.4.0 - Low-level headless component library
- clsx 2.1.1 - Utility for conditional className strings
- next-themes 0.4.6 - Theme management (light/dark mode)

**Drag & Drop:**
- @dnd-kit/core 6.3.1 - Drag and drop primitives
- @dnd-kit/sortable 10.0.0 - Sortable component addon
- @dnd-kit/utilities 3.2.2 - Utility functions for dnd-kit

**Testing:**
- Not detected - No test framework configured

**Build/Dev:**
- ESLint 9 - JavaScript/TypeScript linting
- eslint-config-next 16.2.4 - Next.js ESLint configuration
- TypeScript 5 - Type checking
- PostCSS - CSS processing

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.103.3 - Supabase client for browser/client-side database operations
- @supabase/ssr 0.10.2 - Supabase SSR utilities for server-side database operations with cookie handling

**Infrastructure:**
- supabase 2.92.1 - Supabase CLI for local development and database migrations

## Configuration

**Environment:**
- `.env.local` file present - Contains environment variables (not readable for security)
- Required variables (public):
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key

**Build:**
- `next.config.ts` - Next.js configuration (minimal, uses defaults)
- `tsconfig.json` - TypeScript configuration with strict mode, ES2017 target, path aliases (@/*)
- `eslint.config.mjs` - ESLint configuration with Next.js and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4

**Type Definitions:**
- `next-env.d.ts` - Auto-generated Next.js type definitions
- TypeScript strict mode enabled globally

## Platform Requirements

**Development:**
- Node.js (LTS recommended)
- npm or compatible package manager
- Supabase CLI (for local development)

**Production:**
- Next.js standalone deployment target
- Vercel (recommended) or Node.js runtime environment
- Supabase cloud instance (PostgreSQL)

---

*Stack analysis: 2026-04-18*
