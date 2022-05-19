const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
  getExamInProgressBySessionIdAndProfession,
  getTraining,
  getQuestionsByProfession,
  getQuestionByQuestionID,
  getTrainingRecords,
  setTrainingFinish,
} = require('../controllers/training_controller');

router.route('/training').get(authentication(), wrapAsync(getTraining));

router.route('/training/exam/progress').get(authentication(), wrapAsync(getExamInProgressBySessionIdAndProfession));

router.route('/training/exam/finish').post(authentication(), wrapAsync(setTrainingFinish));

router.route('/training/tutor/records').get(authentication(), wrapAsync(getTrainingRecords));

// router.route('/training/profile/result').get(authentication(), wrapAsync(getTrainingResultByQid));

// Get question by id
router.route('/training/questions').get(wrapAsync(getQuestionsByProfession));

// Get question result by question id
router.route('/training/question/result').get(wrapAsync(getQuestionByQuestionID));

module.exports = router;
