const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { signUp, signIn, signOut, getUserProfileAndAppointments, getUserProfile, getUserCodeLog, updateAvator, getAvatorUploadURL } = require('../controllers/user_controller');

router.route('/signup').post(wrapAsync(signUp));

router.route('/login').post(wrapAsync(signIn));

router.route('/logout').post(authentication(), wrapAsync(signOut));

router.route('/user/profile').get(authentication(), wrapAsync(getUserProfileAndAppointments));

router.route('/user/profile/avator').get(authentication(), wrapAsync(getUserProfile));

router.route('/user/avator').get(authentication(), wrapAsync(getAvatorUploadURL));

router.route('/user/avator').post(authentication(), wrapAsync(updateAvator));

router.route('/user/code/log').get(authentication(), wrapAsync(getUserCodeLog));

module.exports = router;
