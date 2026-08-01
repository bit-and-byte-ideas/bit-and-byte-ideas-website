output "dns_nameservers" {
  description = "Azure DNS nameservers — set these as custom nameservers in GoDaddy to delegate DNS to Azure."
  value       = length(data.azurerm_dns_zone.this) > 0 ? data.azurerm_dns_zone.this[0].name_servers : []
}

output "site_url" {
  description = "Public URL of the Azure Static Web App."
  value       = "https://${module.static_webapp.default_host_name}"
}

output "api_key" {
  description = "Deployment API key — store as AZURE_STATIC_WEB_APPS_API_TOKEN_DEV in the site repo's GitHub secrets."
  value       = module.static_webapp.api_key
  sensitive   = true
}
