resource "aws_amplify_app" "my_app" {
  name = "my-amplify-app"

  // Replace with your repository details
  repository = "https://github.com/doctor-ew/graph-spa-bun"
  branch_name = "main"

  // Environment variables
  environment_variables = {
    ENV_VAR_NAME = "development"
  }

  // IAM service role for Amplify
  service_role_arn = aws_iam_role.amplify_role.arn

  // Other configurations...
}

resource "aws_amplify_branch" "main_branch" {
  app_id = aws_amplify_app.my_app.id
  branch_name = "main"

  // Other configurations...
}

resource "aws_amplify_domain_association" "gql_domain_association" {
  app_id = aws_amplify_app.my_app.id
  domain_name = "doctorew.com"
  sub_domain_setting {
    prefix = "gql"
    branch_name = aws_amplify_branch.main_branch.branch_name
  }

  // Additional DNS configurations may be required depending on your setup
}
