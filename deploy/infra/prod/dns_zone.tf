# The zone itself is managed by the platform-foundation repo's OpenTofu
# state (foundational, subscription-level asset — shared with mail/DNS
# records that have nothing to do with this website). Referenced here via
# data source for the records that remain app-specific (apex A, www CNAME).
data "azurerm_dns_zone" "this" {
  count               = var.custom_domain != null ? 1 : 0
  name                = var.custom_domain
  resource_group_name = "rg-${var.project_name}-${var.environment}"
}
