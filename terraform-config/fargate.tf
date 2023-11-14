# --- AWS ECS Cluster ---
resource "aws_ecs_cluster" "backend_cluster" {
  name = "backend-cluster"
}

# --- AWS ECR Repository ---
resource "aws_ecr_repository" "my_ecr_repo" {
  name = "graph-spa-bun" # Replace with your repository name
}

# --- AWS ECS Task Definition ---
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([{
    name  = "backend"
    image = "${aws_ecr_repository.my_ecr_repo.repository_url}:latest" # Use the latest image
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
}

# --- AWS ECS Service ---
resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["your-subnet-id"] # Replace with your subnet IDs
    security_groups = [aws_security_group.my_sg.id]
  }

  desired_count = 1
}


resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::432230020714:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS" # Replace with your role ARN

  container_definitions = jsonencode([{
    name  = "backend"
    image = "your-docker-image" # Replace with your Docker image
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["your-subnet-id"] # Replace with your subnet IDs
    security_groups = [aws_security_group.redis_sg.id]
  }

  desired_count = 1
}
