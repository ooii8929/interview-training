const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { getAllArticle, insertArticle } = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));
router.route('/article').post(wrapAsync(insertArticle));

module.exports = router;
