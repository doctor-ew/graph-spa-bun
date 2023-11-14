provider "aws" {
  region = "us-east-1"
  # Only include if you need to assume a specific role
  assume_role {
    role_arn     = "arn:aws:iam::432230020714:role/terraform-role"
    session_name = "TerraformSession"
  }

}

