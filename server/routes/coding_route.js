const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { submitCompile, runCompile, submitCodeAnswer } = require('../controllers/coding_controller');

router.route('/coding/code/answer').post(wrapAsync(submitCodeAnswer));

router.route('/coding/run/compile').post(wrapAsync(runCompile));

router.route('/coding/submit/compile').post(authentication(), wrapAsync(submitCompile));

module.exports = router;
