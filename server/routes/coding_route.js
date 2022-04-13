const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { goCompile, pythonCompile, javascriptCompile } = require('../controllers/coding_controller');

router.route('/training/go').post(wrapAsync(goCompile));

router.route('/training/python').post(wrapAsync(pythonCompile));

router.route('/training/javascript').post(wrapAsync(javascriptCompile));

module.exports = router;
