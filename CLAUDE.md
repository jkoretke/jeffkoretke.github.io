# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for jeffkoretke.com, hosted on GitHub Pages. Being migrated in-place from vanilla HTML/CSS/JS to React + TypeScript + Vite.

## Development Commands

```bash
npm run dev          # Start dev server (after migration)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Architecture (Post-Migration)

```
src/
├── api/             # API client, types, query hooks
├── components/
│   ├── ui/          # Reusable components (Button, Card)
│   ├── layout/      # Header, Footer
│   ├── sections/    # Hero, Skills, Contact, Experience
│   └── animations/  # Framer Motion wrappers
├── hooks/           # useTheme, useMediaQuery
├── App.tsx          # Root component with QueryClientProvider
└── main.tsx         # Entry point
public/
└── CNAME            # GitHub Pages custom domain
```

## Deployment

GitHub Pages auto-deploys from `main` branch. Custom domain: jeffkoretke.com

GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys.

## Backend API

Companion API at `~/VSCodeProjects/jeff-koretke-api`

Base URL: `https://jeffkoretke.com/api`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/about` | GET | Profile, bio, experience |
| `/api/skills` | GET | Technical skills by category |
| `/api/contact` | POST | Contact form (5 req/hr limit) |

## Migration Plan

See `IMPLEMENTATION_PLAN.md` for full details on the React migration.
