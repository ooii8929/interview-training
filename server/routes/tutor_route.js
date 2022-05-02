const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { createRoom, getAllTeacherSchedule, makeAppointment, getAppointmentURL, setTeacherInfomation, getTeacherInfomation } = require('../controllers/tutor_controller');

router.route('/tutor/teacher/schedule').post(wrapAsync(createRoom));

router.route('/tutor/teacher/schedule').get(wrapAsync(getAllTeacherSchedule));

router.route('/tutor/teacher/information').post(wrapAsync(setTeacherInfomation));
router.route('/tutor/teacher/information').get(wrapAsync(getTeacherInfomation));

router.route('/tutor/user/appoint').get(wrapAsync(getAppointmentURL));

router.route('/tutor/user/appoint').post(wrapAsync(makeAppointment));

module.exports = router;
