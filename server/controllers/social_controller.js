require('dotenv').config();
const SOCIAL = require('../models/social_model');
const USER = require('../models/user_model');
const TRAINING = require('../models/training_model');
const _ = require('lodash');
const { ApplicationError } = require('../util/error/base_error');
const { BadRequestError } = require('../util/error/user_error');

const getAllArticle = async (req, res, next) => {
  try {
    let articles = await SOCIAL.getAllArticle();

    let groupAuthorArticle = _.groupBy(articles, 'author_id');

    let authors = await USER.getUsersProfileByUserID(Object.keys(groupAuthorArticle));
    let articlesAndAuthors = {
      authors: authors,
      articles: articles,
    };
    res.status(200).send(articlesAndAuthors);
  } catch (error) {
    next(error);
  }
};

const getCodeArticle = async (req, res, next) => {
  try {
    let articles = await SOCIAL.getCodeArticle();

    let groupAuthorArticle = _.groupBy(articles, 'author_id');
    let groupQuestionArticle = _.groupBy(articles, 'question_id');

    let authors = await USER.getUsersProfileByUserID(Object.keys(groupAuthorArticle));
    let groupAuthor = _.groupBy(authors, 'id');
    let articlesAndAuthors = {
      authors: groupAuthor,
      articles: groupQuestionArticle,
    };
    res.status(200).send(articlesAndAuthors);
  } catch (error) {
    next(error);
  }
};

const getVideoArticle = async (req, res, next) => {
  try {
    let articles = await SOCIAL.getVideoArticle();

    let groupAuthorArticle = _.groupBy(articles, 'author_id');
    let groupQuestionArticle = _.groupBy(articles, 'question_id');

    let authors = await USER.getUsersProfileByUserID(Object.keys(groupAuthorArticle));
    let groupAuthor = _.groupBy(authors, 'id');
    let articlesAndAuthors = {
      authors: groupAuthor,
      articles: groupQuestionArticle,
    };
    res.status(200).send(articlesAndAuthors);
  } catch (error) {
    next(error);
  }
};

const getCodeArticleByID = async (req, res, next) => {
  try {
    let { article_id } = req.query;
    let articles = await SOCIAL.getCodeArticleByID(article_id);

    let authorInfo = await USER.getUserProfileByUserId(articles[0]['author_id']);

    articles[0].author = authorInfo[0][0];

    res.status(200).send(articles);
  } catch (error) {
    next(error);
  }
};

const getRecordArticleByID = async (req, res, next) => {
  try {
    let { article_id } = req.query;
    let articles = await SOCIAL.getRecordArticleByID(article_id);
    let authorInfo = await USER.getUserProfileByUserId(articles[0]['author_id']);
    articles[0].author = authorInfo[0][0];

    res.status(200).send(articles);
  } catch (error) {
    next(error);
  }
};

const insertCodeArticle = async (req, res, next) => {
  try {
    // insert code post
    const { user_id, article_id, qid, category, question_id } = req.body;

    let [checkShared] = await SOCIAL.checkShared(question_id, qid);

    let nowAnswer = checkShared.code.filter((e) => {
      return e.qid === Number(qid);
    });

    if (nowAnswer[0].shared) {
      next(new BadRequestError('[This post has been already shared.]'));
    }

    const userProfile = await USER.getUserProfileByUserID(user_id, req.locals.identity);

    const [questionProfile] = await TRAINING.getCodeQuestionsByID(qid);

    const postData = {
      article_id: article_id,
      question_id: qid,
      title: questionProfile.title,
      description: questionProfile.description,
      author_id: user_id,
      subscribe: 0,
      post_time: new Date(),
      code: nowAnswer,
      category: category,
      goods: [],
      comments: [],
    };
    let insertResult = await SOCIAL.insertCodeArticle(postData);

    await SOCIAL.updateCodeShared(question_id, qid);

    return res.status(200).send(insertResult);
  } catch (error) {
    next(error);
  }
};

