# Hexo to Astro Migration Design

## Overview

Migrate the "Memory Palace" blog from Hexo 8 + NexT theme to Astro 5 + AstroPaper v5, enhancing with Chinese i18n, sidebar TOC, KaTeX, and Mermaid support. Deploy to both GitHub Pages and Vercel.

## Motivation

- **Modern tech stack**: Astro 5 + Tailwind v4 + TypeScript (replacing Hexo + Nunjucks + Stylus)
- **Design upgrade**: AstroPaper's clean minimal aesthetic (replacing NexT Muse)
- **Performance**: Astro's island architecture, zero JS by default, partial hydration

## Base Theme

**AstroPaper v5** (https://github.com/satnaing/astro-paper)

- 4,487 GitHub stars, MIT license
- Pure Astro + Tailwind v4 + TypeScript, zero framework dependencies
- Built-in: dark mode, Pagefind search, RSS, sitemap, OG image generation, Shiki code highlighting
- ~35 source files, clean architecture, easy to extend

## Module 1: Project Initialization & Content Migration

### Project Setup

```bash
npm create astro@latest -- --template satnaing/astro-paper
```

Tech stack (no changes needed): Astro 5 + Tailwind v4 + TypeScript + Shiki + Pagefind.

### Content Migration (3 posts)

Front matter mapping:

| Hexo field | AstroPaper field | Transformation |
|------------|------------------|----------------|
| `title` | `title` | Direct copy |
| `date` | `pubDatetime` | Add timezone: `2023-04-24 21:32:17` → `2023-04-24T21:32:17+08:00` |
| `categories` | `tags` (merged) | Merge into tags array: `categories: 科技洪流` + `tags: AGI` → `tags: [AGI, 科技洪流]` |
| `tags` | `tags` | Convert to array format |
| (none) | `description` | Extract from first paragraph or `<!--more-->` excerpt |
| (none) | `draft` | Default `false` |

Posts to migrate:
- `source/_posts/my-1st-post.md` → `src/content/posts/my-1st-post.md`
- `source/_posts/AGI-era.md` → `src/content/posts/AGI-era.md`
- `source/_posts/Hexo-Next-Github-Page-deploy.md` → `src/content/posts/hexo-next-deploy.md`

Markdown body: no changes needed (standard syntax is compatible). Remove `<!--more-->` separators.

### Static Assets

| Source | Destination |
|--------|-------------|
| `source/images/avatar.gif` | `public/images/avatar.gif` |
| `source/images/wechatpay.png` | `public/images/wechatpay.png` |
| `source/images/alipay.png` | `public/images/alipay.png` |
| `source/images/paypal.png` | `public/images/paypal.png` |
| `source/images/bitcoin.png` | `public/images/bitcoin.png` |
| `source/images/wechat_channel.png` | `public/images/wechat_channel.png` |
| `source/about/index.md` | `src/pages/about.astro` (or `src/content/spec/about.md`) |

### Site Config (`src/config.ts`)

```ts
export const SITE = {
  website: "https://kevin7lou.github.io/blog",
  author: "Kevin Lou",
  lang: "zh-CN",
  title: "Memory Palace",
  description: "深度思考，乐于分享",
  ogImage: "og-default.png",
};
```

## Module 2: Chinese i18n

### Approach: Single-language Chinese UI

No multi-language routing needed. Replace hardcoded English UI strings with Chinese.

### Implementation

1. Create `src/i18n/` directory:
   - `types.ts` — define `I18nStrings` interface (~50 translation keys)
   - `zh.ts` — Chinese translations
   - `utils.ts` — `t(key)` helper function

2. Replace hardcoded strings in ~10 components:
   - `Header.astro`: navigation labels
   - `PostDetails.astro`: "Share this post", "Previous/Next Post"
   - `Tag.astro`, `Tags.astro`: tag-related labels
   - `search.astro`: search UI labels
   - `Footer.astro`: copyright text
   - Breadcrumb, pagination components

3. Key translations:

| Key | Value |
|-----|-------|
| `nav.posts` | 文章 |
| `nav.tags` | 标签 |
| `nav.about` | 关于 |
| `nav.search` | 搜索 |
| `post.prev` | 上一篇 |
| `post.next` | 下一篇 |
| `post.share` | 分享 |
| `post.toc` | 目录 |
| `post.copy` | 复制链接 |
| `post.copied` | 已复制 |
| `tag.all` | 所有标签 |

4. Reference: `yousef8/astro-paper-i18n` fork (has complete `zh.ts`)

### CJK Typography

Add `rehype-pangu` (or build-time `pangu.js`) to auto-insert spaces between CJK and half-width characters. This replaces the `pangu: true` setting from the NexT theme.

## Module 3: Sidebar TOC

### Current State

AstroPaper has `remark-toc` generating inline TOC inside markdown content. No sidebar TOC exists.

### Design

Create a new `src/components/TOC.astro` component with responsive behavior:

**Desktop (lg+):** Two-column layout in `PostDetails.astro`
- Left: article content (existing)
- Right: sticky TOC sidebar, highlights current heading on scroll

**Mobile:** Collapsible TOC above article content, using `<details>/<summary>` or toggle button.

### Implementation

1. New file: `src/components/TOC.astro`
   - Props: `headings: { depth: number; slug: string; text: string }[]`
   - Renders nested `<ul>` from h2-h4 headings
   - Client-side `<script>`: `IntersectionObserver` to highlight active heading
   - Tailwind classes: `sticky top-20` for desktop, hidden on mobile

2. Modify `src/layouts/PostDetails.astro`:
   - Wrap article + TOC in a responsive flex/grid container
   - Desktop: `grid grid-cols-[1fr_220px] gap-8`
   - Mobile: single column, TOC collapsed at top

3. Remove `remark-toc` and `remark-collapse` from `astro.config.ts` (replaced by sidebar TOC)

4. Data source: Astro's `render()` returns `{ Content, headings }` — headings are already available, no extra parsing needed.

## Module 4: KaTeX + Mermaid

### KaTeX (Math Formulas)

Install and configure:

```bash
npm install remark-math rehype-katex
```

In `astro.config.ts`:
```ts
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  markdown: {
    remarkPlugins: [...existing, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

In layout `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" />
```

Usage: `$inline$` and `$$block$$` syntax (same as current Hexo MathJax).

### Mermaid (Diagrams)

Client-side rendering approach (lighter than build-time):

1. Custom remark plugin or rehype plugin to detect ` ```mermaid ` code blocks
2. Replace with `<div class="mermaid">` container
3. Load `mermaid.js` via `<script>` in layouts that contain mermaid blocks
4. Auto-detect dark mode and apply matching Mermaid theme (`dark` / `default`)

Alternative: `rehype-mermaid` for build-time rendering (heavier build, but zero client JS).

Decision: Start with client-side approach for simplicity; switch to build-time if performance is a concern.

## Module 5: Deployment & SEO

### GitHub Pages

Update `.github/workflows/deploy.yml`:

```yaml
name: Deploy Astro to GitHub Pages
on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Key changes from current workflow: Node 20 (was 16), publish `dist/` (was `public/`), `npm ci` (was `npm install`).

### Vercel

Zero-config: connect GitHub repo to Vercel, auto-detects Astro framework. No `vercel.json` needed for static output.

### SEO Migration

| Feature | Implementation |
|---------|---------------|
| Google Analytics (G-5QBCB3V0H2) | `@astrojs/partytown` + gtag script in `<head>` |
| Sitemap | `@astrojs/sitemap` (AstroPaper already includes) |
| RSS | Already built-in (AstroPaper generates RSS) |
| Open Graph images | Already built-in (satori + sharp auto-generation) |
| Google verification | `<meta name="google-site-verification" content="uKuWVhKqZwEufCjkmJ75A7eiCwdkY6DhTsH_OnEtYBk" />` in `<head>` |
| Baidu verification | `<meta name="baidu-site-verification" content="sq1edMb0bN" />` in `<head>` |
| robots.txt | Already built-in |
| Canonical URLs | Already built-in |

### Social Links

In `src/config.ts` `SOCIALS` array:

```ts
export const SOCIALS = [
  { name: "Github", href: "https://github.com/kevin7lou", active: true },
  { name: "Twitter", href: "https://twitter.com/kevin7lou", active: true },
  { name: "Zhihu", href: "https://www.zhihu.com/people/kevin7lou", active: true },
  { name: "Jike", href: "https://okjk.co/sCWqF2", active: true },
  { name: "RSS", href: "/rss.xml", active: true },
];
```

Note: 知乎 and 即刻 may need custom SVG icons added to the social icons component.

### Reward (Donate) Component

New file: `src/components/Reward.astro`

- Displays "Buy me a coffee" button that expands to show QR codes
- Images: WeChat Pay, Alipay, PayPal, Bitcoin (from `public/images/`)
- Embed in `PostDetails.astro` after article content, before tags/share section
- Responsive grid: 2x2 on desktop, 1-column on mobile

## Migration Checklist

- [ ] Scaffold AstroPaper v5 project
- [ ] Configure `src/config.ts` with site metadata
- [ ] Migrate 3 posts with front matter transformation
- [ ] Copy static assets to `public/images/`
- [ ] Migrate about page
- [ ] Implement i18n (zh.ts + t() helper + component updates)
- [ ] Add rehype-pangu for CJK spacing
- [ ] Build TOC.astro component
- [ ] Modify PostDetails.astro for two-column layout
- [ ] Install and configure remark-math + rehype-katex
- [ ] Add Mermaid support (client-side)
- [ ] Create Reward.astro component
- [ ] Add custom social icons (知乎, 即刻)
- [ ] Configure Google Analytics via partytown
- [ ] Add search verification meta tags
- [ ] Update GitHub Actions workflow for Astro
- [ ] Connect to Vercel
- [ ] Verify dark mode works across all new components
- [ ] Test Pagefind search with Chinese content
- [ ] Lighthouse performance audit (target: 95+ all categories)

## Out of Scope

- Comment system (not currently enabled, can be added later)
- Multi-language content routing (single zh-CN blog)
- busuanzi visitor counter (Astro static output incompatible; consider Vercel Analytics as replacement)
- Custom domain setup (keep existing GitHub Pages URL)
