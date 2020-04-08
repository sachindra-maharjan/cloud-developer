# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

## Submission

### Endpoints

`http://image-filter-ms-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg`

`http://image-filter-ms-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074__340.jpg`

'http://image-filter-ms-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url='

### Build Commands

```
npm run build
```

### Deployment Commands

```
eb init
eb create
eb deploy
```

### Screenshots

<image src="images/image-filter-ms-dev.png" />
