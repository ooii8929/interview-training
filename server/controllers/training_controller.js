require('dotenv').config();
const TRAINING = require('../models/training_model');

const getExamInProgressBySessionIdAndProfession = async (req, res) => {
  let { id } = req.locals;
  let { profession } = req.query;

  if (!id || id == undefined) {
    return res.status(400).send({ error: "Can't find id" });
  }

  if (!profession || profession == undefined) {
    return res.status(400).send({ error: "Can't find profession" });
  }

  let examInProgress = await TRAINING.getExamInProgressBySessionId(id);

  if (examInProgress.length > 0) {
    return res.status(200).send(examInProgress[0]);
  }

  // If there is no questions in progress, then generate a new one
  let newExam = {
    user_id: id,
    status: 0,
    profession: profession,
    create_dt: new Date(),
    video: [],
    code: [],
  };

  // Get 3 random video questions
  let videoQuestions = await TRAINING.getVideoQuestions(profession);

  // Get 3 random code questions
  let codeQuestions = await TRAINING.getCodeQuestions(profession);

  videoQuestions[0].map((e) => {
    newExam.video.push({
      qid: e.id,
      title: e.title,
      description: e.description,
      video_url: e.video,
      status: 0,
      check: [e.hint_1, e.hint_2, e.hint_3],
      checked: [],
    });
  });
  codeQuestions[0].map((e) => {
    newExam.code.push({
      qid: e.id,
      title: e.title,
      description: e.description,
      javascript_question: e.javascript,
      python_question: e.python,
      status: 0,
      checked: [],
    });
  });

  // Insert new exam to interviewee training table in mongodb
  await TRAINING.insertNewExamToTraining(newExam);
  return res.status(200).send(newExam);
};

// 答題結束
const setTrainingFinish = async (req, res) => {
  const { id } = req.locals;
  const { question_id } = req.body;

  let endResult = await TRAINING.setTrainingFinish(id, question_id);

  res.status(200).send(endResult);
};

const getTraining = async (req, res) => {
  const { id } = req.locals;

  let allTraining = await TRAINING.getAllTrainingByUserId(id);

  return res.status(200).send(allTraining);
};

const getTrainingRecords = async (req, res) => {
  const { id } = req.locals;

  let allTraining = await TRAINING.getTutorTrainingRecords(id);

  return res.status(200).send(allTraining);
};

const getTrainingResultByQid = async (req, res) => {
  const { userID, question_id } = req.query;
  let trainingResult = await TRAINING.getTrainingResultByQid(userID, question_id);

  return res.status(200).send(trainingResult);
};

const getQuestionsByProfession = async (req, res) => {
  const { profession } = req.query;
  let questions = await TRAINING.getCodeQuestions(profession);

  let allQuestions = questions.questions[0];

  return res.status(200).send(allQuestions);
};

const getQuestionByQuestionID = async (req, res) => {
  let { question_id } = req.query;
  try {
    let [finishedAnswer] = await TRAINING.getTrainingResultByQuestionID(question_id);

    return res.status(200).send(finishedAnswer);
  } catch (error) {
    return res.status(400).send({ error: error });
  }
};

const getVideoQuestionsByProfession = async (req, res) => {
  let { profession } = req.query;
  let questions = await TRAINING.getVideoQuestions(profession);

  let allQuestions = questions.questions[0];

  return res.status(200).send(allQuestions);
};

const addLogicQuestion = async (req, res) => {
  let { title, description, answer } = req.body.data;
  let question = await TRAINING.insertLogicQuestion(title, description, answer);
  return res.status(200).send(question);
};

module.exports = {
  getTraining,
  getExamInProgressBySessionIdAndProfession,
  addLogicQuestion,
  setTrainingFinish,
  getQuestionsByProfession,
  getTrainingRecords,

  getVideoQuestionsByProfession,

  getTrainingResultByQid,
  getQuestionByQuestionID,
};
