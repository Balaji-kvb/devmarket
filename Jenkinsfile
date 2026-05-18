pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_IMAGE = 'devmarket-app'
        DOCKER_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing NPM dependencies...'
                sh 'npm ci'
            }
        }

        stage('Lint & Type Check') {
            steps {
                echo 'Running ESLint and TypeScript checks...'
                sh 'npm run lint'
                sh 'npx tsc --noEmit'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Executing Vitest test suite...'
                sh 'npm run test'
            }
        }

        stage('Build Production App') {
            steps {
                echo 'Building Next.js standalone application...'
                // Using a dummy NEXTAUTH_SECRET for build time since it is required for Next.js 15
                sh 'NEXTAUTH_SECRET=build-secret npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest -f docker/Dockerfile ."
            }
        }

        stage('Docker Compose Validation') {
            steps {
                echo 'Validating Docker Compose configuration...'
                sh 'docker-compose -f docker/docker-compose.yml config'
            }
        }

        stage('Deployment Simulation') {
            steps {
                echo 'Simulating production deployment...'
                // In a real scenario, this would push to ECR/DockerHub and trigger a remote update
                echo "Deploying ${DOCKER_IMAGE}:${DOCKER_TAG} to staging environment..."
                sh 'echo "Deployment successful!"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            // slackSend channel: '#deployments', message: "SUCCESS: DevMarket Build #${env.BUILD_NUMBER}"
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
            // slackSend channel: '#alerts', message: "FAILED: DevMarket Build #${env.BUILD_NUMBER}"
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
