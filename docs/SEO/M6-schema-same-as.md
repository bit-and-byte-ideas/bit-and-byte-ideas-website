# M6 — Populate sameAs in Schema

**Priority:** Medium | **Effort:** Low | **Category:** Structured Data / E-E-A-T

## Problem

The `Organization` schema block (added in H3) has an empty `sameAs` array:

```json
"sameAs": []
```

`sameAs` links the schema entity to external authoritative sources — LinkedIn, GitHub, Twitter/X, Crunchbase, and similar. Without it, Google cannot confidently connect the schema entity to the business's real-world presence, weakening Knowledge Graph confidence and AI citation accuracy.

## Why It Matters

- `sameAs` is how Google's Knowledge Graph confirms entity identity across the web
- An empty `sameAs` is not harmful, but a populated one directly improves entity authority
- Each `sameAs` URL is a signal that "this schema entity = this real-world profile"
- LLMs (ChatGPT, Perplexity) cross-reference `sameAs` links when generating summaries about a business

## Action Items

### 1. Create the profiles

Before adding URLs to `sameAs`, the profiles must exist:

| Platform                                              | Why                                                   |
| ----------------------------------------------------- | ----------------------------------------------------- |
| LinkedIn Company Page                                 | Highest authority social signal for B2B               |
| GitHub Organization (`github.com/bit-and-byte-ideas`) | Already exists — demonstrates technical work          |
| Twitter/X                                             | Brand presence, `twitter:site` meta tag               |
| Crunchbase                                            | Free listing, high DA, recognized by Google           |
| Clutch.co                                             | B2B services directory, strong authority for agencies |

### 2. Add URLs to schema

Once profiles exist, update the `Organization` schema in `src/index.html`:

```json
"sameAs": [
  "https://www.linkedin.com/company/bit-and-byte-ideas",
  "https://github.com/bit-and-byte-ideas",
  "https://twitter.com/bitandbyteideas",
  "https://www.crunchbase.com/organization/bit-and-byte-ideas",
  "https://clutch.co/profile/bit-and-byte-ideas"
]
```

Only add URLs for profiles that are actually active and accurate. An empty profile is worse than no listing.

### 3. Ensure NAP consistency

Across all profiles, use exactly the same:

- Business name: `Bit & Byte Ideas`
- Email: `info@bitandbyteideas.com`
- Location: `[City, State]` (consistent with H5)
- Website URL: `https://www.bitandbyteideas.com`

Inconsistent Name/Address/Phone (NAP) across platforms dilutes entity authority.

## Files to Change

| File             | Change                                         |
| ---------------- | ---------------------------------------------- |
| `src/index.html` | Populate `sameAs` array in Organization schema |

## Definition of Done

- [ ] At least 2 `sameAs` URLs added (LinkedIn and GitHub at minimum)
- [ ] All linked profiles are live, accurate, and use consistent business name/description
- [ ] Schema validated at https://validator.schema.org — no errors
- [ ] `ng build` passes with no errors
