resource "azurerm_dns_cname_record" "static_webapp" {
  name                = "www"
  zone_name           = var.custom_domain
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  ttl                 = 300
  record              = module.static_webapp.default_host_name
}
