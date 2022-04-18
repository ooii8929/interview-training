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
    console.log('req.body', teacher_id, available_time, roomURL);
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

module.exports = {
    createRoom,
};
