require('dotenv').config();
const { pool } = require('../models/mysqlcon');
const dbo = require('../models/mongodbcon');
var ObjectId = require('mongodb').ObjectID;
const { MongodbError } = require('../util/error/database_error');

const getAnswerByQuesionId = async (questionID) => {
  try {
    const [answer] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionID]);
    return answer[0];
  } catch (e) {
    return null;
  }
};

const submitCodeAnswerToTraining = async (user_id, question_id, qid, language, code_answer, content) => {
  // Get records
  const dbConnect = dbo.getDb();
  try {
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
        return { msg: updateAnswer };
      } catch (err) {
        throw new MongodbError('[submitCodeAnswerToTraining,javascript]', err);
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
        return { msg: updateAnswer };
      } catch (err) {
        return new MongodbError('[submitCodeAnswerToTraining,python]', err);
      }
    }
  } catch (err) {
    return new MongodbError('[submitCodeAnswerToTraining]', err);
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
    return new MongodbError('[insertCodeAnswer]', err);
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
    return questionResult;
  } catch (err) {
    return new MongodbError('[questionByQid]', err);
  }
};

const closeExam = async (user_id, question_id) => {
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
    return { msg: endTrainingResult };
  } catch (err) {
    return new MongodbError('[closeExam]', err);
  }
};

module.exports = {
  getAnswerByQuesionId,
  submitCodeAnswerToTraining,
  insertCodeAnswer,
  questionByQid,
  closeExam,
};
