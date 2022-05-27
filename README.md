![Interview Training System](/logo.png)


# Interview Training System - 面面

A system that provides a situational interview that helps interviewees master key interviewing skills. 
There are 3 main features: situational simulation, tutor matching platform and social platform.

## Table of Contents

- [Pain Point and Solution](#pain-point-and-solution)
- [Test Accounts](#test-accounts)
- [Feature 1 : Online Programming Platform](#feature-1-:-online-programming-platform)
  - [User Flow](#user-flow)
  - [Technologies](#technologies)
  - [Installation](#installation)
- [Feature 2 : Online Mock Interview](#feature-2-:-online-mock-interview)
  - [User Flow](#user-content-user-flow-1)
  - [Technologies](#user-content-technologies-1)
- [Feature 3 : Online Tutor and Match Platform](#feature-3-:-online-tutor-and-match-platform)
  - [User Flow](#user-content-user-flow-2)
  - [Technologies](#user-content-technologies-2)
- [Feature 4 : Interviewee Social Platform](#feature-4-:-interviewee-social-platform)
  - [User Flow](#user-content-user-flow-3)
  - [Technologies](#user-content-technologies-3)
- [Database Schema](#database-schema)
- [Technologies](#user-content-technologies-4)
- [Future Work](#future-work)
- [Author](#author)


## Pain Point and Solution
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

## Feature 1 : Online Programming Platform
![test gif](https://imgur.com/I2hMPqU.gif)

### Architect & Technologies
![programming platform](https://i.imgur.com/kd8o8E5.jpg)

- Use Docker to run the different languages.
  - Deploy a python image and a JavaScript image.
    ```
    cd server/util/code-training
    docker build -t python-image -f python-dockerfile .
    docker build -t node-image -f node-dockerfile .
    ```

    ```
    ./build-python.sh
    ./build-javascript.sh
    ```

  - Go Language is maintain
    ```
    cd server/env-build
    ./build.sh
    ```

- Set Docker Runtime options to distribute server resources.
- Store answer to MongDB which can burden heavy write scenarios.

### Support Language
We support javescript and python language.


## Feature 2 : Online Mock Interview
![test gif](https://imgur.com/5aCSlcJ.gif)

### Architect & Technologies
![programming platform](https://imgur.com/5HuPYPi.jpg)

## Feature 3 : Online Tutor and Match Platform

### Architect & Technologies
![programming platform](https://imgur.com/GH95gm1.jpg)

## Feature 4 : Interviewee Social Platform


### Architect & Technologies
![programming platform](https://imgur.com/b2EjPw2.jpg)


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



## 🚀 Future Work

### Feature
Emotion AI

### Architect
Transform Docker into lambda to reduce server load



## Author

- [Author: Alvin Lin](https://www.linkedin.com/in/alvin331/)
- [Mail: ooii8929@gmail.com](mailto:ooii8929@gmail.com)
