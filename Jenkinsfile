pipeline {
    agent any
    options {
        // Enables to restart only failed stages
        skipDefaultCheckout(true)
        preserveStashes()
    }
    environment {
        NODE_ENV = 'production'
    }
    tools {
        nodejs "NodeJS_16" // Replace with your Node.js installation
    }
    stages {
        stage("Install Dependencies") {
            when {
                not { stageResult 'Install Dependencies' succeeded } // Rerun only if failed
            }
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci' // `npm ci` is faster for clean installs
                stash includes: 'node_modules/**/*', name: 'node_modules'
            }
        }
        stage("Build") {
            when {
                not { stageResult 'Build' succeeded } // Rerun only if failed
            }
            steps {
                echo 'Building the application...'
                unstash 'node_modules' // Reuse stashed dependencies
                sh 'npm run build'
            }
        }
        stage("Test") {
            when {
                not { stageResult 'Test' succeeded } // Rerun only if failed
            }
            steps {
                echo 'Testing the application...'
                unstash 'node_modules' // Reuse stashed dependencies
                sh 'npm test'
            }
        }
        stage("Deploy") {
            when {
                not { stageResult 'Deploy' succeeded } // Rerun only if failed
            }
            steps {
                echo 'Deploying the application...'
                sh 'npm run deploy'
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
