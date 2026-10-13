---
# Copy to src/content/blog/<slug>/index.md. The folder name is the slug.
# Field rules: docs/website/CONTENT.md#article-srccontentblogslugindexmd
title: 'TODO: Article title (≤ 80 chars)'
description: 'TODO: What the reader will learn or decide, in one sentence (50–160 chars).'
status: draft # stays draft until Carlos adds `review`
author: carlos-barajas
tags: [web-development] # 1–4 keys from src/content/blog-tags.ts
toc: auto # auto | show | hide
# publishedOn: YYYY-MM-DD          # set by Carlos when publishing
# updatedOn: YYYY-MM-DD            # substantive revisions only
# cover:
#   file: cover.png                # in ./images/
#   alt: 'TODO'
# Body images: ![what it shows, 10+ chars](./images/name.png "Optional caption")
# The quoted title becomes the visible caption (D-035); don't repeat the alt text.

# Added by Carlos only. Agents must never write this block.
# review:
#   approvedBy: Carlos Barajas
#   approvedOn: YYYY-MM-DD
---

TODO: Opening paragraph. Name the reader's situation and what this article helps them
decide. No H1 here; the title is the H1.

## The situation

TODO: Context the reader recognizes. Mark anything that depends on Carlos's own
experience with `TODO:` so it is confirmed before publishing.

## What we recommend

TODO: The core guidance, with the reasoning and the tradeoffs.

```ts
// Every fenced code block names its language (ts, go, bash, json, yaml, text, …).
export function example(): string {
  return 'replace me';
}
```

## When this doesn't apply

TODO: Honest limits of the advice.

## Next step

TODO: One or two sentences that connect to the relevant service. The page template adds
the Book a Call / Get in Touch band automatically, so don't add buttons here.
