require('dotenv').config();
const SOCIAL = require('../models/social_model');
const USER = require('../models/user_model');
const QUESTION = require('../models/question_model');
const _ = require('lodash');

const getAllArticle = async (req, res) => {
    let articles = await SOCIAL.getAllArticle();
    console.log('articles', articles);
    let groupAuthorArticle = _.groupBy(articles, 'author_id');

    let authors = await USER.getUsersProfileByUserID(Object.keys(groupAuthorArticle));
    let articlesAndAuthors = {
        authors: authors,
        articles: articles,
    };
    res.status(200).send(articlesAndAuthors);
};

const getCodeArticle = async (req, res) => {
    try {
        let articles = await SOCIAL.getCodeArticle();
        console.log('articles', articles);
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
        res.status(400).send({ error: error });
    }
};

const getVideoArticle = async (req, res) => {
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
        res.status(400).send({ error: error });
    }
};

const getArticleByID = async (req, res) => {
    let { article_id } = req.query;
    let articles = await SOCIAL.getArticleByID(article_id);
    res.status(200).send(articles);
};

const getCodeArticleByID = async (req, res) => {
    let { article_id } = req.query;
    let articles = await SOCIAL.getCodeArticleByID(article_id);

    let authorInfo = await USER.getUserProfile(articles[0]['author_id']);

    articles[0].author = authorInfo.userProfile;

    res.status(200).send(articles);
};

const getVideoArticleByID = async (req, res) => {
    let { article_id } = req.query;
    let articles = await SOCIAL.getVideoArticleByID(article_id);
    let authorInfo = await USER.getUserProfile(articles[0]['author_id']);
    articles[0].author = authorInfo.userProfile;

    res.status(200).send(articles);
};

const insertCodeArticle = async (req, res) => {
    try {
        // insert code post
        const { user_id, article_id, qid, category, question_id } = req.body;

        let [checkShared] = await SOCIAL.checkShared(question_id, qid);

        let nowAnswer = checkShared.code.filter((e) => {
            return e.qid === Number(qid);
        });

        if (nowAnswer[0].shared) {
            return res.status(400).send({ error: '已經分享過囉' });
        }

        const userProfile = await USER.getUserProfileByUserID(user_id, req.locals.identity);

        if (!userProfile) {
            res.status(500).send({ error: 'Database Query Error' });
            return;
        }

        const [questionProfile] = await QUESTION.getCodeQuestionsByID(qid);
        if (!questionProfile) {
            res.status(500).send({ error: 'Database Query Error' });
            return;
        }

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

        let updateResult = await SOCIAL.updateCodeShared(question_id, qid);

        return res.status(200).send(insertResult);
    } catch (error) {
        console.log('error', error);
        return res.status(400).send({ error: error });
    }
};

const insertVideoArticle = async (req, res) => {
    // insert code post
    const { user_id, article_id, qid, video_url, category, question_id } = req.body;

    let [checkShared] = await SOCIAL.checkShared(question_id, qid);

    let a = checkShared.video.filter((e) => {
        return e.qid === Number(qid);
    });

    if (a[0].shared) {
        return res.status(400).send({ error: '已經分享過囉' });
    }

    const userProfile = await USER.getUserProfileByUserID(user_id, req.locals.identity);

    if (!userProfile) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    const [questionProfile] = await QUESTION.getQuestionsByID(qid);
    if (!questionProfile) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    const postData = {
        article_id: article_id,
        question_id: qid,
        title: questionProfile.title,
        description: questionProfile.description,
        author_id: user_id,
        subscribe: 0,
        post_time: new Date(),
        video_url: video_url,
        category: category,
        goods: [],
        comments: [],
    };
    let insertResult = await SOCIAL.insertVideoArticle(postData);

    let updateResult = await SOCIAL.updateVideoShared(question_id, qid);

    res.status(200).send(insertResult);
};

const insertCodeComments = async (req, res) => {
    if (!req.locals.id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }
    // insert code post
    const { article_id, summerNote } = req.body;
    let userInfo;
    if (req.locals.identity == 'student') {
        userInfo = await USER.getUserPureProfile(req.locals.id, req.locals.email);
    }

    if (req.locals.identity == 'teacher') {
        userInfo = await USER.getTeacherProfile(req.locals.id, req.locals.email);
    }
    let insertResult = await SOCIAL.insertCodeComment(req.locals.id, article_id, summerNote, userInfo[0][0]);

    return res.status(200).send(insertResult);
};

const updateArticleGood = async (req, res) => {
    // insert code post
    const { article_id, user_id } = req.body.data;
    console.log('user_id', user_id);

    if (!user_id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }

    let updateResult = await SOCIAL.updateArticleGood(article_id, user_id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

const updateArticleBad = async (req, res) => {
    // insert code post
    const { article_id } = req.body.data;
    console.log('user_id', user_id);
    if (!user_id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }

    let updateResult = await SOCIAL.updateArticleBad(article_id, user_id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

const updateArticleCodeGood = async (req, res) => {
    // insert code post

    const { article_id } = req.body;

    if (!req.locals.id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }

    let getNowGoods = await SOCIAL.getArticleCodeGood(article_id);

    if (getNowGoods[0]['goods'].includes(req.locals.id)) {
        console.log('already clicked');
        return res.status(401).send({ error: '已經點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleGood(article_id, req.locals.id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

const updateArticleVideoGood = async (req, res) => {
    // insert code post

    const { article_id } = req.body;

    if (!req.locals.id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }

    let getNowGoods = await SOCIAL.getArticleVideoGood(article_id);

    if (getNowGoods[0]['goods'].includes(req.locals.id)) {
        console.log('already clicked');
        return res.status(401).send({ error: '已經點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleVideoGood(article_id, req.locals.id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

const updateArticleVideoBad = async (req, res) => {
    // insert code post
    const { article_id } = req.body;

    if (!req.locals.id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }
    let getNowGoods = await SOCIAL.getArticleVideoGood(article_id);
    if (!getNowGoods[0]['goods'].includes(req.locals.id)) {
        console.log('not include');
        return res.status(401).send({ error: '沒有點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleVideoBad(article_id, req.locals.id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

const updateArticleCodeBad = async (req, res) => {
    // insert code post
    const { article_id } = req.body;

    if (!req.locals.id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }
    let getNowGoods = await SOCIAL.getArticleCodeGood(article_id);
    if (!getNowGoods[0]['goods'].includes(req.locals.id)) {
        console.log('not include');
        return res.status(401).send({ error: '沒有點過讚' });
    }

    let updateResult = await SOCIAL.updateArticleCodeBad(article_id, req.locals.id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

module.exports = {
    getCodeArticle,
    getAllArticle,
    getVideoArticle,
    insertCodeArticle,
    insertVideoArticle,
    updateArticleGood,
    getArticleByID,
    getCodeArticleByID,
    getVideoArticleByID,
    insertCodeComments,
    updateArticleBad,
    updateArticleCodeGood,
    updateArticleCodeBad,
    updateArticleVideoBad,
    updateArticleVideoGood,
};
