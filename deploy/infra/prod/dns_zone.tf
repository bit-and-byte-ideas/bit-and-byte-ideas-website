resource "azurerm_dns_zone" "this" {
  count               = var.custom_domain != null ? 1 : 0
  name                = var.custom_domain
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  tags                = var.tags
}
