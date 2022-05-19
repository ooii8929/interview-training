require('dotenv').config();

const { pool } = require('../models/mysqlcon');

const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;

const getAnswerByQuesionId = async (questionID) => {
  try {
    const [answer] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionID]);
    return answer[0];
  } catch (e) {
    return null;
  }
};

const getAllTraining = async (user_id) => {
  // Get records
  const dbConnect = await dbo.getDb();

  let allTrainingResult = dbConnect
    .collection('training')
    .find({ user_id: Number(user_id) })
    .limit(50)
    .toArray();
  return allTrainingResult;
};

const getCourseResultByQid = async (userID) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const nowQuestionResult = await dbConnect
      .collection('training')
      .find({ user_id: Number(userID), status: 1 })
      .sort({ $natural: 1 })
      .toArray();
    console.log('nowQuestionResult', nowQuestionResult);
    return nowQuestionResult;
  } catch (err) {
    return { error: 'error' };
  }
};

const questionByQid = async (user_id, question_id) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    const questionResult = await dbConnect
      .collection('training')
      .find({ _id: ObjectId(question_id) })
      .toArray();
    console.log('questionResult', questionResult);
    return questionResult;
  } catch (err) {
    return { error: 'error' };
  }
};

const insertVideoAnswer = async (user_id, question_id, videoAnswer, checked) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    dbConnect.collection('profile').insertOne({
      user_id: user_id,
      question_id: question_id,
      video_answer: videoAnswer,
      checked: checked,
    });
    return { msg: 'success' };
  } catch (err) {
    res.status(400).send(err);
  }
};

const insertCodeAnswer = async (userID, question_id, code_answer, content) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
    dbConnect.collection('profile').insertOne({
      user_id: userID,
      question_id: question_id,
      create_dt: new Date(),
      content: content,
      code_answer: code_answer,
    });
    return { msg: 'success' };
  } catch (err) {
    res.status(400).send(err);
  }
};

const submitCodeAnswer = async (user_id, question_id, qid, language, code_answer, content) => {
  console.log('submitVideoAnswer model', user_id, question_id, qid, language, code_answer, content);

  // Get records
  const dbConnect = dbo.getDb();
  if (language == 'javascript') {
    try {
      let updateAnswer = await dbConnect.collection('training').updateOne(
        {
          user_id: parseInt(user_id),
          _id: ObjectId(question_id),
        },
        {
          $set: {
            'code.$[c].javascript_answer': content,
            'code.$[c].javascript_answer_status': code_answer,
            'code.$[c].status': 1,
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
      console.log('updateAnswer', updateAnswer);
      return { msg: updateAnswer };
    } catch (err) {
      console.log('err', err);
      return { err: err };
    }
  } else if (language == 'python') {
    try {
      let updateAnswer = await dbConnect.collection('training').updateOne(
        {
          user_id: Number(user_id),
          _id: ObjectId(question_id),
        },
        {
          $set: {
            'code.$[c].python_answer': content,
            'code.$[c].python_answer_status': code_answer,
            'code.$[c].status': 1,
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
      console.log('updateAnswer', updateAnswer);
      return { msg: updateAnswer };
    } catch (err) {
      console.log('err', err);
      return { err: err };
    }
  }
};

const submitVideoAnswer = async (user_id, question_id, qid, answer_url) => {
  console.log('submitVideoAnswer model', user_id, question_id, qid, answer_url);
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
    console.log('updateAnswer', updateAnswer);
    return { msg: updateAnswer };
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

const getCourseResultByQuestionID = async (question_id) => {
  try {
    // Get records
    const dbConnect = dbo.getDb();

    const questionResult = await dbConnect
      .collection('training')
      .find({ _id: ObjectId(question_id) })
      .toArray();
    return questionResult;
  } catch (err) {
    return { error: err };
  }
};

const setTrainingFinish = async (user_id, question_id) => {
  console.log('setTrainingFinish', user_id, question_id);
  // Get records
  const dbConnect = dbo.getDb();

  try {
    let endTrainingResult = await dbConnect.collection('training').updateOne(
      {
        user_id: Number(user_id),
        _id: ObjectId(question_id),
      },
      {
        $set: {
          finished_dt: new Date(),
          status: 1,
        },
      }
    );
    console.log('endTrainingResult', endTrainingResult);
    return { msg: endTrainingResult };
  } catch (err) {
    console.log('err', err);
    return { err: err };
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
    console.log('updateAnswer', updateAnswer);
    return { msg: updateAnswer };
  } catch (err) {
    console.log('err', err);
    return { err: err };
  }
};

module.exports = {
  getAnswerByQuesionId,
  questionByQid,
  insertVideoAnswer,
  getAllTraining,
  insertCodeAnswer,
  submitVideoAnswer,
  submitVideoAnswerCheck,
  submitCodeAnswer,

  setTrainingFinish,
  getCourseResultByQid,
  getCourseResultByQuestionID,
};
