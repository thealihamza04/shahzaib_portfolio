# Shahzaib Rafique — Portfolio

A single-page portfolio for **Shahzaib Rafique**, a creative marketer and visual storyteller based in Lahore, Pakistan — specializing in product photography, social media marketing, and videography.

![Portfolio preview](preview.png)

## Overview

A fast, fully responsive, single-file static site. No build step, no dependencies to install — just open it in a browser. The contact form opens WhatsApp with the message pre-filled, so the site works without a backend.

## Features

- **Mobile-first responsive layout** — built with Tailwind utility classes, single `md:` breakpoint
- **Accessible** — skip link, semantic landmarks, labelled sections, visible focus rings, `inert` mobile menu, `prefers-reduced-motion` support
- **SEO-ready** — unique title & meta description, Open Graph + Twitter Card tags, canonical URL, and `Person` JSON-LD structured data
- **No backend** — the contact form deep-links to WhatsApp with a pre-filled message

## Sections

| Section | Content |
|---------|---------|
| Hero | Intro, availability badge, and primary call-to-action |
| Services | Product Photography · Social Media Marketing · Videography |
| About | Background, approach, and "why work with me" |
| Contact | WhatsApp / email / location, plus a WhatsApp contact form |

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- Vanilla JavaScript (mobile menu + form handling)
- Google Fonts — Playfair Display & Inter; Material Symbols for icons

## Getting Started

The site is a single `index.html` file. Open it directly, or serve it locally:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customization

Before going live, replace the placeholder values:

- `index.html` — set the real domain in the `og:url`, `canonical`, and JSON-LD `url` fields (currently `https://example.com/`)
- `index.html` — replace the placeholder `og:image` / `twitter:image` with a hosted 1200×630 share image
- `shahzaib.png` — swap in the final hero/about photo

## Project Structure

```
.
├── index.html      # The entire site (markup, styles, scripts)
├── shahzaib.png    # Hero & about portrait
├── preview.png     # Screenshot used in this README
└── readme.md
```

## Contact

- **WhatsApp:** +92 307 4743714
- **Email:** shahzaibrafique671@gmail.com
- **Instagram:** [@i_em_shahzaib_06](https://www.instagram.com/i_em_shahzaib_06)
- **LinkedIn:** [Shahzaib Rafique](https://pk.linkedin.com/in/shahzaib-rafique-34303435b)
