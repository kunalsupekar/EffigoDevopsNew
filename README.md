# Full Stack web-application on AWS EKS

full-stack web application that integrates a React frontend with a Spring Boot backend. This repository contains the application code along with deployment configurations for AWS.

## Project Structure
```bash
EffigoDevopsNew/
│── Frontend/      # React application
│── Backend/       # Spring Boot application
│── deployment/    # Kubernetes manifests for frontend and backend
│── Jenkinsfile    #  pipeline configuration
│── README.md      # Project documentationInstall something
```

### Database

PostgreSQL Database is used as the primary database for the application which is Hosted on AWS by using RDS.




### Deployment Overview

- The application is deployed on AWS using the following pipeline:

- Jenkins (hosted on an AWS Ubuntu instance) builds Docker images for the frontend and backend.

- The images are pushed to AWS Elastic Container Registry (ECR).

- The application is deployed to AWS Elastic Kubernetes Service (EKS) using Kubernetes manifests.

### Prerequisites

- An AWS account with EKS, ECR, and IAM roles configured.
- Kubernetes CLI (kubectl) and AWS CLI installed.
- Docker installed and configured.
- Jenkins set up on an AWS EC2 instance.


Jenkinsfile (Pipeline Script)

Deploy to Kubernetes (EKS)
```bash
kubectl apply -f deployment/ 
```
Verify Deployment
```bash
kubectl get pods
kubectl get services
```
Accessing the Application

Once deployed, obtain the external IP (load balancer) of the frontend service:
```bash
kubectl get svc frontend-service
```

