# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MVP Gurus** — A rapid MVP software development service website rebuilt as a Next.js application. Originally designed in Framer (export kept as `mvpgurus.framer.website-framer-full-20260206113853.zip` for design reference), now a full-stack Next.js 15 + Supabase codebase.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check

# Visual regression testing
npm run test:visual:baseline   # Capture baselines from live Framer site
npm run test:visual            # Compare localhost against baselines
```

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` in `globals.css`, NOT `tailwind.config.ts`)
- **Backend:** Supabase (auth, Postgres with RLS)
- **Visual Testing:** Playwright screenshot comparison (5% pixel diff tolerance)
- **Deployment:** Vercel (planned)

## Architecture

### Funnel Flow (user journey order)
1. `/` — Landing page (hero, case studies, how it works, team, testimonial, CTA)
2. `/apply` — Auth (Google One Tap, social OAuth, or email OTP)
3. `/intake` — Product details form (name, goal, complexity, idea, budget)
4. `/book` — Calendar date picker
5. `/confirmed` — Confirm your call (video, timeline, workshop selection)
6. `/workshop` — AI Workshop (interactive chat questions)
7. `/report` — Access requirements document (progress tracker, FAQ, download)

### Key Directories
- `app/` — Next.js App Router pages (each funnel step is a route)
- `components/ui/` — Primitives: button (CVA variants), star-rating
- `components/layout/` — Navbar, footer, container, phone-frame
- `components/sections/` — Page sections: testimonial-card, case-study-card, brand-ticker, how-it-works, cta-section
- `lib/actions/` — Server Actions: `chat.ts`, `register.ts`, `schedule.ts`, `outline.ts`
- `lib/hooks/` — Client hooks: `use-funnel-progress.ts` (localStorage state across pages)
- `lib/supabase/` — `client.ts` (browser), `server.ts` (Server Components), `middleware.ts` (session refresh)
- `supabase/migrations/` — SQL schema (6 tables with RLS)
- `screenshots/baseline/` — 21 Framer baseline PNGs (7 pages × 3 breakpoints)

### Design System (in `app/globals.css` via `@theme`)
- Primary: `#e88146` (orange CTA), `#FFB853` (gold)
- Accent: `#9563ff` (purple), `#d1d0fc` (lavender), `#ed81ff` (pink)
- Surfaces: `#f6f3fe` (light purple), `#fff3ef` (warm), `#f6f7f9` (gray)
- Fonts: Geist, Inter, Inter Tight (loaded via `next/font/google` in `lib/fonts.ts`)
- Breakpoints: tablet 810px, desktop 1440px

### Supabase Schema (shared DB with MVPGuru blog)
Blog tables: `categories`, `homepage_content`, `post_images`, `posts`, `site_configuration`
Funnel tables: `chat_sessions` → `chat_responses` → `registrations` → `bookings` → `project_outlines`
Shared: `profiles` (blog-owned schema: `user_id` uuid FK to auth.users, `display_name`, `role` user_role enum — NOT `id` as FK, no `email` or `full_name` column)

Anonymous users start with a `session_token` in `chat_sessions`; data links to auth users retroactively.

### Funnel State Management
`useFunnelProgress` hook stores `sessionId → registrationId → bookingId` in localStorage. Each page reads/writes its relevant ID and passes it to Server Actions.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://qdxgzvfxtxyklphahqiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key in .env.local>
```

Middleware gracefully skips Supabase session refresh when env vars are missing.

## Dev Server & `.next` Cache

OneDrive syncs `.next` cache files and causes corruption. Quick fix: `rm -rf .next && npm run dev`. For full troubleshooting details, see `docs/dev-server-troubleshooting.md`.

## UI Components

- **shadcn/ui** for admin/dashboard pages (Table, Card, Dialog, Badge, Tabs, etc.)
- **Magic UI** for animated elements (NumberTicker, BlurFade, AnimatedList, ShimmerButton)
- **21st.dev** community registry for polished shadcn-based blocks (pricing tables, dashboards, navbars). Install via `npx shadcn@latest add "https://21st.dev/r/[component]"`
- **MCP servers** configured in `.mcp.json` for shadcn and Magic UI component lookup
- When building or modifying UI, read `docs/ux-guidelines.md` for accessibility, interaction, and layout rules

## Framer Design Reference

The zip file contains the original Framer export. Extract to inspect exact text, colors, or layout:
```bash
unzip -p mvpgurus.framer.website-framer-full-20260206113853.zip "index.html" | grep "data-framer-name"
```
