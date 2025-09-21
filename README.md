# Material for MkDocs Blog Boilerplate

A clean, modern blog built with Material for MkDocs and the built-in blog plugin.

## Features

- 🎨 Material Design theme with light/dark mode toggle
- 📝 Built-in blog plugin (no third-party dependencies)
- 🏷️ Tags and categories support
- 📱 Social cards (Open Graph)
- 📡 RSS feeds
- 🔍 Full-text search
- 📧 Newsletter integration
- 🚀 GitHub Pages deployment

## Quick Start

1. **Install dependencies:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Customize your site:**
   - Edit `mkdocs.yml` to update site name, URL, and social links
   - Replace `docs/assets/images/logo.png` with your logo
   - Update `authors.yml` with your information
   - Customize colors in the palette section of `mkdocs.yml`

3. **Run locally:**
   ```bash
   mkdocs serve
   ```
   Visit http://127.0.0.1:8000

4. **Deploy to GitHub Pages:**
   ```bash
   git init
   git add .
   git commit -m "feat: scaffold Material+Blog site"
   git branch -M main
   git remote add origin git@github.com:you/your-blog.git
   git push -u origin main
   ```

   Then enable GitHub Pages → "Deploy from a branch" → set to `gh-pages`.

## Project Structure

```
docs/
├── index.md              # Homepage
├── about.md              # About page
├── projects.md           # Projects showcase
├── uses.md               # Uses page
├── blog/
│   ├── index.md          # Blog index
│   ├── 2025-01-01-my-first-post.md
│   └── images/           # Blog post images
├── assets/
│   ├── images/
│   │   ├── logo.png      # Site logo
│   │   └── social/       # Social card images
│   └── css/
│       └── overrides.css # Custom styles
└── includes/
    └── newsletter.html   # Newsletter signup
```

## Writing Posts

Create new posts in `docs/blog/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
title: Your Post Title
date: 2025-01-01
tags: [tag1, tag2]
categories:
  - Category Name
description: Brief description for social cards
image: images/post-card.png
author: yourname
---

Your post content here...
```

## Customization

- **Colors:** Edit the `palette` section in `mkdocs.yml`
- **Fonts:** Change `font.text` and `font.code` in `mkdocs.yml`
- **Navigation:** Modify the `nav` section in `mkdocs.yml`
- **Styling:** Edit `docs/assets/css/overrides.css`

## License

MIT
