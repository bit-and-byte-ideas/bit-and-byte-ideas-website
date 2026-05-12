project_name         = "bit-and-byte-ideas-website"
environment          = "dev"
location             = "westus2"
sku_tier             = "Free"
application_insights = false

tags = {
  owner       = "bit-and-byte-ideas"
  environment = "dev"
  managed_by  = "opentofu"
  source      = "github.com/bit-and-byte-ideas/bit-and-byte-ideas-website"
}
