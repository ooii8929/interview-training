![Interview Training System](https://imgur.com/VQs7ffO.jpg)


# Interview Training System - 面面
Website URL: https://wooah.app/

A system that provides a situational interview that helps interviewees master key interviewing skills. 
There are 3 main features: situational simulation, tutor matching platform and social platform.

## Table of Contents


- [Test Accounts](#test-accounts)
- [Architect Overview](#architect-overview)
- [Feature 1 : Online Programming Platform](#user-content-feature-1--online-programming-platform)
  - [Technologies](#user-content-architect--technologies)
  - [Note](#note)
- [Feature 2 : Online Mock Interview](#user-content-feature-2--online-mock-interview)
  - [Technologies](#user-content-technologies-1)
- [Feature 3 : Online Tutor and Match Platform](#user-content-feature-3--online-tutor-and-match-platform)
  - [Technologies](#user-content-architect--technologies-2)
- [Feature 4 : Interviewee Social Platform](#user-content-feature-4--interviewee-social-platform)
  - [Technologies](#user-content-architect--technologies-3)
- [Database Schema](#database-schema)
- [Technologies](#user-content-technologies-4)
- [Future Work](#future-work)
- [Author](#author)


## Test Accounts
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
The purpose of this feature is to simulate a coding interview scenario.
    <br />
    
https://user-images.githubusercontent.com/27533338/170912947-8ed5d609-ceca-4a2f-a237-7c5837c7dc0f.mp4


### Architect & Technologies
![programming platform](https://imgur.com/sRHSjhz.jpg)

### Note
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

- To avoid the server loading too heavy due to Docker operation, set runtime options with memory and CPUs.
    ```
    --cpus=".1" --memory="20m"
    ```

- To avoid malicious damage to the server, set ulimit option
    ```
    --ulimit cpu=1
    ```

- The execution file is temporary and will be deleted automatically after the answer is returned.

- To handle write-heavy scenarios, store answers in MongoDB.

- The system supports javescript and python language now.

## Feature 2 : Online Mock Interview
Provides a mock interview environment that records the interviewee's performance and provides critical points for the interviewee to practice interviews.  
    <br />
https://user-images.githubusercontent.com/27533338/170912969-a40093bb-fd19-494a-974a-0b007744a732.mp4




### Architect & Technologies
![programming platform](https://imgur.com/RfsF4Zb.jpg)

## Feature 3 : Online Tutor and Match Platform

You can learn online from experienced people here.
    <br />
https://user-images.githubusercontent.com/27533338/170912989-1ace7b0a-db1a-47a5-86e3-a62ca6689faf.mp4



### Architect & Technologies
![programming platform](https://imgur.com/nxRloD8.jpg)

Note

1. The two sides of the call exchange IP through the server we provide.


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
    - Amazon CloudWatch
    - AWS Lambda
    - Amazon EventBridge
    - Amazon ElastiCache
    <br />
- Networking
    - NGINX
    - Socket.IO  
    <br />
- Test
    - Mocha
    - Chai
- Other
    - Docker



## Future Work

- Use emotion AI to recommend related questions in real-time.
- Transform Docker into lambda to reduce server load.
- Implement Turn server in webRTC to increase connection stability.
- 


## Author

- [Author: Alvin Lin](https://www.linkedin.com/in/alvin331/)
- [Mail: ooii8929@gmail.com](mailto:ooii8929@gmail.com)
