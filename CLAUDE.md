# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MVP Gurus** (mvpgurus.framer.website) — A rapid MVP software development service website. This is a **Framer-exported static site**, not a traditional JavaScript/TypeScript project. The source of truth for design lives in Framer's cloud editor; this repo stores the exported HTML bundle.

## Repository Contents

- `mvpgurus.framer.website-framer-full-20260206113853.zip` — Full static HTML export from Framer (7 pages)
- `.claude/settings.local.json` — Local MCP config (Supabase enabled)

There is no `package.json`, no build pipeline, and no `node_modules`. The zip can be extracted and served with any static file server.

## Site Pages (Funnel Flow)

1. `/` — Landing page (main marketing page)
2. `/register` — User registration
3. `/schedule` — Booking/scheduling interface
4. `/booked` — Booking confirmation
5. `/project-outline-2` — Project outline form
6. `/chat-room` — Chat/messaging interface
7. `/404` — Error page

## Working with the Export

```bash
# Extract the site for inspection or local serving
unzip mvpgurus.framer.website-framer-full-20260206113853.zip -d site/

# Serve locally (if python available)
cd site && python -m http.server 8000
```

## Backend / Integrations

- **Supabase** MCP server is enabled in `.claude/settings.local.json` — backend services (auth, database, etc.) are expected to use Supabase
- **Framer hosting** — Production site is deployed via Framer's built-in hosting at `framerusercontent.com`

## Design System

- **Fonts:** Geist (400-500), Inter family (400-900), Inter Tight
- **Generator:** Framer aab256c (published Feb 5, 2026)
- **Framer Site ID:** 5I3rbVfZJzcJ1DnSZCpRVc

## Key Context

- All visual changes should be made in the Framer editor and re-exported — directly editing the HTML is fragile and will be overwritten on next export
- Code-level work in this repo is expected to focus on backend integration (Supabase), deployment automation, or post-processing the static export
