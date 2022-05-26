require('dotenv').config();
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;
const { MongodbError } = require('../util/error/database_error');

const submitVideoAnswer = async (user_id, question_id, qid, answer_url) => {
  // Get records
  const dbConnect = dbo.getDb();

  try {
    let updateAnswer = await dbConnect.collection('training').updateOne(
      {
        user_id: Number(user_id),
        _id: ObjectId(question_id),
      },
      {
        $set: {
          'video.$[c].answer_url': answer_url,
          'video.$[c].status': 1,
        },
      },
      {
        multi: true,
        arrayFilters: [
          {
            'c.qid': qid,
          },
        ],
      }
    );
    return { msg: updateAnswer };
  } catch (err) {
    throw new MongodbError('[submitVideoAnswer]', err);
  }
};

const submitVideoAnswerCheck = async (user_id, question_id, qid, checked) => {
  // Get records
  const dbConnect = dbo.getDb();

  try {
    let updateAnswer = await dbConnect.collection('training').updateOne(
      {
        user_id: Number(user_id),
        _id: ObjectId(question_id),
      },
      {
        $set: {
          'video.$[c].checked': checked,
        },
      },
      {
        multi: true,
        arrayFilters: [
          {
            'c.qid': qid,
          },
        ],
      }
    );
    return { msg: updateAnswer };
  } catch (err) {
    throw new MongodbError('[submitVideoAnswerCheck]', err);
  }
};

module.exports = {
  submitVideoAnswer,
  submitVideoAnswerCheck,
};
