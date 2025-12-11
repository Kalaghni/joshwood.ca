# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture

This is a personal portfolio website built with Next.js 15 (App Router) using TypeScript and Tailwind CSS v4.

### Key Directories

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
  - `ui/` - shadcn/ui components (New York style)
  - `backgrounds/` - Animated background effects (Three.js, OGL, WebGL shaders)
  - `templates/` - Reusable page templates like `ProjectOverview`
  - `typography/` - Typography components (h1-h4, p)
  - `navigation/` - Desktop and mobile navigation components
- `configs/` - Configuration files (navigation config with project/nav definitions)
- `lib/utils.ts` - Utility functions (`cn` for className merging)

### Styling & UI

- **Tailwind CSS v4** with CSS variables for theming
- **shadcn/ui** (New York style) - install components via `npx shadcn@latest add <component>`
- **ReactBits** registry available at `@react-bits` for additional components
- **Icons**: Lucide React
- **Animations**: Framer Motion, GSAP
- **3D/WebGL**: Three.js, OGL for background effects

### Fonts

Three Google Fonts loaded via `next/font`:
- DM Sans (`--font-dm-sans`)
- DM Mono (`--font-dm-mono`)
- DM Serif Display (`--font-dm-serif-display`)

### Path Aliases

`@/*` maps to the project root (configured in tsconfig.json).

### Project Pages

Project pages use the `ProjectOverview` template component (`components/templates/project-overview.tsx`) which provides a consistent layout with title, summary, cover image, tech stack pills, meta info, and action buttons.

### Navigation

Navigation structure is defined in `configs/nav.config.tsx`. The `mainNav` array supports links, dropdowns, and popovers with optional featured items.

### Theme

Dark theme is the default. Theme toggling via `next-themes` with the `ThemeProvider` component.
