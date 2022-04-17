const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { goCompile, pythonCompile, javascriptCompile, getJavascriptQuestion } = require('../controllers/coding_controller');

router.route('/training/javascript').post(wrapAsync(javascriptCompile));

router.route('/training/go').post(wrapAsync(goCompile));

router.route('/training/python').post(wrapAsync(pythonCompile));

router.route('/training/javascript').get(wrapAsync(getJavascriptQuestion));

module.exports = router;
