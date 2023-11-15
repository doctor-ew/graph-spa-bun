# Terraform provider configuration
provider "aws" {
  region = "us-east-1"
  assume_role {
    role_arn     = "arn:aws:iam::432230020714:role/terraform-role"
    session_name = "TerraformSession"
  }
}

# Existing VPC and the first public subnet
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}
# Internet Gateway for the VPC
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Route Table for the Internet Gateway
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

# Associate Route Table with the subnets
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.main.id
}

resource "aws_route_table_association" "public_secondary" {
  subnet_id      = aws_subnet.public_secondary.id
  route_table_id = aws_route_table.main.id
}
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a" # Adjust the AZ as per your requirement
}

# Additional public subnet in a different Availability Zone
resource "aws_subnet" "public_secondary" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24" # Ensure this CIDR block is different and does not overlap with the first subnet
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1b" # Choose a different AZ
}

variable "github_oauth_token" {
  description = "GitHub OAuth token"
  type        = string
}

# AWS Amplify for Frontend
resource "aws_amplify_app" "bang_frontend_app" {
  name        = "bang-frontend-app"
  repository  = "https://github.com/doctor-ew/graph-spa-bun"
  oauth_token = var.github_oauth_token
  # Additional configurations...
}

resource "aws_amplify_branch" "main_branch" {
  app_id      = aws_amplify_app.bang_frontend_app.id
  branch_name = "main"
  # Additional configurations...
}

resource "aws_amplify_domain_association" "frontend_domain" {
  app_id      = aws_amplify_app.bang_frontend_app.id
  domain_name = "doctorew.com"

  sub_domain {
    prefix      = "bang"
    branch_name = aws_amplify_branch.main_branch.branch_name
  }
}

resource "aws_amplify_webhook" "webhook" {
  app_id      = aws_amplify_app.bang_frontend_app.id
  branch_name = aws_amplify_branch.main_branch.branch_name
  # Additional configurations...
}

#resource "aws_route53_record" "frontend_dns" {
#  zone_id = "Z725VNARWWWV9"
#  name    = "bang.doctorew.com"
#  type    = "A"
#  alias {
#    name                   = aws_amplify_app.bang_frontend_app.default_domain
#    zone_id                = "Z725VNARWWWV9"
#    evaluate_target_health = false
#  }
#}
# Redis with ElastiCache
resource "aws_elasticache_cluster" "redis_cache" {
  cluster_id           = "redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.example.name
}

# Redis subnet group
resource "aws_elasticache_subnet_group" "example" {
  name       = "graphql-subnet-group"
  subnet_ids = [aws_subnet.public.id]
}

# Security Group
resource "aws_security_group" "allow_all" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

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

# Update Load Balancer to use both subnets
resource "aws_lb" "backend_alb" {
  name               = "graphql-backend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_all.id]
  subnets            = [aws_subnet.public.id, aws_subnet.public_secondary.id]
}

resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "graphql-backend-tg"
  port     = 4000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}

# DNS Record for Backend Subdomain
resource "aws_route53_record" "backend_dns" {
  zone_id = "Z725VNARWWWV9" # Replace with your actual Route 53 hosted zone ID
  name    = "graph.doctorew.com"
  type    = "A"

  alias {
    name                   = aws_lb.backend_alb.dns_name
    zone_id                = aws_lb.backend_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_ecr_repository" "backend_image_repo" {
  name                 = "graph-backend-image" // Name of your repository
  image_tag_mutability = "MUTABLE"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.backend_image_repo.repository_url
}


# ECS Cluster (Placeholder - replace with your actual configuration)
resource "aws_ecs_cluster" "graph_cluster" {
  name = "graph-cluster"
}

# ECS Task Definition (Placeholder - replace with your actual configuration)
resource "aws_ecs_task_definition" "graph_backend" {
  family                   = "graph_backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions    = <<DEFINITION
[{
  "name": "backend",
  "image": "${aws_ecr_repository.backend_image_repo.repository_url}:latest",
  "essential": true,
  "portMappings": [{
    "containerPort": 4000,
    "hostPort": 4000
  }]
}]
DEFINITION
}

# Similar task definition for frontend

# Fargate Services
resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.graph_cluster.id
  task_definition = aws_ecs_task_definition.graph_backend.arn
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.public.id]
    security_groups = [aws_security_group.allow_all.id]
  }
}

# Output for Amplify App CloudFront URL (optional)
output "amplify_app_cloudfront_url" {
  value = aws_amplify_app.bang_frontend_app.default_domain
}

# Additional Terraform configurations might be required based on your specific requirements
# and AWS setup.
