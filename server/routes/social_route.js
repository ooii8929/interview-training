const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { getAllArticle, insertCodeArticle, updateArticleGood } = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));
router.route('/article/code').post(wrapAsync(insertCodeArticle));
router.route('/article/good').post(wrapAsync(updateArticleGood));
router.route('/article/subscribe').post(wrapAsync(insertCodeArticle));

module.exports = router;