const insertVideoArticle = async (req, res, next) => {
  try {
    // insert code post
    const { id } = req.locals;
    const { article_id, qid, answer_url, category, question_id } = req.body;

    let [checkShared] = await SOCIAL.checkShared(question_id, qid);

    let a = checkShared.video.filter((e) => {
      return e.qid === Number(qid);
    });

    if (a[0].shared) {
      return res.status(400).send({ error: '已經分享過囉' });
    }

    const userProfile = await USER.getUserProfileByUserID(id, req.locals.identity);

    if (!userProfile) {
      res.status(500).send({ error: 'Database Query Error' });
      return;
    }

    const [questionProfile] = await TRAINING.getQuestionsByID(qid);
    if (!questionProfile) {
      res.status(500).send({ error: 'Database Query Error' });
      return;
    }
    const postData = {
      article_id: article_id,
      question_id: qid,
      title: questionProfile.title,
      description: questionProfile.description,
      author_id: id,
      subscribe: 0,
      post_time: new Date(),
      answer_url: answer_url,
      category: category,
      goods: [],
      comments: [],
    };
    let insertResult = await SOCIAL.insertVideoArticle(postData);

    await SOCIAL.updateVideoShared(question_id, qid);

    res.status(200).send(insertResult);
  } catch (error) {
    next(error);
  }
};

const insertCodeComments = async (req, res, next) => {
  try {
    // insert code post
    const { article_id, summerNote } = req.body;
    let userInfo = await USER.getUserProfileByUserID(req.locals.id, req.locals.identity, req.locals.email);

    let insertResult = await SOCIAL.insertCodeComment(req.locals.id, article_id, summerNote, userInfo[0][0]);

    return res.status(200).send(insertResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleGood = async (req, res, next) => {
  try {
    // insert code post
    const { id } = req.locals;
    const { article_id } = req.body.data;

    let updateResult = await SOCIAL.updateArticleGood(article_id, id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleBad = async (req, res, next) => {
  try {
    // insert code post
    const { id } = req.locals;
    const { article_id } = req.body.data;

    let updateResult = await SOCIAL.updateArticleBad(article_id, id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleCodeGood = async (req, res, next) => {
  try {
    // insert code post
    const { article_id } = req.body;

    let getNowGoods = await SOCIAL.getArticleCodeGood(article_id);

    if (getNowGoods[0]['goods'].includes(req.locals.id)) {
      return res.status(401).send({ error: '已經點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleGood(article_id, req.locals.id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleVideoGood = async (req, res, next) => {
  try {
    // insert code post
    const { article_id } = req.body;

    let getNowGoods = await SOCIAL.getArticleVideoGood(article_id);

    if (getNowGoods[0]['goods'].includes(req.locals.id)) {
      return res.status(401).send({ error: '已經點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleVideoGood(article_id, req.locals.id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleVideoBad = async (req, res, next) => {
  try {
    // insert code post
    const { article_id } = req.body;

    let getNowGoods = await SOCIAL.getArticleVideoGood(article_id);
    if (!getNowGoods[0]['goods'].includes(req.locals.id)) {
      return res.status(401).send({ error: '沒有點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleVideoBad(article_id, req.locals.id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

const updateArticleCodeBad = async (req, res, next) => {
  try {
    // insert code post
    const { article_id } = req.body;

    let getNowGoods = await SOCIAL.getArticleCodeGood(article_id);
    if (!getNowGoods[0]['goods'].includes(req.locals.id)) {
      return res.status(401).send({ error: '沒有點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleCodeBad(article_id, req.locals.id);

    res.status(200).send(updateResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCodeArticle,
  getVideoArticle,
  getAllArticle,
  insertCodeArticle,
  insertVideoArticle,
  updateArticleGood,
  getCodeArticleByID,
  getRecordArticleByID,
  insertCodeComments,
  updateArticleBad,
  updateArticleCodeGood,
  updateArticleCodeBad,
  updateArticleVideoBad,
  updateArticleVideoGood,
};
