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
        stage('Cleanup Server') {
            steps {
                script {
                    sh """
                        docker container prune -f
                        docker image prune -a -f
                        docker volume prune -f
                        docker network prune -f

                        find /var/log/jenkins/ -type f -name '*.log' -delete
                        find /var/lib/jenkins/jobs/ -type d -name "builds" -exec find {} -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +11 | xargs rm -rf \;
                    """
                }
            }
        }

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

        stage('Building Frontend image') {
            steps {
                script {
                    frontendImage = docker.build("${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG}", "--no-cache -f Frontend/Dockerfile ./Frontend")
                }
            }
        }

        stage('Building Backend image') {
            steps {
                script {
                    backendImage = docker.build("${BACKEND_IMAGE_NAME}:${BACKEND_IMAGE_TAG}", "--no-cache -f Backend/Dockerfile ./Backend")
                }
            }
        }

        stage('Pushing Frontend to ECR') {
            steps {
                script {
                    sh "docker tag ${FRONTEND_IMAGE_NAME}:${FRONTEND_IMAGE_TAG} ${REPOSITORY_URI_FRONTEND}:${FRONTEND_IMAGE_TAG}"
                    sh "docker push ${REPOSITORY_URI_FRONTEND}:${FRONTEND_IMAGE_TAG}"
                }
            }
        }

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

