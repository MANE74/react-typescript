pipeline {
  agent none
  environment {
    HOME="${WORKSPACE}"
  }
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '2'))
  }
  stages {
    stage("Dockerfile") {
      agent {
        dockerfile true
      }
      stages {
        stage("Install") {
          steps {
            sh """
              npm install
            """
          }
        }
        stage("Build dev") {
          when {
            not {
              branch pattern: "(master|release.*)", comparator: "REGEXP"
            }
          }
          steps {
            script {
              sh """
                  CI=false npm run build
              """
            }
          }
        }
        stage("Deploy on dev server") {
          when {
            branch 'develop'
          }
          steps {
            withCredentials([file(credentialsId: 'DevAnsibleVaultPassFile', variable: 'FILE')]) {
              sh """
                  cd Ansible
                  ansible-playbook webapp-deploy.yml -i hosts.yml --extra-vars host=dev --vault-password-file=$FILE
              """
            }
          }
        }
        stage("Artifact") {
          when {
            branch pattern: "(master|develop|release.*)", comparator: "REGEXP"
          }
          steps {
            archiveArtifacts artifacts: 'build/**/*', fingerprint: true
          }
        }
        stage("Clean up workspace") {
          when {
            not {
              branch pattern: "(master|develop|release.*)", comparator: "REGEXP"
            }
          }
          steps {
            deleteDir()
          }
        }
      }
    }
  }
}
