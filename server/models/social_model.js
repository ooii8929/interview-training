require('dotenv').config();
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;
const { MongodbError } = require('../util/error/database_error');

const getAllArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('article').find({}).toArray();

    return cursor;
  } catch (err) {
    throw new MongodbError('[getAllArticle]', err);
  }
};

const getCodeArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('code-article').find({}).toArray();

    return cursor;
  } catch (err) {
    throw new MongodbError('[getCodeArticle]', err);
  }
};

const getVideoArticle = async () => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect.collection('video-article').find({}).toArray();

    return cursor;
  } catch (err) {
    throw new MongodbError('[getVideoArticle]', err);
  }
};

const getArticleByID = async (article_id) => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect
      .collection('article')
      .find({ _id: ObjectId(article_id) })
      .toArray();
    return cursor;
  } catch (err) {
    throw new MongodbError('[getArticleByID]', err);
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
  } catch (err) {
    throw new MongodbError('[getCodeArticleByID]', err);
  }
};

const getRecordArticleByID = async (article_id) => {
  // Get records
  const dbConnect = await dbo.getDb();
  try {
    const cursor = await dbConnect
      .collection('video-article')
      .find({ _id: ObjectId(article_id) })
      .toArray();
    return cursor;
  } catch (err) {
    throw new MongodbError('[getRecordArticleByID]', err);
  }
};

const insertCodeArticle = async (postData) => {
  // Get records
  const dbConnect = dbo.getDb();

  let insertResult = dbConnect.collection('code-article').insertOne(postData);

  return insertResult;
};

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
  } catch (error) {
    throw new MongodbError('[checkShared]', error);
  }
};

const insertVideoArticle = async (postData) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    let insertResult = dbConnect.collection('video-article').insertOne(postData);

    return insertResult;
  } catch (error) {
    throw new MongodbError('[insertVideoArticle]', error);
  }
};

const updateCodeShared = async (question_id, qid) => {
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
  } catch (error) {
    throw new MongodbError('[updateCodeShared]', error);
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
  } catch (error) {
    throw new MongodbError('[updateVideoShared]', error);
  }
};

const updateArticleGood = async (article_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();
    console.log('good', article_id, user_id);
    let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
    console.log('insertResult', insertResult);
    return insertResult;
  } catch (error) {
    throw new MongodbError('[updateArticleGood]', error);
  }
};

const updateArticleCodeGood = async (article_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();
    console.log('good', article_id, user_id);
    let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
    console.log('insertResult', insertResult);
    return insertResult;
  } catch (error) {
    throw new MongodbError('[updateArticleCodeGood]', error);
  }
};

const updateArticleVideoGood = async (article_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();
    console.log('good', article_id, user_id);
    let insertResult = await dbConnect.collection('video-article').updateOne({ _id: ObjectId(article_id) }, { $push: { goods: user_id } });
    console.log('insertResult', insertResult);
    return insertResult;
  } catch (error) {
    throw new MongodbError('[updateArticleVideoGood]', error);
  }
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
  } catch (error) {
    throw new MongodbError('[getArticleVideoGood]', error);
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
  } catch (error) {
    throw new MongodbError('[getArticleCodeGood]', error);
  }
};

const updateArticleVideoBad = async (article_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    let insertResult = await dbConnect.collection('video-article').updateOne({ _id: ObjectId(article_id) }, { $pull: { goods: user_id } });
    console.log('insertResult', insertResult);
    return insertResult;
  } catch (error) {
    throw new MongodbError('[updateArticleVideoBad]', error);
  }
};

const updateArticleCodeBad = async (article_id, user_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    let insertResult = await dbConnect.collection('code-article').updateOne({ _id: ObjectId(article_id) }, { $pull: { goods: user_id } });
    console.log('insertResult', insertResult);
    return insertResult;
  } catch (error) {
    throw new MongodbError('[updateArticleCodeBad]', error);
  }
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
  getRecordArticleByID,
  insertCodeComment,
  getArticleVideoGood,
  checkShared,
  getArticleCodeGood,
  updateArticleVideoBad,
  updateArticleVideoGood,
};
