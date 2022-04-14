const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { getAllArticle } = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));

module.exports = router;
