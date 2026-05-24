# H7 — Name AI Crawlers Explicitly in robots.txt

**Priority:** High | **Effort:** Low | **Category:** AI Search / GEO

## Problem

`public/robots.txt` currently contains only:

```
User-agent: *
Allow: /
Sitemap: https://www.bitandbyteideas.com/sitemap.xml
```

The wildcard `Allow: /` permits all crawlers, including beneficial AI indexers like GPTBot and ClaudeBot. However, naming them explicitly signals clear intent and is recognized by crawlers that check for explicit permission before indexing content for AI training and search purposes.

## Why It Matters

- OpenAI's GPTBot documentation states it will respect explicit allow/disallow rules
- Perplexity, Anthropic, and other AI labs check `robots.txt` for their named user agents
- Explicit rules demonstrate awareness of AI SEO and signal that the site is intentionally open to AI indexing
- Some AI crawlers give preference to sites that explicitly allow them over sites relying only on wildcards

## Recommended robots.txt

Replace `public/robots.txt` with:

```
# Beneficial AI search crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: cohere-ai
Allow: /

# Standard search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# Default — allow all remaining crawlers
User-agent: *
Allow: /

Sitemap: https://www.bitandbyteideas.com/sitemap.xml
```

## Optional: Block Low-Quality Scrapers

If you want to prevent scraping by data aggregators that don't provide referral traffic, you can add disallow rules for specific bots. This is optional and should only be done if you have a specific reason — the default `Allow: /` is fine for most cases.

```
# Example: block Common Crawl (feeds many model training datasets without attribution)
# User-agent: CCBot
# Disallow: /
```

For a new site trying to build visibility, it is recommended to leave all crawlers allowed.

## Files to Change

| File                | Change                              |
| ------------------- | ----------------------------------- |
| `public/robots.txt` | Replace with expanded version above |

## Definition of Done

- [ ] `https://www.bitandbyteideas.com/robots.txt` names GPTBot, ClaudeBot, PerplexityBot, anthropic-ai explicitly
- [ ] All named crawlers are set to `Allow: /`
- [ ] `Sitemap:` directive still present
- [ ] Validate at https://www.bing.com/webmasters/robots-tester — no errors
