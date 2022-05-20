const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { submitRecordAnswer, submitRecordAnswerCheck, getRecordUploadAnswerUrl } = require('../controllers/record_controller');

router.route('/record/answer/upload/url').get(wrapAsync(getRecordUploadAnswerUrl));

router.route('/record/answer').post(authentication(), wrapAsync(submitRecordAnswer));

router.route('/record/answer/check').post(authentication(), wrapAsync(submitRecordAnswerCheck));

module.exports = router;
