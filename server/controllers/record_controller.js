require('dotenv').config();
const AWS = require('aws-sdk');

const Record = require('../models/record_model');

// Get s3 upload url
const getRecordUploadAnswerUrl = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_PASSWORD,
    region: process.env.RECORD_S3_REGION,
    signatureVersion: process.env.RECORD_S3_SIGNATURE_VERSION,
  });

  const s3 = new AWS.S3();

  const myBucket = process.env.RECORD_S3_BUCKET;
  const signedUrlExpireSeconds = process.env.RECORD_S3_SIGNATURE_EXPIRED_TIME;

  s3.getSignedUrl(
    'putObject',
    {
      Bucket: myBucket,
      Key: req.query.filename,
      Expires: signedUrlExpireSeconds,
      ContentType: 'video/webm',
    },
    function (err, url) {
      return res.status(200).send(url);
    }
  );
};

async function submitRecordAnswer(req, res) {
  const { user_id } = req.locals;
  const { exam_id, qid, answer_url } = req.body;

  let afterSubmit = await Record.submitVideoAnswer(user_id, exam_id, qid, answer_url);

  return res.status(200).send(afterSubmit);
}

async function submitRecordAnswerCheck(req, res) {
  const { user_id } = req.locals;
  const { question_id, qid, checked } = req.body;

  let afterSubmit = await Record.submitVideoAnswerCheck(user_id, question_id, qid, checked);

  return res.status(200).send(afterSubmit);
}

module.exports = {
  getRecordUploadAnswerUrl,
  submitRecordAnswer,
  submitRecordAnswerCheck,
};
