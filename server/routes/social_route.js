const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
    getCodeArticle,
    getVideoArticle,
    getAllArticle,
    insertCodeArticle,
    updateArticleGood,
    getArticleByID,
    getCodeArticleByID,
    getVideoArticleByID,
    insertComments,
    updateArticleBad,
    updateArticleCodeGood,
    updateArticleCodeBad,
    insertVideoArticle,
    insertCodeComments,
    updateArticleVideoBad,
    updateArticleVideoGood,
} = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));
router.route('/article/id').get(wrapAsync(getArticleByID));
router.route('/article/code/id').get(wrapAsync(getCodeArticleByID));
router.route('/article/video/id').get(wrapAsync(getVideoArticleByID));

router.route('/article/code').post(authentication(), wrapAsync(insertCodeArticle));
router.route('/article/code').get(wrapAsync(getCodeArticle));
router.route('/article/video').get(wrapAsync(getVideoArticle));

router.route('/article/video').post(authentication(), wrapAsync(insertVideoArticle));
router.route('/article/video').get(wrapAsync(getVideoArticle));

router.route('/article/code/good').post(authentication(), wrapAsync(updateArticleCodeGood));
router.route('/article/code/bad').post(authentication(), wrapAsync(updateArticleCodeBad));
router.route('/article/video/good').post(authentication(), wrapAsync(updateArticleVideoGood));
router.route('/article/video/bad').post(authentication(), wrapAsync(updateArticleVideoBad));
router.route('/article/subscribe').post(wrapAsync());
router.route('/article/comment').post(wrapAsync(insertComments));
router.route('/article/code/comment').post(authentication(), wrapAsync(insertCodeComments));

module.exports = router;
