module "static_web_app" {
  source = "github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit/modules/azure-static-webapp"

  resource_group_name = "rg-bit-and-byte-ideas-dev"
  location            = "West US 2"
  static_webapp_name  = "bit-and-byte-ideas-dev"

  # Optional features
  sku_tier                    = "Free"
  enable_application_insights = false

  tags = {
    environment = "dev"
    project     = "bit-and-byte-ideas"
    source      = "github.com/bit-and-byte-ideas/bit-and-byte-ideas-website"
  }
}
