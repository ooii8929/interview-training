const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
    goCompile,
    pythonCompile,
    getQuestionsByProfession,
    storeVideoAnswer,
    submitCompile,
    runCompile,
    getQuestionByQuestionID,
    getVideoQuestionsByProfession,
    submitVideo,
    addLogicQuestion,
    getProfileQuestions,
    submitVideoAnswer,
    submitVideoAnswerCheck,
    storeVideoAnswerUrl,
    submitCodeAnswer,
    getTrainingRecords,
    endTraining,
    getTrainingResultByQid,
    getTraining,
} = require('../controllers/coding_controller');

// Training
router.route('/training/video/answer').post(wrapAsync(submitVideoAnswer));
router.route('/training/video/answer/check').post(wrapAsync(submitVideoAnswerCheck));
router.route('/training/code/answer').post(wrapAsync(submitCodeAnswer));

// Training end
router.route('/training/end').post(wrapAsync(endTraining));

router.route('/training/submit/compile').post(authentication(), wrapAsync(submitCompile));

router.route('/training/video/submit/compile').post(wrapAsync(submitVideo));

router.route('/training/run/compile').post(wrapAsync(runCompile));

router.route('/training/question/logic').post(wrapAsync(addLogicQuestion));

router.route('/training/go').post(wrapAsync(goCompile));

router.route('/training').get(wrapAsync(getTraining));

router.route('/training/records').get(wrapAsync(getTrainingRecords));

router.route('/training/profile/questions').get(authentication(), wrapAsync(getProfileQuestions));

router.route('/training/profile/result').get(wrapAsync(getTrainingResultByQid));

router.route('/training/python').post(wrapAsync(pythonCompile));

// get question by id
router.route('/training/questions').get(wrapAsync(getQuestionsByProfession));

// get question result by question id
router.route('/training/question/result').get(wrapAsync(getQuestionByQuestionID));

router.route('/training/video/questions').get(wrapAsync(getVideoQuestionsByProfession));

router.route('/training/video').post(wrapAsync(storeVideoAnswer));

router.route('/training/video/answer/url').get(wrapAsync(storeVideoAnswerUrl));

module.exports = router;
