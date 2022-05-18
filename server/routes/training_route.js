const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
  getQuestionsByProfession,
  getQuestionByQuestionID,
  addLogicQuestion,

  getTrainingRecords,
  endTraining,
  getTrainingResultByQid,
  getTraining,
} = require('../controllers/coding_controller');

const { getExamInProgressBySessionIdAndProfession } = require('../controllers/training_controller');

router.route('/training/exam/progress').get(authentication(), wrapAsync(getExamInProgressBySessionIdAndProfession));

router.route('/training/end').post(wrapAsync(endTraining));

router.route('/training/question/logic').post(wrapAsync(addLogicQuestion));

router.route('/training').get(wrapAsync(getTraining));

router.route('/training/records').get(wrapAsync(getTrainingRecords));

router.route('/training/profile/result').get(wrapAsync(getTrainingResultByQid));

// get question by id
router.route('/training/questions').get(wrapAsync(getQuestionsByProfession));

// get question result by question id
router.route('/training/question/result').get(wrapAsync(getQuestionByQuestionID));

module.exports = router;
