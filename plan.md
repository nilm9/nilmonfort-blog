Got you. Here’s a single, copy-paste brief you can drop into your AI coding editor. It tells it exactly what to scaffold, which files to create, and the commands to run. Minimal, clean, Material for MkDocs + built-in Blog plugin (no extra blog package).

---

## 🔧 Build me a Material-for-MkDocs blog (Dave/JXNL style)

**Role:** You are a senior developer. Create a fresh MkDocs site styled like jxnl.co / daveebbelaar.com using **Material for MkDocs** with the **built-in `blog` plugin**, tags, archives, RSS, social cards, light/dark toggle, and GitHub Pages deploy.
**Important:** Do **not** use any third-party “mkdocs-blog-plugin”. The blog plugin ships with Material.

### 0) Prereqs

* Python 3.10+ (use 3.11 if available)
* Git installed
* A new private GitHub repo (I’ll add remote later)

### 1) Project layout

Create this tree:

```
my-blog/
├─ docs/
│  ├─ index.md
│  ├─ about.md
│  ├─ projects.md
│  ├─ uses.md
│  ├─ blog/
│  │  ├─ index.md
│  │  ├─ 2025-01-01-my-first-post.md
│  │  └─ images/.gitkeep
│  ├─ assets/
│  │  ├─ images/
│  │  │  └─ logo.png           # placeholder
│  │  └─ css/overrides.css
│  └─ includes/newsletter.html
├─ authors.yml
├─ mkdocs.yml
├─ requirements.txt
└─ .github/workflows/gh-pages.yml
```

### 2) `requirements.txt`

```
mkdocs-material>=9.5
mkdocs-material-extensions>=1.3
mkdocs-rss-plugin>=1.12
```

### 3) `mkdocs.yml`

```yaml
site_name: Your Name
site_url: https://yourdomain.com
repo_url: https://github.com/you/your-blog
theme:
  name: material
  logo: assets/images/logo.png
  favicon: assets/images/logo.png
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - toc.integrate
    - content.code.copy
    - content.action.edit
    - content.tabs.link
    - search.suggest
    - search.highlight
  palette:
    - scheme: default
      primary: indigo
      accent: cyan
      toggle:
        icon: material/weather-night
        name: Dark mode
    - scheme: slate
      primary: indigo
      accent: cyan
      toggle:
        icon: material/weather-sunny
        name: Light mode
  font:
    text: Inter
    code: JetBrains Mono

plugins:
  - search
  - blog:
      blog_dir: blog
      blog_toc: true
      categories: true
      archive: true
      post_url_format: "{date}/{slug}"
      post_date_format: "%Y/%m/%d"
      authors_file: authors.yml
      pagination_per_page: 10
  - tags:
      tags_file: blog/tags.md
  - social:
      cards: true
      cards_dir: assets/images/social
  - rss:
      match_path: blog/.*        # only posts
      date_from_meta:
        as_creation: date
      categories:
        - categories
        - tags

markdown_extensions:
  - attr_list
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.emoji
  - pymdownx.highlight
  - pymdownx.inlinehilite
  - pymdownx.snippets
  - toc:
      permalink: true

nav:
  - Home: index.md
  - Writing: blog/index.md
  - Projects: projects.md
  - Uses: uses.md
  - About: about.md

extra:
  social:
    - icon: fontawesome/brands/x-twitter
      link: https://x.com/yourhandle
    - icon: fontawesome/brands/linkedin
      link: https://www.linkedin.com/in/yourhandle/
    - icon: fontawesome/brands/github
      link: https://github.com/you
  generator: false   # hide footer generator text

extra_css:
  - assets/css/overrides.css
```

### 4) Pages

**`docs/index.md`**

```markdown
---
template: home.html
hide:
  - toc
---

# Hey, I’m Your Name

I write about AI engineering, data, and building products.

--8<-- "includes/newsletter.html"

[RSS](/feed_rss_created_by_rss_plugin.xml)

## Latest writing
{{ blog_cards(limit=6) }}
```

**`docs/blog/index.md`**

```markdown
---
title: Writing
hide:
  - toc
---

# Writing

Browse by [category](categories.md) or [tags](../blog/tags.md).

{{ blog_cards(paginate=True) }}
```

**`docs/blog/2025-01-01-my-first-post.md`**

```markdown
---
title: Opening VS Code Workspace Files with Cursor on macOS
date: 2025-01-01
tags: [tools, quick-tips]
categories:
  - Tools
description: A tiny fix for .code-workspace files with Cursor on macOS.
image: images/post-card.png
author: yourname
---

Intro paragraph…

## What’s the issue?

…

## Fix

…
```

**`docs/about.md`**

```markdown
# About
Short bio + photo.
```

**`docs/projects.md`**

```markdown
# Projects
Highlight a few projects with links.
```

**`docs/uses.md`**

```markdown
# Uses
Hardware, software, desk setup, workflow.
```

**`docs/includes/newsletter.html`**

```html
<div class="newsletter-embed">
  <p>Get new posts in your inbox (max 2×/month).</p>
  <!-- Paste your email form embed here -->
</div>
```

### 5) Styling

**`docs/assets/css/overrides.css`**

```css
/* narrower readable measure */
.md-content { max-width: 860px; }
.md-content__inner > h1:first-child { margin-top: 0.25rem; }

/* subtle card polish for blog grids */
.md-typeset .blog-card {
  border-radius: 14px;
  box-shadow: var(--md-shadow-z2);
}

/* newsletter box */
.newsletter-embed {
  padding: 0.75rem 1rem;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 12px;
}
```

### 6) Authors

**`authors.yml`**

```yaml
yourname:
  name: Your Name
  description: AI Engineer / Consultant
  avatar: assets/images/logo.png
```

### 7) GitHub Actions (deploy to Pages)

**`.github/workflows/gh-pages.yml`**

```yaml
name: Deploy MkDocs
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: mkdocs build --strict
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

### 8) Commands (init, run, deploy)

From repo root:

```bash
# init
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# dev
mkdocs serve  # visit http://127.0.0.1:8000

# git
git init
git add .
git commit -m "feat: scaffold Material+Blog site"
git branch -M main
git remote add origin git@github.com:you/your-blog.git
git push -u origin main
```

Then enable **GitHub Pages** → “Deploy from a branch” → set to `gh-pages` (the action will create it on first run).

### 9) Quick edits to brand it

* In `mkdocs.yml`, set `site_name`, `site_url`, and your social links.
* Replace `assets/images/logo.png`.
* Adjust `palette.primary`/`accent` to your brand color.
* Write more posts in `docs/blog/` with `YYYY-MM-DD-title.md`.

### 10) Sanity checklist

* Blog index shows card grid with pagination.
* `/blog/categories/` and `/blog/tags/` render.
* RSS at `/feed_rss_created_by_rss_plugin.xml`.
* Social cards generate on build (Open Graph).

---

**That’s it.** Execute these steps exactly and I’ll have a Dave/JXNL-style blog ready with posts, tags, archives, RSS, social cards, dark mode, and CI deploy.
DO NOT PUBLISH PUBLICLY YET