const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
    goCompile,
    pythonCompile,
    getQuestionsByProfession,
    storeVideoAnswer,
    submitCompile,
    runCompile,
    getVideoQuestionsByProfession,
} = require('../controllers/coding_controller');

router.route('/training/submit/compile').post(wrapAsync(submitCompile));

router.route('/training/run/compile').post(wrapAsync(runCompile));

router.route('/training/go').post(wrapAsync(goCompile));

router.route('/training/python').post(wrapAsync(pythonCompile));

router.route('/training/questions').get(wrapAsync(getQuestionsByProfession));

router.route('/training/video/questions').get(wrapAsync(getVideoQuestionsByProfession));

router.route('/training/video').post(wrapAsync(storeVideoAnswer));

module.exports = router;
