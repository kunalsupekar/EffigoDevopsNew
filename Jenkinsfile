pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "682033462333"
        AWS_DEFAULT_REGION = "ap-south-1"
        
        FRONTEND_IMAGE_NAME = "effigodevopsfrontend" 
        BACKEND_IMAGE_NAME = "effigodevops"           

        FRONTEND_IMAGE_TAG = "frontend-latest"
        BACKEND_IMAGE_TAG = "backend-latest"

        REPOSITORY_URI_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${FRONTEND_IMAGE_NAME}"
        REPOSITORY_URI_BACKEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${BACKEND_IMAGE_NAME}"
    }

    stages {
        
        // Cleanup old Docker images and logs
        stage('Cleanup') {
            steps {
                script {
                    // Remove old frontend image
                    sh """
                        docker rmi -f ${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG} || true
                        docker rmi -f ${REPOSITORY_URI_FRONTEND}:${FRONTEND_IMAGE_TAG} || true
                    """
                    
                    // Remove old backend image
                    sh """
                        docker rmi -f ${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG} || true
                        docker rmi -f ${REPOSITORY_URI_BACKEND}:${BACKEND_IMAGE_TAG} || true
                    """
                    
                    // Clear old Jenkins logs (optional)
                    sh """
                        find /var/log/jenkins/ -type f -name '*.log' -exec rm -f {} +
                    """
                }
            }
        }

        // Login to AWS ECR
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | \
                        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com
                    """
                }
            }
        }

        // Cloning the Git repository
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/master']],  
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[url: 'https://github.com/kunalsupekar/EffigoDevopsNew.git']]] )
            }
        }

        // Building Frontend Docker image
        stage('Building Frontend image') {
            steps {
                script {
                    frontendImage = docker.build("${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG}", "--no-cache -f Frontend/Dockerfile ./Frontend")
                }
            }
        }

        // Building Backend Docker image
        stage('Building Backend image') {
            steps {
                script {
                    backendImage = docker.build("${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG}", "--no-cache -f Backend/Dockerfile ./Backend")
                }
            }
        }

        // Pushing Frontend image to ECR
        stage('Pushing Frontend to ECR') {
            steps {
                script {
                    sh "docker tag ${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG} ${REPOSITORY_URI_FRONTEND}:${FRONTEND_IMAGE_TAG}"
                    sh "docker push ${REPOSITORY_URI_FRONTEND}:${FRONTEND_IMAGE_TAG}"
                }
            }
        }

        // Pushing Backend image to ECR
        stage('Pushing Backend to ECR') {
            steps {
                script {
                    sh "docker tag ${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG} ${REPOSITORY_URI_BACKEND}:${BACKEND_IMAGE_TAG}"
                    sh "docker push ${REPOSITORY_URI_BACKEND}:${BACKEND_IMAGE_TAG}"
                }
            }
        }
    }
}
