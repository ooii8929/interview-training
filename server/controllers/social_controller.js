require('dotenv').config();
const SOCIAL = require('../models/social_model');
const USER = require('../models/user_model');
const QUESTION = require('../models/question_model');

const getAllArticle = async (req, res) => {
    let articles = await SOCIAL.getAllArticle();
    console.log('====================================');
    console.log('articles', articles);
    console.log('====================================');
    res.status(200).send(articles);
};

const getArticleByID = async (req, res) => {
    let { article_id } = req.query;
    let articles = await SOCIAL.getArticleByID(article_id);
    res.status(200).send(articles);
};

const insertCodeArticle = async (req, res) => {
    // insert code post
    const { question_id, user_id, code, language } = req.body;
    const userProfile = await USER.getUserProfileByUserID(user_id);
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
        title: title,
        description: description,
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
    console.log('insertResult', insertResult);

    res.status(200).send(insertResult);
};

const insertComments = async (req, res) => {
    // insert code post
    const { user_id, article_id, summerNote } = req.body;

    let insertResult = await SOCIAL.insertComment(user_id, article_id, summerNote);
    console.log('insertResult', insertResult);

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
    updateArticleGood,
    getArticleByID,
    insertComments,
    updateArticleBad,
};
