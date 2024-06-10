# Ansible scripts for Cosafe web app

## Before running the scripts

1. Place vault password file `vault_password.txt` in this folder
2. Make web app build and have it in build folder

## Running on dev server

Deploying web app:

`ansible-playbook webapp-deploy.yml -i hosts.yml --extra-vars host=dev --vault-password-file=vault_password.txt`