pipeline {
    agent any
    options {
        skipDefaultCheckout(true) // Avoid unnecessary checkouts
        preserveStashes()         // Keep stashed files for reuse
    }
    environment {
        NODE_ENV = 'production'
    }
    tools {
        nodejs "NodeJS_16" // Replace with your configured NodeJS tool
    }
    stages {
        stage("Install Dependencies") {
            steps {
                script {
                    try {
                        unstash 'node_modules' // Attempt to unstash cached dependencies
                        echo 'Reusing cached dependencies...'
                    } catch (Exception e) {
                        echo 'Installing dependencies...'
                        sh 'npm ci'
                        stash includes: 'node_modules/**/*', name: 'node_modules'
                    }
                }
            }
        }
        stage("Build") {
            steps {
                echo 'Building the application...'
                unstash 'node_modules'
                sh 'npm run build'
            }
        }
        stage("Test") {
            steps {
                echo 'Testing the application...'
                unstash 'node_modules'
                sh 'npm test'
            }
        }
        stage("Deploy") {
            steps {
                echo 'Deploying the application...'
                unstash 'node_modules'
                sh 'npm run deploy'
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
