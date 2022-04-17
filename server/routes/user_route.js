const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { signUp, signIn, getUserProfile, insertUserProfile } = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signUp));

router.route('/user/login').post(wrapAsync(signIn));

router.route('/user/profile').get(authentication(), wrapAsync(getUserProfile));

router.route('/user/profile/:id').post(authentication(), wrapAsync(insertUserProfile));

module.exports = router;
