# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog ("Memory Palace") powered by Astro 5 + AstroPaper v5 theme, deployed to GitHub Pages and Vercel.

- **Site URL:** https://kevin7lou.github.io/blog
- **Author:** Kevin Lou
- **Language:** zh-CN (Chinese content, Chinese UI)

## Commands

```bash
npm run dev       # Local dev server (http://localhost:4321)
npm run build     # Generate static site to ./dist
npm run preview   # Preview built site locally
```

Create a new post: add a `.md` file in `src/data/blog/` with required front matter (`title`, `pubDatetime`, `description`, `tags`).

## Architecture

### Tech Stack

Astro 5 + Tailwind CSS v4 + TypeScript + Shiki + Pagefind. Zero framework dependencies (no React/Svelte/Vue).

### Key Directories

- `src/data/blog/` — Blog posts (Markdown with Zod-validated front matter)
- `src/components/` — Astro components (Header, Footer, TOC, Reward, etc.)
- `src/layouts/` — Page layouts (Layout.astro base, PostDetails.astro for posts)
- `src/i18n/` — Chinese UI translations (zh.ts + t() helper)
- `src/pages/` — File-based routing
- `src/config.ts` — Site metadata (title, author, lang, timezone)
- `src/constants.ts` — Social links and share links
- `public/images/` — Static assets (avatar, QR codes)

### Content Collection

Posts use Astro Content Layer API with glob loader. Schema defined in `src/content.config.ts`. Required front matter: `title`, `pubDatetime`, `description`, `tags`.

### Markdown Pipeline

- **Code highlighting:** Shiki with diff/highlight/word-highlight/fileName transformers
- **Math:** remark-math + rehype-katex (KaTeX)
- **Diagrams:** Mermaid via client-side rendering (is:inline script in Layout.astro)
- **CJK spacing:** pangu (installed, manual integration pending)

### i18n

Single-language Chinese UI. Translation strings in `src/i18n/zh.ts`, accessed via `t()` from `src/i18n/utils.ts`. Inline `<script>` blocks use hardcoded Chinese strings directly (can't call server-side `t()`).

### Deployment

Push to `master` triggers `.github/workflows/deploy.yml`:
1. Node 20, `npm ci`, `npm run build`
2. `npx pagefind --site dist` (search index)
3. Publish `dist/` to `gh-pages` branch

Also deployable to Vercel (auto-detected Astro framework, zero config).
