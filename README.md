![Interview Training System](/logo.png){ width="800" height="600" style="display: block; margin: 0 auto" }


# Interview Training System - 面面

A system that provides a situational interview that helps interviewees master key interviewing skills. 
There are 3 main features: situational simulation, tutor matching platform and social platform.

## Pain point and solution
Preparing for an interview is hard for newbies. In order to give interviewers more opportunities to improve their performance during the interview, this interview training system was developed.

![interview training Pain point and solution](https://imgur.com/oHeKXX0.png)

## 🚀 Test Accounts
Website URL: https://wooah.app/

- Student1
    - Email: ooii8929@gmail.com
    - Password: 123123

- Student2
    - Email: gold@gmail.com
    - Password: 123123

- Tutor1
    - Email: lai@gmail.com
    - Password: 123123

![test](https://interview-appworks.s3.ap-northeast-1.amazonaws.com/Screen+Shot+2022-05-27+at+1.22.43+PM.png)

## Table of Contents

- Architecture
- Database Schema
- Features
- Technologies
- Loading Test
- Race Condition Cases
- Contact




## Database Schema
![Database Schema](https://imgur.com/OlGVdzF.png)

## Technologies

- Back-End
    - Node.js
    - Express.js
- Front-End
    - HTML
    - CSS
    - JavaScript
    - React.js
- Database
    - MySQL
    - MongoDB
- Framework
    - MVC design pattern

- AWS Cloud Services
    - Elastic Compute Cloud (EC2)
    - Relational Database Service (RDS)
    - Simple Storage Service (S3)

- Networking
    - NGINX
    - Socket.IO
    
- Test
    - Mocha
    - Chai


# interview-training
Appworks school self-project

# Code Training
## Support
We support javescript, python, and go language.

## Init
You need to deploy a python image and a js image of docker to run coding trainging.

```
cd server/util/code-training
docker build -t python-image -f python-dockerfile .
docker build -t node-image -f node-dockerfile .
```

After finished it, you can use the follow command to try if it's successful.

```
./build-python.sh
./build-javascript.sh
```

You don't need to build go language image, because it is compiling language which need its environment. 
So we use build-go.sh to run the go question.

```
cd server/env-build
./build.sh
```


## Authors

- [Author: Alvin Lin](https://www.linkedin.com/in/alvin331/)
- [Mail: ooii8929@gmail.com](mailto:ooii8929@gmail.com)
