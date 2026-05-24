# H6 — IndexNow and Sitemap Submission on Deploy

**Priority:** High | **Effort:** Medium | **Category:** Technical SEO / Crawlability

## Problem

There is no mechanism to notify search engines when the site is updated. The sitemap is a static file. No CI/CD step pings Google, Bing, or IndexNow after a production deploy. Search engines discover new content only when they next crawl the site on their own schedule, which can take days to weeks for a new domain.

## Why It Matters

- New sites have minimal crawl budget — passive discovery can take weeks
- IndexNow lets you proactively push URLs to Bing (and via Bing to other participating engines) on deploy
- Google Search Console sitemap submission tells Google to recrawl on your timeline, not theirs
- A 5-minute CI step can cut re-indexing time from weeks to hours

## Action Items

### 1. Generate an IndexNow key

Go to https://www.bing.com/indexnow and generate a key, or create a random 32-character hex string:

```bash
openssl rand -hex 16
# Example output: a3f8b2c14d9e6f7a8b3c4d5e6f7a8b9c
```

### 2. Place the IndexNow key file

Create `public/<your-key>.txt` containing only the key value:

```
a3f8b2c14d9e6f7a8b3c4d5e6f7a8b9c
```

This file must be accessible at `https://www.bitandbyteideas.com/<your-key>.txt`.

### 3. Add a deploy step to `.github/workflows/deploy-app-prod.yaml`

After the Azure Static Web Apps deploy step, add:

```yaml
- name: Notify search engines
  run: |
    SITE_URL="https://www.bitandbyteideas.com"
    SITEMAP_URL="${SITE_URL}/sitemap.xml"
    INDEXNOW_KEY="<your-indexnow-key>"

    # Ping Google (sitemap)
    curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" || true

    # Ping Bing (sitemap)
    curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" || true

    # Submit via IndexNow (Bing)
    curl -s -X POST "https://api.indexnow.org/indexnow" \
      -H "Content-Type: application/json" \
      -d '{
        "host": "www.bitandbyteideas.com",
        "key": "'"${INDEXNOW_KEY}"'",
        "urlList": ["'"${SITE_URL}/"'"]
      }' || true

    echo "Search engine pings complete"
```

The `|| true` prevents the workflow from failing if a ping service is temporarily unavailable.

### 4. Submit sitemap to Google Search Console manually (first time)

The CI step pings Google's sitemap endpoint, but for the first submission:

1. Go to https://search.google.com/search-console
2. Add property: `https://www.bitandbyteideas.com`
3. Verify ownership via the DNS TXT record already in the Azure DNS zone (or via HTML file)
4. Navigate to Sitemaps → Enter `sitemap.xml` → Submit

### 5. Submit to Bing Webmaster Tools manually (first time)

1. Go to https://www.bing.com/webmasters
2. Add site: `https://www.bitandbyteideas.com`
3. Import from Google Search Console (easiest method) or verify manually

## Files to Change

| File                                     | Change                    |
| ---------------------------------------- | ------------------------- |
| `public/<indexnow-key>.txt`              | Create with key value     |
| `.github/workflows/deploy-app-prod.yaml` | Add post-deploy ping step |

## Definition of Done

- [ ] IndexNow key file accessible at `https://www.bitandbyteideas.com/<key>.txt`
- [ ] CI workflow pings Google sitemap, Bing sitemap, and IndexNow on every production deploy
- [ ] Site verified in Google Search Console and sitemap shows "Success"
- [ ] Site verified in Bing Webmaster Tools
- [ ] Pings do not cause the CI workflow to fail if a service is unreachable
