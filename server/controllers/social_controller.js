require('dotenv').config();
const SOCIAL = require('../models/social_model');
const USER = require('../models/user_model');

const getAllArticle = async (req, res) => {
    let articles = SOCIAL.getAllArticle();
    res.status(200).send(articles);
};

const insertCodeArticle = async (req, res) => {
    // insert code post
    const { question_id, title, description, user_id, code, category } = req.body;
    const userProfile = await USER.getUserProfileByUserID(user_id);
    if (!userProfile) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }
    const postData = {
        question_id: question_id,
        title: title,
        description: description,
        author_name: userProfile.name,
        code: code,
        goods: 0,
        subscribe: 0,
        post_time: new Date(),
        category: category,
        reply: [],
    };
    let insertResult = await SOCIAL.insertCodeArticle(postData);
    console.log('insertResult', insertResult);

    res.status(200).send(insertResult);
};

const updateArticleGood = async (req, res) => {
    // insert code post
    const { article_id, user_id } = req.body;

    let updateResult = await SOCIAL.updateArticleGood(article_id, user_id);
    console.log('updateResult', updateResult);

    res.status(200).send(updateResult);
};

module.exports = {
    getAllArticle,
    insertCodeArticle,
    updateArticleGood,
};
