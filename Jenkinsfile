pipeline { 
  agent any 
  tools {
        nodejs "NodeJS_16" // Replace with the Node.js version configured in Jenkins
    }
    environment {
        // Set environment variables if needed
        NODE_ENV = 'production' // Adjust as per your requirement
    }
  stages {
    stage("Install dependencies") {
      steps {
        echo 'Installing dependencies'
        sh 'npm install' 
      }
    }
    stage("Build") {
      steps {
        echo 'Building the application'
        sh 'npm run build' 
      }
    }
    stage("Test") {
      steps {
        echo 'Testing the application'
        
      }
    }
    stage("Deploy") {
      steps {
        echo 'Deploying the application'
       
      }
    }
  }
}
