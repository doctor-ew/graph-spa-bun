# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
      },
    ],
  })
}

# ECR Repository for Docker Image
resource "aws_ecr_repository" "my_ecr_repo" {
  name = "graph-spa-bun" # Repository name
}

output "repository_url" {
  value = aws_ecr_repository.my_ecr_repo.repository_url
}

# IAM Policy for ECS Task Execution
resource "aws_iam_policy" "ecs_task_execution_policy" {
  name        = "ecs-task-execution-policy"
  description = "A policy that allows ECS tasks to call AWS services on your behalf."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          // Include additional permissions as needed
        ],
        Effect   = "Allow",
        Resource = "*",
      },
    ],
  })
}

# Attach IAM Policy to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_policy.arn
}
