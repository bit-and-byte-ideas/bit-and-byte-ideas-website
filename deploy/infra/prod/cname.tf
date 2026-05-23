resource "azurerm_dns_cname_record" "static_webapp" {
  count               = var.custom_domain != null ? 1 : 0
  name                = "www"
  zone_name           = azurerm_dns_zone.this[0].name
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record              = module.static_webapp.default_host_name
}
