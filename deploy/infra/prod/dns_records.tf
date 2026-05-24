# All TXT records at the apex (@) must live in a single resource — Azure DNS
# only allows one record set per name/type combination.
resource "azurerm_dns_txt_record" "apex" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "@"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record {
    value = azurerm_static_web_app_custom_domain.apex[0].validation_token
  }
  record {
    value = "atlassian-domain-verification=tbGo0150p21lA6kaANcW2PauHlwaPSqB5a6GiahGN7W4vA9o3FzyKzMOfdiRenLS"
  }
  record {
    value = "protonmail-verification=7bfc9f22578142f18755e7f44fc7974535152c2c"
  }
  record {
    value = "v=spf1 include:_spf.protonmail.ch ~all"
  }
  depends_on = [azurerm_static_web_app_custom_domain.apex]
}

resource "azurerm_dns_mx_record" "protonmail" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "@"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record {
    preference = 10
    exchange   = "mail.protonmail.ch."
  }
  record {
    preference = 20
    exchange   = "mailsec.protonmail.ch."
  }
}

resource "azurerm_dns_cname_record" "protonmail_dkim" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "protonmail._domainkey"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record              = "protonmail.domainkey.dgeesy544louti5wx6ruah54qtjo4cq5rjlt25frofn464zeldgdq.domains.proton.ch."
}

resource "azurerm_dns_cname_record" "protonmail_dkim2" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "protonmail2._domainkey"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record              = "protonmail2.domainkey.dgeesy544louti5wx6ruah54qtjo4cq5rjlt25frofn464zeldgdq.domains.proton.ch."
}

resource "azurerm_dns_cname_record" "protonmail_dkim3" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "protonmail3._domainkey"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record              = "protonmail3.domainkey.dgeesy544louti5wx6ruah54qtjo4cq5rjlt25frofn464zeldgdq.domains.proton.ch."
}

resource "azurerm_dns_txt_record" "dmarc" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "_dmarc"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record {
    value = "v=DMARC1; p=quarantine"
  }
}

# Tells OpenTofu this resource was renamed from apex_validation — prevents destroy+recreate.
moved {
  from = azurerm_dns_txt_record.apex_validation[0]
  to   = azurerm_dns_txt_record.apex[0]
}
