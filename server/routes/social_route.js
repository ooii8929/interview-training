const router = require('express').Router();

const { wrapAsync, authentication } = require('../util/util');

const {
  getCodeArticle,
  getVideoArticle,
  getAllArticle,
  insertCodeArticle,
  getCodeArticleByID,
  getRecordArticleByID,
  updateArticleCodeGood,
  updateArticleCodeBad,
  insertVideoArticle,
  insertCodeComments,
  updateArticleVideoBad,
  updateArticleVideoGood,
} = require('../controllers/social_controller');

router.route('/article').get(wrapAsync(getAllArticle));

router.route('/article/code/id').get(wrapAsync(getCodeArticleByID));
router.route('/article/record/id').get(wrapAsync(getRecordArticleByID));

router.route('/article/code').get(wrapAsync(getCodeArticle));
router.route('/article/code').post(authentication(), wrapAsync(insertCodeArticle));

router.route('/article/record').get(wrapAsync(getVideoArticle));
router.route('/article/record').post(authentication(), wrapAsync(insertVideoArticle));

router.route('/article/code/good').post(authentication(), wrapAsync(updateArticleCodeGood));
router.route('/article/code/bad').post(authentication(), wrapAsync(updateArticleCodeBad));

router.route('/article/record/good').post(authentication(), wrapAsync(updateArticleVideoGood));
router.route('/article/record/bad').post(authentication(), wrapAsync(updateArticleVideoBad));

router.route('/article/code/comment').post(authentication(), wrapAsync(insertCodeComments));

module.exports = router;
