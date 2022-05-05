require('dotenv').config();
var cors = require('cors');
var bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const Question = require('../models/question_model');
const Answer = require('../models/answer_model');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const submitCompile = async (req, res) => {
    const { user_id, content, question_id, qid, language } = req.body;
    let answer = await Answer.getQuestionAnswer(qid);
    let formalAnswer;

    if (language == 'javascript') {
        console.log('answer', answer);
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
        console.log('answer final', formalAnswer, ans);
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
        let codingAnswer = await Answer.submitCodeAnswer(user_id, question_id, qid, language, reply, content);
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
            let codingAnswer = await Answer.submitCodeAnswer(user_id, question_id, qid, language, reply, content);
            res.status(200).send(reply);
        }
    }
};

const submitVideo = async (req, res) => {
    const { user_id, question_id, videoAnswer, checked } = req.body;

    let codingAnswer = await Answer.insertVideoAnswer(user_id, question_id, videoAnswer, checked);
    console.log('codingAnswer', codingAnswer);
    res.status(200).send(codingAnswer);
};

// get s3 upload url
const storeVideoAnswerUrl = async (req, res) => {
    AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_ACCESS_PASSWORD, region: 'ap-northeast-1', signatureVersion: 'v4' });

    const s3 = new AWS.S3();
    // Tried with and without this. Since s3 is not region-specific, I don't
    // think it should be necessary.
    // AWS.config.update({region: 'us-west-2'})
    // AWS.config.update({ region: 'ap-northeast-1', AWS_SDK_LOAD_CONFIG: 1 });
    const myBucket = 'interview-appworks';
    const myKey = 'filename';
    const signedUrlExpireSeconds = 600 * 5;

    s3.getSignedUrl(
        'putObject',
        {
            Bucket: myBucket,
            Key: req.query.filename,
            Expires: signedUrlExpireSeconds,
            ContentType: 'video/webm',
        },
        function (err, url) {
            console.log(err);
            console.log(url);
            return res.status(200).send(url);
        }
    );
};

const runCompile = async (req, res) => {
    const { content, question_id, language } = req.body;
    console.log('runCompile', content, question_id, language);
    let answer = await Answer.getQuestionAnswer(question_id);

    let formalAnswer;
    try {
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
                    input: answer['test_answer'],
                    output: ans,
                    except: formalAnswer,
                };

                res.status(200).send(reply);
            } else {
                let reply = {
                    answer_status: -1,
                    input: answer['test_answer'],
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
                    input: answer['test_answer'],
                    output: ans,
                    except: formalAnswer,
                };

                res.status(200).send(reply);
            } else {
                let reply = {
                    answer_status: -1,
                    input: answer['test_answer'],
                    output: ans,
                    except: formalAnswer,
                };
                res.status(200).send(reply);
            }
        }
    } catch (error) {
        res.status(500).send({ error: 'Server Something wrong' });
    }
};

const getTraining = async (req, res) => {
    let { user_id } = req.query;
    let allTraining = await Answer.getAllTraining(user_id);

    console.log('allTraining', allTraining);
    return res.status(200).send(allTraining);
};

const getTrainingRecords = async (req, res) => {
    let { user_id, identity } = req.query;
    let allTraining;
    if (identity === 'student') {
        allTraining = await Answer.getAllTraining(user_id);
    }
    if (identity === 'teacher') {
        allTraining = await Answer.getTutorTrainingRecords(user_id);
    }
    console.log('allTraining', allTraining);
    return res.status(200).send(allTraining);
};

const getQuestionsByProfession = async (req, res) => {
    let { profession } = req.query;
    let questions = await Question.getCodeQuestions(profession);

    let allQuestions = questions.questions[0];

    return res.status(200).send(allQuestions);
};

const getVideoQuestionsByProfession = async (req, res) => {
    let { profession } = req.query;
    let questions = await Question.getVideoQuestions(profession);

    let allQuestions = questions.questions[0];

    return res.status(200).send(allQuestions);
};

const addLogicQuestion = async (req, res) => {
    let { title, description, answer } = req.body.data;
    let question = await Question.insertLogicQuestion(title, description, answer);
    return res.status(200).send(question);
};

const storeVideoAnswer = async (req, res) => {
    let { userID, question_id, video_answer } = req.body.data;
    let answer = await Answer.insertVideoAnswer(userID, question_id, video_answer);
    return res.status(200).send(answer);
};

const getProfileQuestions = async (req, res) => {
    let { userID, profession } = req.query;
    console.log('userID', userID, profession);
    if (!userID || userID == undefined || !profession || profession == undefined) {
        return res.status(400).send({ error: "Can't find profession or userid" });
    }

    let checkProfileQuestions = await Question.checkProfileQuestions(userID);

    console.log('checkProfileQuestions', checkProfileQuestions);
    if (checkProfileQuestions.length > 0) {
        return res.status(200).send(checkProfileQuestions[0]);
    }
    console.log('generate question');
    let profileQuestions = {
        user_id: userID,
        status: 0,
        profesiion: profession,
        percent: {
            video: 0,
            code: 0,
            logic: 0,
        },
        create_dt: new Date(),
        video: [],
        code: [],
        logic: [],
    };
    let videoQuestions = await Question.getVideoQuestions(profession);
    console.log('videoQuestions', videoQuestions);
    let codeQuestions = await Question.getCodeQuestions(profession);
    if (videoQuestions.questions[0].length < 1) {
        return res.status(400).send({ error: 'wrong profession' });
    }
    videoQuestions.questions[0].map((e) => {
        let check = [];
        check.push(e.hint_1);
        check.push(e.hint_2);
        check.push(e.hint_3);
        profileQuestions.video.push({
            qid: e.id,
            title: e.title,
            description: e.description,
            video_url: e.video,
            status: 0,
            check: check,
            checked: [],
        });
    });
    codeQuestions.questions[0].map((e) => {
        console.log(e);
        profileQuestions.code.push({
            qid: e.id,
            title: e.title,
            description: e.description,
            javascript_question: e.javascript,
            python_question: e.python,
            status: 0,
            checked: [],
            status: 0,
        });
    });

    await Question.insertProfileTraining(profileQuestions);
    console.log('profileQuestions', profileQuestions);
    return res.status(200).send(profileQuestions);
};

async function submitVideoAnswer(req, res) {
    const { user_id, question_id, qid, answer_url } = req.body;
    console.log('submitVideoAnswer', user_id, question_id, qid, answer_url);
    let afterSubmit = await Answer.submitVideoAnswer(user_id, question_id, qid, answer_url);
    return res.status(200).send(afterSubmit);
}

async function submitCodeAnswer(req, res) {
    const { user_id, question_id, qid, answer_url } = req.body;
    console.log('submitVideoAnswer', user_id, question_id, qid, answer_url);
    let afterSubmit = await Answer.submitVideoAnswer(user_id, question_id, qid, answer_url);
    return res.status(200).send(afterSubmit);
}

async function submitVideoAnswerCheck(req, res) {
    const { user_id, question_id, qid, checked } = req.body;
    console.log('submitVideoAnswer', user_id, question_id, qid, checked);
    let afterSubmit = await Answer.submitVideoAnswerCheck(user_id, question_id, qid, checked);
    return res.status(200).send(afterSubmit);
}

module.exports = {
    addLogicQuestion,
    getQuestionsByProfession,
    storeVideoAnswer,
    submitCompile,
    getTraining,
    runCompile,
    getVideoQuestionsByProfession,
    submitVideo,
    getProfileQuestions,
    storeVideoAnswerUrl,
    submitVideoAnswer,
    getTrainingRecords,
    submitVideoAnswerCheck,
};
