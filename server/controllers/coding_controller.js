require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Coding = require('../models/coding_model');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const runCompile = async (req, res) => {
  const { content, question_id, language } = req.body;

  let answerContent = await Coding.getAnswerByQuesionId(question_id);

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
    return res.status(500).send({ error: 'Server something wrong' });
  }
};

const submitCompile = async (req, res) => {
  const { id } = req.locals;
  const { content, question_id, qid, language } = req.body;
  let answerContent = await Coding.getAnswerByQuesionId(qid);
  let specificNumber = uuidv4();

  try {
    /*--- Run Formal Answer ---*/

    let formalAnswerContent = await generateFormalAnswerContentByLanguage(answerContent);

    let formalAnswer = await runCodeWithDocker(specificNumber, formalAnswerContent, language);

    /*--- Run User Answer ---*/

    let userAnswerContent = await generateUserAnswerContentByLanguage(content, answerContent, language);

    // Caculate run time
    let startTime = performance.now();

    let userAnswer = await runCodeWithDocker(specificNumber, userAnswerContent, language);

    let endTime = performance.now();

    let runTime = endTime - startTime;

    let resultStatus = await checkCodeStatus(formalAnswer, userAnswer);

    let reply = {
      answer_status: resultStatus,
      input: answerContent['test_answer'],
      output: userAnswer,
      except: formalAnswer,
      run_time: runTime,
    };

    /*--- Submit User Answer ---*/

    // Insert answer to training
    await Coding.submitCodeAnswerToTraining(id, question_id, qid, language, reply, content);

    // Insert answer to profile
    await Coding.insertCodeAnswer(id, qid, reply, content);

    // Get all code by qid
    let [checkQuestion] = await Coding.questionByQid(id, question_id);

    // Check answer if finish
    let notFinishedQuestion = checkQuestion.code.filter((e) => {
      return e.status === 0;
    });

    // If length is 0 , all question are finished
    if (notFinishedQuestion.length === 0) {
      await Coding.closeExam(id, question_id);
    }

    return res.status(200).send(reply);
  } catch (error) {
    return res.status(400).send({ error: 'wrong' });
  }
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

module.exports = {
  runCompile,
  submitCompile,
};
