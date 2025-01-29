# EffigoDevops

EffigoDevops is a full-stack web application consisting of a React frontend and a Spring Boot backend. This repository includes the application code along with deployment configurations for AWS.

Project Structure

EffigoDevops/
│── Frontend/      # React application
│── Backend/       # Spring Boot application
│── deployment/    # Kubernetes manifests for frontend and backend
│── Jenkinsfile    # CI/CD pipeline configuration
│── README.md      # Project documentation

Deployment Overview

The application is deployed on AWS using the following pipeline:

Jenkins (hosted on an AWS Ubuntu instance) builds Docker images for the frontend and backend.

The images are pushed to AWS Elastic Container Registry (ECR).

The application is deployed to AWS Elastic Kubernetes Service (EKS) using Kubernetes manifests.



Prerequisites

Ensure you have the following set up:

AWS account with EKS, ECR, and IAM roles configured.

Kubernetes CLI (kubectl) and AWS CLI installed.

Docker installed and configured.

Jenkins set up on an AWS EC2 instance.


enkinsfile (Pipeline Script)

The Jenkinsfile in the repository automates the following steps:

Checkout the repository

Build Docker images

Authenticate and push images to AWS ECR

 Deploy to Kubernetes (EKS)
 kubectl apply -f kubernetes/

 . Verify Deployment

 kubectl get pods
kubectl get services

Accessing the Application

Once deployed, obtain the external IP(loadbalancer) of the frontend service:
kubectl get svc frontend-service