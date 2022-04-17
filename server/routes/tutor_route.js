const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { createRoom } = require('../controllers/tutor_controller');

router.route('/tutor/teacher/schedule').post(wrapAsync(createRoom));

module.exports = router;
