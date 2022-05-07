const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
    signUp,
    signIn,
    signOut,
    getUserProfile,
    insertUserProfile,
    getUserPureProfile,
    getUserCodeLog,
    teacherSignUp,
    updateAvator,
    signCheck,
    getAvatorURL,
} = require('../controllers/user_controller');

router.route('/user/signup').post(wrapAsync(signUp));

router.route('/teacher/signup').post(wrapAsync(teacherSignUp));

router.route('/user/login').post(wrapAsync(signIn));

router.route('/user/logout').post(wrapAsync(signOut));

router.route('/user/check').get(wrapAsync(signCheck));

router.route('/user/profile/tmp').get(wrapAsync(getUserProfile));

router.route('/user/profile').get(authentication(), wrapAsync(getUserProfile));

router.route('/user/profile/avator').get(wrapAsync(getUserPureProfile));
// get upload url
router.route('/user/avator').get(wrapAsync(getAvatorURL));

router.route('/user/avator').post(wrapAsync(updateAvator));

router.route('/user/code/log').get(wrapAsync(getUserCodeLog));

router.route('/user/profile/:id').post(authentication(), wrapAsync(insertUserProfile));

module.exports = router;
