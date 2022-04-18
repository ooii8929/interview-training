const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { createRoom, getAllTeacherSchedule } = require('../controllers/tutor_controller');

router.route('/tutor/teacher/schedule').post(wrapAsync(createRoom));

router.route('/tutor/teacher/schedule').get(wrapAsync(getAllTeacherSchedule));

module.exports = router;
