require('dotenv').config();
const Tutor = require('../models/course_model');
const _ = require('lodash');

const getAllTutorSchedule = async (req, res) => {
  const result = await Tutor.getAllTutorSchedule();

  let resultFilter = result.filter((e) => {
    return new Date(e.available_time) > Date.now();
  });
  let groupByResult = _.groupBy(resultFilter, 't_id');
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send(groupByResult);
};

const updateTutorSchedule = async (req, res) => {
  const { tutor_id, available_time, roomURL } = req.body;
  if (!tutor_id || !available_time || !roomURL) {
    res.status(400).send({ error: 'Request Error: name, email and password are required.' });
    return;
  }

  const result = await Tutor.updateTutorSchedule(tutor_id, available_time, roomURL);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send({ room_URL: roomURL });
};

const makeAppointment = async (req, res) => {
  let { course_id } = req.body;
  console.log('make appointment', course_id);
  const result = await Tutor.makeAppointment(course_id, req.locals.id);

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send(result);
};

const settutorInfomation = async (req, res) => {
  let { experience1, experience2, experience3, user_id, introduce, profession } = req.body;
  const result = await Tutor.settutorInfomation(experience1, experience2, experience3, user_id, introduce, profession);

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send(result);
};

const gettutorInfomation = async (req, res) => {
  let { user_id } = req.query;
  const result = await Tutor.gettutorInfomation(user_id);

  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send(result);
};

const getAppointmentURL = async (req, res) => {
  let { userID } = req.query;
  const result = await Tutor.getAllAppointmentByID(userID);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  res.status(200).send(result);
};

module.exports = {
  getAllTutorSchedule,
  updateTutorSchedule,
  makeAppointment,
  getAppointmentURL,
  settutorInfomation,
  gettutorInfomation,
};
