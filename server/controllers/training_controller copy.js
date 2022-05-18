require('dotenv').config();
const AWS = require('aws-sdk');

const { v4: uuidv4 } = require('uuid');
const Question = require('../models/question_model');
const Answer = require('../models/answer_model');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getProfileQuestions = async (req, res) => {
  let { id } = req.locals;
  let { profession } = req.query;
  console.log('id', id, profession);
  if (!id || id == undefined || !profession || profession == undefined) {
    return res.status(400).send({ error: "Can't find profession or id" });
  }

  let checkProfileQuestions = await Question.checkProfileQuestions(id);

  if (checkProfileQuestions.length > 0) {
    return res.status(200).send(checkProfileQuestions[0]);
  }
  console.log('generate question');
  let profileQuestions = {
    user_id: id,
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

const submitCompile = async (req, res) => {
  const { user_id, content, question_id, qid, language } = req.body;
  let answer = await Answer.getQuestionAnswer(qid);
  let formalAnswer;

  if (language == 'javascript') {
    console.log('answer', answer);
    let contenta = content + `;\nconsole.log(${answer['call_user_answer']}(${answer['test_answer']}))`;
    let formalAnswerContent = answer['formal_answer'] + `;\nconsole.log(${answer['call_user_answer']}(${answer['test_answer']}))`;

    let specificNumber = uuidv4();

    /*--- Run Formal Answer ---*/

    await generateTemproaryFile(specificNumber, formalAnswerContent);

    try {
      formalAnswer = runTemproaryFileWithDocker(specificNumber);
      await fs.unlink(`./server/util/code-training/${specificNumber}-answer.js`, (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      await fs.unlink(`./server/util/code-training/${specificNumber}-answer.js`, (err) => {
        if (err) console.log(err);
      });
      return res.status(200).send(err);
    }

    /*--- Run User Answer ---*/

    var writeQuestionStream = await fs.createWriteStream(`./server/util/code-training/${specificNumber}-question.js`);
    await writeQuestionStream.write(contenta);
    await writeAnswerStream.end();

    // caculate run time
    var time;
    try {
      var startTime = performance.now();
      var { stdout, stderr } = await exec(`./server/util/code-training/build-javascript.sh ${specificNumber}-question.js`, {
        shell: '/bin/bash',
      });
      var endTime = performance.now();
      time = endTime - startTime;
      ans = `${stdout}`;
      await fs.unlink(`./server/util/code-training/${specificNumber}-question.js`, (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      await fs.unlink(`./server/util/code-training/${specificNumber}-answer.js`, (err) => {
        if (err) console.log(err);
      });
      console.log('run compile err', err);
      return res.status(200).send(err);
    }

    /////////////////////

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

    // insert answer to training
    let codingAnswer = await Answer.submitCodeAnswer(user_id, question_id, qid, language, reply, content);
    console.log('codingAnswer', codingAnswer);

    // insert answer to profile
    await Answer.insertCodeAnswer(user_id, qid, reply, content);

    // Get all code by qid
    let [checkQuestion] = await Answer.questionByQid(user_id, question_id);
    console.log('checkQuestion', checkQuestion);
    // check answer if finish
    let notFinishedQuestion = checkQuestion.code.filter((e) => {
      console.log('e', e);
      return e.status === 0;
    });
    console.log('3. 找到尚未完成題目', notFinishedQuestion);
    // if length is 0 , all question are finished
    if (notFinishedQuestion.length === 0) {
      await Answer.endTraining(user_id, question_id);
    }

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
      await Answer.submitCodeAnswer(user_id, question_id, qid, language, reply, content);
      res.status(200).send(reply);
    }
  }
};

const submitVideo = async (req, res) => {
  const { user_id, question_id, videoAnswer, checked } = req.body;

  let codingAnswer = await Answer.insertVideoAnswer(user_id, question_id, videoAnswer, checked);

  res.status(200).send(codingAnswer);
};

// 答題結束
const endTraining = async (req, res) => {
  const { user_id, question_id } = req.body;

  let endResult = await Answer.endTraining(user_id, question_id);
  console.log('endResult', endResult);
  res.status(200).send(endResult);
};

// get s3 upload url
const storeVideoAnswerUrl = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_PASSWORD,
    region: 'ap-northeast-1',
    signatureVersion: 'v4',
  });

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

async function runCodeWithDocker(uuid, content, language) {
  const match = {
    javascript: 'js',
    python: 'py',
  };
  try {
    let subFile = match[language];

    let writeStream = await fs.createWriteStream(`./server/util/code-training/${uuid}.${subFile}`);
    await writeStream.write(content);
    await writeStream.end();

    let { stdout, stderr } = await exec(`./server/util/code-training/build-${language}.sh ${uuid}.${subFile}`, {
      shell: '/bin/bash',
    });

    await fs.unlink(`./server/util/code-training/${uuid}.${subFile}`, (err) => {
      if (err) console.log(err);
    });
    return stdout || stderr;
  } catch (error) {
    console.log('err', error);
  }
}

async function checkCodeStatus(formalAnswer, userAnswer) {
  if (formalAnswer === userAnswer) {
    return 1;
  }
  return -1;
}

async function generateFormalAnswerContentByLanguage(content) {
  return content['formal_answer'] + `\nconsole.log(${content['call_user_answer']}(${content['test_answer']}))`;
}

async function generateUserAnswerContentByLanguage(content, formalContent, language) {
  if (language === 'javascript') return content + `;\nconsole.log(${formalContent['call_user_answer']}(${formalContent['test_answer']}))`;
  if (language === 'python') return `\nprint(Solution().${formalContent['call_user_answer']}(${formalContent['test_answer']}))`;
}

const runCompile = async (req, res) => {
  const { content, question_id, language } = req.body;

  let answerContent = await Answer.getAnswerByQuesionId(question_id);

  let specificNumber = uuidv4();

  try {
    /*--- Run Formal Answer ---*/

    let formalAnswerContent = await generateFormalAnswerContentByLanguage(answerContent);

    let formalAnswer = await runCodeWithDocker(specificNumber, formalAnswerContent, language);

    /*--- Run User Answer ---*/

    let userAnswerContent = await generateUserAnswerContentByLanguage(content, answerContent, language);

    let ans = await runCodeWithDocker(specificNumber, userAnswerContent, language);

    let resultStatus = checkCodeStatus(formalAnswer, ans);

    return res.status(200).send({
      answer_status: resultStatus,
      input: answerContent['test_answer'],
      output: ans,
      except: formalAnswer,
    });
  } catch (error) {
    return res.status(500).send({ error: 'Server Something wrong' });
  }
};

const getTraining = async (req, res) => {
  let { user_id } = req.query;
  let allTraining = await Answer.getAllTraining(user_id);

  return res.status(200).send(allTraining);
};

const getTrainingRecords = async (req, res) => {
  let { user_id, identity } = req.query;
  let allTraining;
  if (identity === 'student') {
    allTraining = await Answer.getAllTraining(user_id);
  }
  if (identity === 'tutor') {
    allTraining = await Answer.getTutorTrainingRecords(user_id);
  }
  return res.status(200).send(allTraining);
};

const getTrainingResultByQid = async (req, res) => {
  let { userID, question_id } = req.query;
  let trainingResult = await Answer.getCourseResultByQid(userID, question_id);

  return res.status(200).send(trainingResult);
};

const getQuestionsByProfession = async (req, res) => {
  let { profession } = req.query;
  let questions = await Question.getCodeQuestions(profession);

  let allQuestions = questions.questions[0];

  return res.status(200).send(allQuestions);
};

const getQuestionByQuestionID = async (req, res) => {
  let { question_id } = req.query;
  try {
    let [finishedAnswer] = await Answer.getCourseResultByQuestionID(question_id);

    return res.status(200).send(finishedAnswer);
  } catch (error) {
    return res.status(400).send({ error: error });
  }
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
  console.log('submitVideoAnswerCheck', user_id, question_id, qid, checked);
  let afterSubmit = await Answer.submitVideoAnswerCheck(user_id, question_id, qid, checked);

  return res.status(200).send(afterSubmit);
}

module.exports = {
  addLogicQuestion,
  endTraining,
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
  getTrainingResultByQid,
  getQuestionByQuestionID,
};
