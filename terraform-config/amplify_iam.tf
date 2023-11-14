resource "aws_iam_role" "amplify_role" {
  name = "amplify-deployment-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "amplify.amazonaws.com"
        },
      },
    ],
  })
}

resource "aws_iam_policy" "amplify_policy" {
  name        = "amplify-deployment-policy"
  description = "A policy for AWS Amplify to access resources."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:*",
          "cloudfront:UpdateDistribution",
          "cloudfront:CreateDistribution",
          // Include additional permissions as needed
        ],
        Effect   = "Allow",
        Resource = "*",
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "amplify_role_attachment" {
  role       = aws_iam_role.amplify_role.name
  policy_arn = aws_iam_policy.amplify_policy.arn
}
