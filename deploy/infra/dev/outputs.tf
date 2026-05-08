output "static_web_app_url" {
  description = "URL of the Static Web App"
  value       = module.static_web_app.default_host_name
}

output "static_webapp_id" {
  description = "Resource ID of the Azure Static Web App"
  value       = module.static_web_app.static_webapp_id
}

output "static_web_app_api_key" {
  description = "Deployment token for the Static Web App (use in GitHub Secrets)"
  value       = module.static_web_app.api_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.static_web_app.resource_group_name
}
