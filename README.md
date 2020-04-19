# About the Project - Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice. Following are the services involved in this project:

- “user” - allows users to register and log into a web client,
- “feed” - allows users to post photos, and process photos using image filtering
- “frontend” - acts as an interface between the user and the backend-services
- "reverseproxy" - For resolving multiple services running on same port in separate containers

Correspondingly, the project is split into following parts:

1. The RestAPI Feed Backend, a Node-Express feed microservice.
1. The RestAPI User Backend, a Node-Express user microservice.
1. The Simple Frontend - A basic Ionic client web application which consumes the RestAPI Backend.
1. Nginx as a reverse-proxy server, when different backend services are running on the same port, then a reverse proxy server directs client requests to the appropriate backend server and retrieves resources on behalf of the client.

## Clone the project GitHub repository

Create a project folder in your local computer and clone the following Git repository - https://github.com/sachindramaharjan/cloud-developer.git

## Dependencies and Getting Setup

> _tip_: this frontend is designed to work with the RestAPI backends. It is recommended you stand up the backend first, test using Postman, and then the frontend should integrate.

### 1. Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/). Verify the installation of Node.js using following command in your "terminal" / "cmd":

```
node -v
```

Verify the installation of NPM and update:

```
npm -v
npm update
```

#### How to Install project dependencies using NPM

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:

```bash
npm install
```

> _tip_: **npm i** is shorthand for **npm install**

### 2. Installing Ionic Cli

The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli). When we would configure and start the backend services, then the frontend server can be started using following command in the terminal:

```bash
ionic serve
```

### 3. AWS RDS - PostgreSQL instance, Postbird tool, and an S3 bucket

You'll need an AWS account to set up these resources.

- Create the [PostgreSQL instance on AWS]
- Install the [Postbird tool](https://github.com/Paxa/postbird) to interact remotely with the database.
- Create an S3 filestore bucket in AWS

### 4. Docker Desktop

Install Docker Desktop to create containers for individual microservices. Refer the following links for instructions

- [macOS](https://docs.docker.com/docker-for-mac/install/),
- [Windows 10 64-bit: Pro, Enterprise, or Education](https://docs.docker.com/docker-for-windows/install/),
- [Windows 10 64-bit Home](https://docs.docker.com/toolbox/toolbox_install_windows/).
- You can find installation instructions for other operating systems at: https://docs.docker.com/install/
- For more on docker and docker compose, check out this link: https://github.com/sachindramaharjan/cloud-developer/tree/feature/microservice/course-02/exercises/udacity-deployment/docker

Commands to build all images using docker compose

```
docker-compose -f course-02/exercises/udacity-deployment/docker/docker-compose-build.yaml build

```

### 5. Kubernetes

Please follow the below link to learn about Kubernetes:
https://github.com/sachindramaharjan/cloud-developer/tree/feature/microservice/course-02/exercises/udacity-deployment/k8s

#### Install kubectl

Download the latest release with the command:

```

curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

```

To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.
For example, to download version v1.18.0 on Linux, type:

`curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/linux/amd64/kubectl`

Make the kubectl binary executable.

`chmod +x ./kubectl`

Move the binary in to your PATH.

`sudo mv ./kubectl /usr/local/bin/kubectl`

Test to ensure the version you installed is up-to-date:

`kubectl version --client`

#### Install minicube

Install via diect download

`curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube'

Add the Minikube executable to your path:

```

sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/

```

Confirm installation

`minikube start`

Once minikube start finishes, run the command below to check the status of the cluster:

`minikube status`

If your cluster is running, the output from minikube status should be similar to:

```

host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured

```

### 6. Travis CI

Sign-up on Travis-ci.com using your GitHub account credentials and then create a `.travis.yml` for your project. [Refer this tutorial to get started with Travis CI](https://docs.travis-ci.com/user/tutorial/).

```

llanguage: minimal

services: docker

env:
  - DOCKER_COMPOSE_VERSION=1.25.4

before_install:
  - sudo rm /usr/local/bin/docker-compose
  - curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
  - chmod +x docker-compose
  - sudo mv docker-compose /usr/local/bin
  - curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.15.2/bin/linux/amd64/kubectl
  - chmod +x ./kubectl
  - sudo mv ./kubectl /usr/local/bin/kubectl
  - kubectl version --client
  - curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
  - sudo install minikube /usr/local/bin/
  - minikube start
  - minikube status
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/env-configMap.yaml
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/env-secret.yaml

install:
  - docker-compose -f course-02/exercises/udacity-deployment/docker/docker-compose-build.yaml build
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/frontend-deployment.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/frontend-service.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/udacity-restapi-feed-deployment.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/backend-feed-service.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/udacity-restapi-user-deployment.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/backend-user-service.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/reverseproxy-deployment.yaml --validate=false
  - kubectl apply -f course-02/exercises/udacity-deployment/k8s/reverseproxy-service.yaml --validate=false

script:
  - kubectl get pods
  - kubectl get svc


```
