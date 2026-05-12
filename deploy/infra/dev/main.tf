module "static_web_app" {
  source                      = "github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit/modules/azure-static-webapp"
  resource_group_name         = "${var.project_name}-${var.environment}-rg"
  static_webapp_name          = "${var.project_name}-${var.environment}-swa"
  location                    = var.location
  sku_tier                    = var.sku_tier
  enable_application_insights = var.application_insights
  tags                        = var.tags
}
