const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { submitCompile, runCompile } = require('../controllers/coding_controller');

router.route('/coding/run/compile').post(authentication(), wrapAsync(runCompile));

router.route('/coding/submit/compile').post(authentication(), wrapAsync(submitCompile));

module.exports = router;
