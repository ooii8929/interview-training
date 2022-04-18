const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { createRoom, getAllTeacherSchedule, makeAppointment } = require('../controllers/tutor_controller');

router.route('/tutor/teacher/schedule').post(wrapAsync(createRoom));

router.route('/tutor/teacher/schedule').get(wrapAsync(getAllTeacherSchedule));

router.route('/tutor/user/appoint').post(wrapAsync(makeAppointment));

module.exports = router;
