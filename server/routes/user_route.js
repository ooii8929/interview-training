const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { signUp, signIn, signOut, getUserProfileByUserEmail, getUserCodeLog, updateAvator, getAvatorUploadURL } = require('../controllers/user_controller');

router.route('/signup').post(wrapAsync(signUp));

router.route('/login').post(wrapAsync(signIn));

router.route('/logout').post(authentication(), wrapAsync(signOut));

router.route('/user/profile').get(authentication(), wrapAsync(getUserProfileByUserEmail));

router.route('/user/avator/upload').get(authentication(), wrapAsync(getAvatorUploadURL));

router.route('/user/avator').post(authentication(), wrapAsync(updateAvator));

router.route('/user/code/log').get(authentication(), wrapAsync(getUserCodeLog));

module.exports = router;
