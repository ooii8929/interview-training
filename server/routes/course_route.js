const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { getAllTutorSchedule, updateTutorSchedule, makeAppointment, getAppointmentURL, setTutorInfomation, gettutorInfomation } = require('../controllers/course_controller');

router.route('/course/tutor/schedule').get(wrapAsync(getAllTutorSchedule));

router.route('/course/tutor/schedule').post(authentication(), wrapAsync(updateTutorSchedule));

router.route('/course/interviewee/appoint').post(authentication(), wrapAsync(makeAppointment));

router.route('/course/tutor/information').post(authentication(), wrapAsync(setTutorInfomation));

router.route('/course/tutor/information').get(authentication(), wrapAsync(gettutorInfomation));

router.route('/course/user/appoint').get(authentication(), wrapAsync(getAppointmentURL));

module.exports = router;
