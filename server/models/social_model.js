require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;

const getAllArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('article').find({}).toArray();

    return cursor;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

const getCodeArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('code-article').find({}).toArray();

    return cursor;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

const getVideoArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('video-article').find({}).toArray();

    return cursor;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

const getArticleByID = async (article_id) => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    console.log('article_id', article_id);
    const cursor = await dbConnect
      .collection('article')
      .find({ _id: ObjectId(article_id) })
      .toArray();
    console.log('cursor');
    return cursor;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

const getCodeArticleByID = async (article_id) => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect
      .collection('code-article')
      .find({ _id: ObjectId(article_id) })
      .toArray();
    return cursor;
  } catch (error) {
    return error;
  }
};

const getVideoArticleByID = async (article_id) => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    console.log('article_id', article_id);
    const cursor = await dbConnect
      .collection('video-article')
      .find({ _id: ObjectId(article_id) })
      .toArray();
    console.log('cursor', cursor);
    return cursor;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

const insertCodeArticle = async (postData) => {
  // Get records
  const dbConnect = dbo.getDb();

  let insertResult = dbConnect.collection('code-article').insertOne(postData);

  return insertResult;
};

// const insertVideoArticle = async (postData) => {
//     // Get records
//     const dbConnect = dbo.getDb();

//     let insertResult = await dbConnect.collection('article').insertOne(postData);

//     return insertResult;
// };

const insertCodeComment = async (user_id, article_id, summerNote, userInfo) => {
  // Get records
  const dbConnect = dbo.getDb();
  let commentInfo = {
    user_id: user_id,
    content: summerNote,
    create_dt: new Date(),
    name: userInfo.name,
    picture: userInfo.picture,
  };

  if (userInfo.profession && userInfo.experience1) {
    commentInfo.profession = userInfo.profession;
    commentInfo.experience = userInfo.experience1;
  }

  let insertResult = await dbConnect.collection('code-article').update(
    { _id: ObjectId(article_id) },
    {
      $push: {
        comments: commentInfo,
      },
    }
  );

  return insertResult;
};

const checkShared = async (question_id, qid) => {
  console.log(question_id, qid);
  // Get records
  const dbConnect = dbo.getDb();

  try {
    const getShared = await dbConnect
      .collection('training')
      .find({
        _id: ObjectId(question_id),
      })
      .toArray();

    return getShared;
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const insertVideoArticle = async (postData) => {
  // Get records
  const dbConnect = dbo.getDb();

  let insertResult = dbConnect.collection('video-article').insertOne(postData);

  return insertResult;
};

const updateCodeShared = async (question_id, qid) => {
  console.log(question_id, qid);
  // Get records
  const dbConnect = dbo.getDb();

  try {
    let updateAnswer = await dbConnect.collection('training').updateOne(
      {
        _id: ObjectId(question_id),
      },
      {
        $set: {
          'code.$[c].shared': true,
        },
      },
      {
        multi: true,
        arrayFilters: [
          {
            'c.qid': Number(qid),
          },
        ],
      }
    );
    console.log('updateAnswer', updateAnswer);
    return { msg: updateAnswer };
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const updateVideoShared = async (question_id, qid) => {
  console.log(question_id, qid);
  // Get records
  const dbConnect = dbo.getDb();

  try {
    let updateAnswer = await dbConnect.collection('training').updateOne(
      {
        _id: ObjectId(question_id),
      },
      {
        $set: {
          'video.$[v].shared': true,
        },
      },
      {
        multi: true,
        arrayFilters: [
          {
            'v.qid': Number(qid),
          },
        ],
      }
    );
    console.log('updateAnswer', updateAnswer);
    return { msg: updateAnswer };
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const updateArticleGood = async (article_id, user_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  console.log('good', article_id, user_id);
  let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
  console.log('insertResult', insertResult);
  return insertResult;
};

const updateArticleCodeGood = async (article_id, user_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  console.log('good', article_id, user_id);
  let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
  console.log('insertResult', insertResult);
  return insertResult;
};

const updateArticleVideoGood = async (article_id, user_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  console.log('good', article_id, user_id);
  let insertResult = await dbConnect.collection('video-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
  console.log('insertResult', insertResult);
  return insertResult;
};

const getArticleVideoGood = async (article_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  console.log('article_id', article_id);
  try {
    const goods = await dbConnect
      .collection('video-article')
      .find({
        _id: ObjectId(article_id),
      })
      .toArray();

    return goods;
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const getArticleCodeGood = async (article_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  console.log('article_id', article_id);
  try {
    const goods = await dbConnect
      .collection('code-article')
      .find({
        _id: ObjectId(article_id),
      })
      .toArray();

    return goods;
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const updateArticleVideoBad = async (article_id, user_id) => {
  // Get records
  const dbConnect = dbo.getDb();

  let insertResult = await dbConnect.collection('video-article').updateOne({ _id: ObjectId(article_id) }, { $pull: { goods: user_id } });
  console.log('insertResult', insertResult);
  return insertResult;
};

const updateArticleCodeBad = async (article_id, user_id) => {
  // Get records
  const dbConnect = dbo.getDb();

  let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $pull: { goods: user_id } });
  console.log('insertResult', insertResult);
  return insertResult;
};

module.exports = {
  getCodeArticle,
  getVideoArticle,
  updateVideoShared,
  updateCodeShared,
  insertCodeArticle,
  insertVideoArticle,
  getAllArticle,
  updateArticleGood,
  updateArticleCodeBad,
  updateArticleCodeGood,
  getArticleByID,
  getCodeArticleByID,
  getVideoArticleByID,
  insertCodeComment,
  getArticleVideoGood,
  checkShared,
  getArticleCodeGood,
  updateArticleVideoBad,
  getArticleVideoGood,
  updateArticleVideoGood,
};
