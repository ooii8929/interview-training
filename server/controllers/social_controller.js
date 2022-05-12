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

const getArticleByID = async (req, res) => {
    let { article_id } = req.query;
    let articles = await SOCIAL.getArticleByID(article_id);
    res.status(200).send(articles);
};

const insertCodeArticle = async (req, res) => {
    // insert code post
    const { question_id, user_id, code, language, identity } = req.body;
    const userProfile = await USER.getUserProfileByUserID(user_id, identity);
    const questionProfile = await QUESTION.getQuestionsByID(question_id);
    const { title, description, profession } = questionProfile['questions'][0][0];
    if (!userProfile) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }
    if (!questionProfile) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    const postData = {
        question_id: question_id,
        picture: userProfile.picture,
        title: title,
        description: description,
        author_id: userProfile.id,
        author_name: userProfile.name,
        code: code,
        goods: [],
        subscribe: 0,
        post_time: new Date(),
        category: profession,
        language: language,
        reply: [],
    };
    let insertResult = await SOCIAL.insertCodeArticle(postData);

    res.status(200).send(insertResult);
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

const insertComments = async (req, res) => {
    // insert code post
    const { user_id, article_id, summerNote, identity, user_email } = req.body;
    let userInfo;
    if (identity == 'student') {
        userInfo = await USER.getUserPureProfile(user_id, user_email);
    }

    if (identity == 'teacher') {
        userInfo = await USER.getTeacherProfile(user_id, user_email);
    }
    let insertResult = await SOCIAL.insertComment(user_id, article_id, summerNote, userInfo[0][0]);

    return res.status(200).send(insertResult);
};

const updateArticleGood = async (req, res) => {
    // insert code post
    const { article_id, user_id } = req.body;
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
    const { article_id, user_id } = req.body;
    console.log('user_id', user_id);
    if (!user_id) {
        console.log('未登入');
        return res.status(400).send({ error: 'need login' });
    }

    let updateResult = await SOCIAL.updateArticleBad(article_id, user_id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

module.exports = {
    getAllArticle,
    insertCodeArticle,
    insertVideoArticle,
    updateArticleGood,
    getArticleByID,
    insertComments,
    updateArticleBad,
};
