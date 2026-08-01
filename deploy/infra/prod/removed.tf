# These resources moved to the platform-foundation repo's OpenTofu state —
# the DNS zone and every record on it that isn't specific to this website
# (mail routing/auth, domain verification). `destroy = false` means OpenTofu
# only forgets these addresses; it does not touch the live Azure resources.
#
# `from` intentionally omits the count index — see:
# https://opentofu.org/docs/language/resources/syntax/#removing-resources

removed {
  from = azurerm_dns_zone.this
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_txt_record.apex
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_mx_record.protonmail
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_cname_record.protonmail_dkim
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_cname_record.protonmail_dkim2
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_cname_record.protonmail_dkim3
  lifecycle {
    destroy = false
  }
}

removed {
  from = azurerm_dns_txt_record.dmarc
  lifecycle {
    destroy = false
  }
}
