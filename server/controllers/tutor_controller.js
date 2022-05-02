require('dotenv').config();
const validator = require('validator');
const Tutor = require('../models/tutor_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');

const createRoom = async (req, res) => {
    const { teacher_id, available_time, roomURL } = req.body;
    if (!teacher_id || !available_time || !roomURL) {
        res.status(400).send({ error: 'Request Error: name, email and password are required.' });
        return;
    }

    const result = await Tutor.createRoom(teacher_id, available_time, roomURL);
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    // const user = result.user;
    // if (!user) {
    //     res.status(500).send({ error: 'Database Query Error' });
    //     return;
    // }
    // req.session.isLoggedIn = true;

    res.status(200).send({
        data: {
            room_URL: roomURL,
        },
    });
};

const getAllTeacherSchedule = async (req, res) => {
    const result = await Tutor.getAllTeacherSchedule();

    let groupByResult = _.groupBy(result, 't_id');
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    res.status(200).send(groupByResult);
};

const makeAppointment = async (req, res) => {
    let { user_id, course_id } = req.body;
    console.log('make appointment', user_id, course_id);
    const result = await Tutor.makeAppointment(course_id, user_id);

    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    res.status(200).send(result);
};

const setTeacherInfomation = async (req, res) => {
    let { experience1, experience2, experience3, user_id, introduce, profession } = req.body;
    const result = await Tutor.setTeacherInfomation(experience1, experience2, experience3, user_id, introduce, profession);

    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    res.status(200).send(result);
};

const getTeacherInfomation = async (req, res) => {
    let { user_id } = req.query;
    const result = await Tutor.getTeacherInfomation(user_id);

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
    createRoom,
    getAllTeacherSchedule,
    makeAppointment,
    getAppointmentURL,
    setTeacherInfomation,
    getTeacherInfomation,
};
