const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { signUp, signIn, getUserProfile, insertUserProfile, getUserCodeLog } = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signUp));

router.route('/user/login').post(wrapAsync(signIn));

router.route('/user/profile').get(wrapAsync(getUserProfile));

router.route('/user/code/log').get(wrapAsync(getUserCodeLog));

router.route('/user/profile/:id').post(authentication(), wrapAsync(insertUserProfile));

module.exports = router;
