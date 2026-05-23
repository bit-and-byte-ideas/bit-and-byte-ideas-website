project_name         = "bit-and-byte-ideas-website"
environment          = "prod"
sku_tier             = "Free"
application_insights = true
custom_domain        = "bitandbyteideas.com"

tags = {
  owner       = "bit-and-byte-ideas"
  environment = "prod"
  managed_by  = "opentofu"
  source      = "github.com/bit-and-byte-ideas/bit-and-byte-ideas-website"
}
