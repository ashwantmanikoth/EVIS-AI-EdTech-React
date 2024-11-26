pipeline { 
  agent any 
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
