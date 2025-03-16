#!/bin/bash
# Deploy the container images to ECR.
set -e
# Variables
DOCKER_BUILD="docker build --progress=plain"
AWS_REGION="us-west-2"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
FRONTEND_REPO_NAME="swiss-frontend"
BACKEND_REPO_NAME="swiss-backend"
FRONTEND_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO_NAME}:latest"
BACKEND_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO_NAME}:latest"

# Authenticate Docker to ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build Docker images
$DOCKER_BUILD -t ${FRONTEND_IMAGE} ./frontend
$DOCKER_BUILD -t ${BACKEND_IMAGE} ./backend

# Push Docker images to ECR
docker push ${FRONTEND_IMAGE}
docker push ${BACKEND_IMAGE}
 
aws ecs update-service --cluster swiss-scramble --service swiss-scramble-service --task-definition frontend-backend-task --force-new-deployment --region ${AWS_REGION}
