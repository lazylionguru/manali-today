# MDX Frontmatter Contract

This is the shared frontmatter shape for everything in `content/guides/*.mdx`
and (later) `content/blog/*.mdx`. Both the guide index page and any future
`blog.py` / `blog_topics.py` generator should target this exact shape, so one
rendering pipeline (`lib/mdx.ts` + `app/guide/[slug]/page.tsx`) works for both.

## Required fields

```yaml
---
title: "Complete Manali Travel Guide"          # H1 / <title> base, no site name suffix
description: "..."                              # 1-2 sentences, becomes meta description + OG description
tag: "Pillar Guide"                             # short label shown on the index tile and the article itself
category: "planning"                            # machine-readable, lowercase, used for future filtering/grouping
publishedAt: "2026-06-23"                       # ISO date, ISO 8601, ALWAYS quoted
updatedAt: "2026-06-23"                         # ISO date, bump this on every content edit
slug: "manali"                                  # must match the filename (manali.mdx), used to build the URL
---
```

## Optional fields

```yaml
faqs:                                            # if present, auto-generates FAQPage JSON-LD
  - question: "Is Manali good for a family trip in peak summer season?"
    answer: "Yes, but only if you plan around the traffic rather than against it..."
  - question: "..."
    answer: "..."

ogImage: "/og-guide-manali.jpg"                  # falls back to default site OG image if omitted
draft: false                                     # if true, excluded from /guide index and not publicly routable
```

## Rules for content authors (human or deepseek)

- `slug` must exactly match the filename minus `.mdx` (`manali.mdx` -> `slug: "manali"`).
- Internal links to the checkers use plain markdown links with the real paths,
  they render as normal `<Link>` automatically:
  - `[check live snow status](/)`
  - `[check live Atal Tunnel status](/is-atal-tunnel-open-today)`
  - `[check live Rohtang Pass status](/is-rohtang-pass-open-today)`
- External links: only credible non-competitor sources (Wikipedia, government
  sites, research, news). Never link to other travel-blog/listicle sites.
- Tables use standard markdown table syntax, they get styled automatically by
  the shared MDX component map.
- Do not include an H1 in the body, the layout renders `title` as the H1
  automatically. Body content starts at H2.
- `category` values currently in use: `planning`, `permits`, `day-trip`,
  `neighbourhood`, `weather`. Add new ones only if genuinely new.