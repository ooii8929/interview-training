require('dotenv').config();
var cors = require('cors');
var bodyParser = require('body-parser');

const Question = require('../models/question_model');
const Answer = require('../models/answer_model');
const fs = require('fs');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const goCompile = async (req, res) => {
    let ans;
    console.log('req.body', req.body);
    const content = req.body.content;
    console.log('content', content);
    await fs.writeFile('./server/env-build/app.go', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        //file written successfully
    });

    let cmd = './server/env-build/build.sh';

    await exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            ans = `${error.message}`;
            res.send(ans);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            ans = `${stderr}`;
            res.send(ans);
            return;
        }

        ans = `${stdout}`;
        console.log(`stdout: ${stdout}`);
        console.log('ans');

        console.log(ans);

        res.send(ans);
    });
};

const pythonCompile = async (req, res) => {
    let ans;
    console.log('req.body', req.body);
    const content = req.body.content;
    await fs.writeFile('test.py', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        //file written successfully
    });

    await exec('./server/util/code-training/build-python.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            ans = `${error.message}`;
            res.send(ans);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            ans = `${stderr}`;
            res.send(ans);
            return;
        }
        console.log(`${stdout}`);
        ans = `${stdout}`;
        console.log(`stdout: ${stdout}`);

        console.log(ans);

        res.status(200).send(ans);
    });
};

const submitCompile = async (req, res) => {
    let answer = await Answer.getQuestionAnswer(req.body.question_id);
    let formalAnswer;
    const content = req.body.content;
    let contenta = content + `console.log(${answer['call_user_answer']}(${answer['test_answer']}))`;
    let formalAnswerContent = answer['formal_answer'] + `console.log(${answer['call_user_answer']}(${answer['test_answer']}))`;

    await fs.writeFile('./server/util/code-training/answer.js', formalAnswerContent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    await fs.writeFile('./server/util/code-training/test.js', contenta, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
    formalAnswer = `${stdout}`;

    var { stdout, userStderr } = await exec('./server/util/code-training/build-javascript.sh');

    ans = `${stdout}`;

    console.log('check', formalAnswer, ans);
    if (formalAnswer == ans) {
        let reply = {
            answer_status: 1,
            input: answer['test_answer'],
            output: ans,
            except: formalAnswer,
        };
        let codingAnswer = await Answer.insertCodeAnswer(req.body.user_id, req.body.question_id, reply, contenta);
        console.log('codingAnswer', codingAnswer);
        res.status(200).send(reply);
    } else {
        let reply = {
            answer_status: -1,
            input: answer['test_answer'],
            output: ans,
            except: formalAnswer,
        };
        let codingAnswer = await Answer.insertCodeAnswer(req.body.user_id, req.body.question_id, reply, contenta);
        console.log('codingAnswer', codingAnswer);
        res.status(200).send(reply);
    }
};

const runCompile = async (req, res) => {
    let answer = await Answer.getQuestionAnswer(req.body.question_id);
    console.log('answer', answer);
    let formalAnswer;
    const content = req.body.content;
    let contenta = content + `console.log(${answer['call_user_answer']}(${answer['test_answer']}))`;
    let formalAnswerContent = answer['formal_answer'] + `console.log(${answer['call_user_answer']}(${answer['test_answer']}))`;

    await fs.writeFile('./server/util/code-training/answer.js', formalAnswerContent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    await fs.writeFile('./server/util/code-training/test.js', contenta, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
    formalAnswer = `${stdout}`;

    var { stdout, userStderr } = await exec('./server/util/code-training/build-javascript.sh');

    ans = `${stdout}`;

    if (formalAnswer == ans) {
        let reply = {
            answer_status: 1,
            input: answer['run_code_question'],
            output: ans,
            except: formalAnswer,
        };

        res.status(200).send(reply);
    } else {
        let reply = {
            answer_status: -1,
            input: answer['run_code_question'],
            output: ans,
            except: formalAnswer,
        };
        res.status(200).send(reply);
    }
};

const getQuestionsByProfession = async (req, res) => {
    let { profession } = req.query;
    let questions = await Question.getQuestions(profession);

    let allQuestions = questions.questions[0];
    // let tmpNum = [];
    // for (let i = 0; i < 3; i++) {
    //     tmpNum.push(allQuestions[getRandomInt(allQuestions.length)]);
    // }

    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    // }

    // console.log('tmpNum', tmpNum);

    return res.status(200).send(allQuestions);
};

const storeVideoAnswer = async (req, res) => {
    let { userID, question_id, video_answer } = req.body.data;
    let answer = await Answer.insertVideoAnswer(userID, question_id, video_answer);
    return res.status(200).send(answer);
};

module.exports = {
    goCompile,
    pythonCompile,
    getQuestionsByProfession,
    storeVideoAnswer,
    submitCompile,
    runCompile,
};
