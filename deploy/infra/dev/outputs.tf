output "static_web_app_url" {
  description = "URL of the Static Web App"
  value       = module.static_web_app.static_web_app_url
}

output "static_web_app_name" {
  description = "Name of the Static Web App"
  value       = module.static_web_app.static_web_app_name
}

output "static_web_app_default_hostname" {
  description = "Default hostname of the Static Web App"
  value       = module.static_web_app.static_web_app_default_hostname
}

output "static_web_app_api_key" {
  description = "Deployment token for the Static Web App (use in GitHub Secrets)"
  value       = module.static_web_app.static_web_app_api_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.static_web_app.resource_group_name
}
