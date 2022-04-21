require('dotenv').config();
var cors = require('cors');
var bodyParser = require('body-parser');

const Question = require('../models/question_model');
const Answer = require('../models/answer_model');
const fs = require('fs');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const submitCompile = async (req, res) => {
    const { content, question_id, language } = req.body;
    let answer = await Answer.getQuestionAnswer(question_id);
    let formalAnswer;

    if (language == 'javascript') {
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

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
            formalAnswer = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

        var time;

        try {
            var startTime = performance.now();
            var { stdout, userStderr } = await exec('./server/util/code-training/build-javascript.sh');
            var endTime = performance.now();
            time = endTime - startTime;
            ans = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

        let reply;
        if (formalAnswer == ans) {
            reply = {
                answer_status: 1,
                input: answer['test_answer'],
                output: ans,
                except: formalAnswer,
                run_time: time,
                language: req.body.language,
            };
        } else {
            reply = {
                answer_status: -1,
                input: answer['test_answer'],
                output: ans,
                except: formalAnswer,
            };
        }
        let codingAnswer = await Answer.insertCodeAnswer(req.body.user_id, req.body.question_id, reply, contenta);
        console.log('codingAnswer', codingAnswer);
        res.status(200).send(reply);
    } else if (language == 'python') {
        console.log('submit python');
        // get default answer from db
        let contenta = content + `\nprint(Solution().${answer['call_user_answer']}(${answer['test_answer']}))`;
        let formalAnswerContent = answer['formal_answer'] + `${answer['call_user_answer']}(${answer['test_answer']}))`;

        // use js to test the answer
        await fs.writeFile('./server/util/code-training/test.js', formalAnswerContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        // put user code
        await fs.writeFile('./server/util/code-training/test.py', contenta, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
            formalAnswer = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-python.sh');
            ans = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

        let reply;
        if (formalAnswer == ans) {
            reply = {
                answer_status: 1,
                input: answer['run_code_question'],
                output: ans,
                except: formalAnswer,
            };

            res.status(200).send(reply);
        } else {
            reply = {
                answer_status: -1,
                input: answer['run_code_question'],
                output: ans,
                except: formalAnswer,
            };
            let codingAnswer = await Answer.insertCodeAnswer(req.body.user_id, req.body.question_id, reply, contenta);
            res.status(200).send(reply);
        }
    }
};

const runCompile = async (req, res) => {
    const { content, question_id, language } = req.body;
    let answer = await Answer.getQuestionAnswer(question_id);

    let formalAnswer;

    // condition language
    if (language == 'javascript') {
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

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
            formalAnswer = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-javascript.sh');
            ans = `${stdout}`;
        } catch (err) {
            return res.status(200).send(err);
        }

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
    } else if (language == 'python') {
        console.log('run python');
        // get default answer from db
        let contenta = content + `\nprint(Solution().${answer['call_user_answer']}(${answer['test_answer']}))`;
        let formalAnswerContent = answer['formal_answer'] + `${answer['call_user_answer']}(${answer['test_answer']}))`;

        // use js to test the answer
        await fs.writeFile('./server/util/code-training/test.js', formalAnswerContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        // put user code
        await fs.writeFile('./server/util/code-training/test.py', contenta, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-javascript-answer.sh');
            formalAnswer = `${stdout}`;
        } catch (err) {
            res.status(200).send(err);
        }

        try {
            var { stdout, stderr } = await exec('./server/util/code-training/build-python.sh');
            ans = `${stdout}`;
        } catch (err) {
            res.status(200).send(err);
        }

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
    getQuestionsByProfession,
    storeVideoAnswer,
    submitCompile,
    runCompile,
};
