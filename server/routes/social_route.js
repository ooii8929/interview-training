const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const { getAllArticle, insertCodeArticle, updateArticleGood, getArticleByID, insertComments, updateArticleBad } = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));
router.route('/article/id').get(wrapAsync(getArticleByID));
router.route('/article/code').post(wrapAsync(insertCodeArticle));
router.route('/article/good').post(wrapAsync(updateArticleGood));
router.route('/article/bad').post(wrapAsync(updateArticleBad));
router.route('/article/subscribe').post(wrapAsync());
router.route('/article/comment').post(wrapAsync(insertComments));

module.exports = router;
