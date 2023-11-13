resource "aws_ecs_cluster" "backend_cluster" {
  name = "backend-cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "your-execution-role-arn" # Replace with your role ARN

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
