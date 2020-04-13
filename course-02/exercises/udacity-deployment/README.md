## Docker Compose

<img scr="images/nginx.png">

Docker Compose allows us to run applications with multiple containers. We'll use a YAML file to configure all of the services we need, then run a single command, to create and start all of the services. Follow the instructions below to use Nginx and Docker Compose.

##Docker Compose Commands

`docker container ls`
`docker container kill <container_name>`
`docker container prune`

Build the images for each of our defined services, using the command:
`docker-compose -f docker-compose-build.yaml build --parallel`

To start the system, run a container for each of our defined services, in the attached mode:
`docker-compose up`

Alternatively, you may use detached mode to run containers in the background:
`docker-compose up -d`

To stop container gracefully
`docker-compose stop`

To remove (and stop) the container
`docker-compose down`
