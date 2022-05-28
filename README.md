![Interview Training System](https://imgur.com/VQs7ffO.jpg)


# Interview Training System - 面面
Website URL: https://wooah.app/

A system that provides a situational interview that helps interviewees master key interviewing skills. 
There are 3 main features: situational simulation, tutor matching platform and social platform.

## Table of Contents


- [Test Accounts](#test-accounts)
- [Feature 1 : Online Programming Platform](#user-content-feature-1--online-programming-platform)
  - [User Flow](#user-flow)
  - [Technologies](#technologies)
  - [Installation](#installation)
- [Feature 2 : Online Mock Interview](#user-content-feature-2--online-mock-interview)
  - [User Flow](#user-content-user-flow-1)
  - [Technologies](#user-content-technologies-1)
- [Feature 3 : Online Tutor and Match Platform](#user-content-feature-3--online-tutor-and-match-platform)
  - [User Flow](#user-content-user-flow-2)
  - [Technologies](#user-content-technologies-2)
- [Feature 4 : Interviewee Social Platform](#user-content-feature-4--interviewee-social-platform)
  - [User Flow](#user-content-user-flow-3)
  - [Technologies](#user-content-technologies-3)
- [Database Schema](#database-schema)
- [Technologies](#user-content-technologies-4)
- [Future Work](#future-work)
- [Author](#author)


## 🚀 Test Accounts
- Student1
    - Email: ooii8929@gmail.com
    - Password: 123123

- Student2
    - Email: gold@gmail.com
    - Password: 123123

- Tutor1
    - Email: lai@gmail.com
    - Password: 123123

## Architect Overview
![](https://imgur.com/dk8Yvwu.jpg)

## Feature 1 : Online Programming Platform
This feature supply an mock online coding area which you can mock you are ask question. 
![test gif](https://imgur.com/I2hMPqU.gif)

### Architect & Technologies
![programming platform](https://imgur.com/sRHSjhz.jpg)

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
Provides a mock interview environment which record interviewee's performance and provides key points to interviewee to practice interviews.
![test gif](https://imgur.com/LljUi6R.gif)

### Architect & Technologies
![programming platform](https://imgur.com/RfsF4Zb.jpg)

## Feature 3 : Online Tutor and Match Platform
Interviewees can find experienced tutors here and takes online classes.
![](https://imgur.com/LljUi6R.gif)

### Architect & Technologies
![programming platform](https://imgur.com/nxRloD8.jpg)

## Feature 4 : Interviewee Social Platform
We provide a social platform where interviewers can ask interview-related questions

### Architect & Technologies
![programming platform](https://imgur.com/tH8MK5d.jpg)


## Database Schema
![Database Schema](https://imgur.com/OlGVdzF.png)

## Technologies

- Back-End
    - Node.js
    - Express.js  
    <br />
- Front-End
    - HTML
    - CSS
    - JavaScript
    - React.js  
    <br />
- Database
    - MySQL
    - MongoDB  
    <br />
- Framework
    - MVC design pattern  
    <br />
- AWS Cloud Services
    - Elastic Compute Cloud (EC2)
    - Relational Database Service (RDS)
    - Simple Storage Service (S3)  
    <br />
- Networking
    - NGINX
    - Socket.IO  
    <br />
- Test
    - Mocha
    - Chai



## 🚀 Future Work

- Use emotion AI to recommend related question in real time
- Transform Docker into lambda to reduce server load



## Author

- [Author: Alvin Lin](https://www.linkedin.com/in/alvin331/)
- [Mail: ooii8929@gmail.com](mailto:ooii8929@gmail.com)
