# L4 — Create External Directory Listings

**Priority:** Low | **Effort:** Medium | **Category:** E-E-A-T / Off-Page SEO

## Problem

The business has no presence on B2B service directories. External listings on authoritative directories:

1. Provide backlinks (even nofollow) from high-DA domains
2. Supply `sameAs` data for the Organization schema (see M6)
3. Serve as third-party validation signals for Google's Knowledge Graph
4. Drive direct referral traffic from buyers browsing directories

## Why It Matters

- Google's E-E-A-T evaluation considers off-page signals
- New domains with zero external mentions have low authority by default
- Directory listings are the lowest-effort way to establish an entity footprint
- Clutch and GoodFirms specifically target B2B software buyers — the exact audience for this studio

## Target Directories

| Directory             | Priority | Notes                                                          |
| --------------------- | -------- | -------------------------------------------------------------- |
| LinkedIn Company Page | High     | Highest authority; required for `sameAs`                       |
| Clutch.co             | High     | B2B agency directory, strong DA, reviewed by buyers            |
| GoodFirms             | High     | Similar to Clutch, smaller but relevant                        |
| DesignRush            | Medium   | Agency-focused, moderate authority                             |
| Crunchbase            | Medium   | Startup/company database, recognized by Google Knowledge Graph |
| AppFutura             | Low      | Web development directory                                      |
| Sortlist              | Low      | European-focused agency marketplace                            |

## Process for Each Listing

1. Create the account/profile
2. Fill in all fields: business name (exact: `Bit & Byte Ideas`), description, services, location, website URL, email
3. Use the same description across all platforms (for entity consistency)
4. Add the profile URL to the `sameAs` array in schema once live (see M6)

## Consistent Description to Use

Use this blurb across all directory profiles (adapt length as needed):

> Bit & Byte Ideas is a custom software studio building websites and web applications for small and medium businesses. We specialize in static website development, full-stack web application development, and managed hosting with maintenance subscriptions. Everything we build is custom-designed — no templates. Based in [City, State].

## Files to Change

| File             | Change                                                       |
| ---------------- | ------------------------------------------------------------ |
| `src/index.html` | Add listing URLs to `sameAs` once profiles are live (see M6) |

No code changes required to create the listings themselves.

## Definition of Done

- [ ] LinkedIn Company Page created and published with complete profile
- [ ] Clutch profile submitted (note: Clutch requires at least 1 verified review to show publicly)
- [ ] GoodFirms profile created
- [ ] All profiles use identical business name, email, and website URL
- [ ] Profile URLs added to `sameAs` in schema (see M6)
