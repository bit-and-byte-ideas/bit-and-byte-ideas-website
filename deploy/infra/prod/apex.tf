resource "azurerm_static_web_app_custom_domain" "apex" {
  count             = var.custom_domain != null ? 1 : 0
  static_web_app_id = module.static_webapp.static_webapp_id
  domain_name       = var.custom_domain
  validation_type   = "dns-txt-token"
}

# ALIAS A record — Azure DNS resolves this to the SWA's IP at query time (no fixed IP needed)
resource "azurerm_dns_a_record" "apex" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  target_resource_id  = module.static_webapp.static_webapp_id
}
