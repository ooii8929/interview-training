const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { signUp, signIn, getUserProfile, insertUserProfile, getUserCodeLog, teacherSignUp, updateAvator, getAvatorURL } = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signUp));

router.route('/teacher/signup').post(wrapAsync(teacherSignUp));

router.route('/user/login').post(wrapAsync(signIn));

router.route('/user/profile/tmp').get(wrapAsync(getUserProfile));

router.route('/user/profile').get(wrapAsync(getUserProfile));

router.route('/user/avator').get(wrapAsync(getAvatorURL));

router.route('/user/avator').post(wrapAsync(updateAvator));

router.route('/user/code/log').get(wrapAsync(getUserCodeLog));

router.route('/user/profile/:id').post(authentication(), wrapAsync(insertUserProfile));

module.exports = router;
