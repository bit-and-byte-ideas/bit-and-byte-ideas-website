# L1 — Upgrade DMARC Policy to p=reject

**Priority:** Low | **Effort:** Low | **Category:** Security / Email

## Problem

The current DMARC record is:

```
v=DMARC1; p=quarantine
```

`p=quarantine` tells receiving mail servers to send spoofed emails to spam. `p=reject` tells them to block spoofed emails outright — stronger protection against domain impersonation.

## Why It Matters

- `p=reject` is the recommended end-state for DMARC once email deliverability is confirmed
- Protects the `bitandbyteideas.com` domain from being used in phishing/spoofing attacks
- Some enterprise email security scanners penalize domains still at `quarantine` after a reasonable period

## When to Upgrade

Do not upgrade until:

1. ProtonMail is fully configured and sending/receiving normally
2. DKIM is verified for all three selectors (`protonmail._domainkey`, `protonmail2._domainkey`, `protonmail3._domainkey`)
3. At least 2 weeks of DMARC reports show 100% alignment (no legitimate mail failing DMARC)

DMARC reports can be monitored by adding `rua` and `ruf` tags to the record.

## Fix

Update the DMARC TXT record in `deploy/infra/prod/dns_records.tf`:

```hcl
# Step 1: Add reporting while still at quarantine (do this first)
resource "azurerm_dns_txt_record" "dmarc" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "_dmarc"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record {
    value = "v=DMARC1; p=quarantine; rua=mailto:dmarc@bitandbyteideas.com; ruf=mailto:dmarc@bitandbyteideas.com; pct=100"
  }
}
```

After 2 weeks of clean reports, change to:

```hcl
record {
  value = "v=DMARC1; p=reject; rua=mailto:dmarc@bitandbyteideas.com; pct=100"
}
```

## Files to Change

| File                               | Change                        |
| ---------------------------------- | ----------------------------- |
| `deploy/infra/prod/dns_records.tf` | Update DMARC TXT record value |

## Definition of Done

- [ ] DMARC reports are being received at the `rua` address
- [ ] At least 2 weeks of reports show 100% DMARC pass rate
- [ ] Record updated to `p=reject`
- [ ] OpenTofu plan reviewed and applied via CI
- [ ] ProtonMail sends and receives normally after the change
