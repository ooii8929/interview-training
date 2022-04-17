require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const _ = require('lodash');
const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');

const signUp = async (req, res) => {
    // set profession format
    if (!req.body.profession) {
        req.body.profession = [];
    }

    if (!Array.isArray(req.body.profession)) {
        req.body.profession = [req.body.profession];
    }

    const { identity, name, email, password, profession } = req.body;

    if (!name || !email || !password) {
        res.status(400).send({ error: 'Request Error: name, email and password are required.' });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'Request Error: Invalid email format' });
        return;
    }

    const result = await User.signUp(identity, name, email, password, profession);
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }
    req.session.isLoggedIn = true;

    res.status(200).send({
        data: {
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email,
            },
        },
    });
};

const facebookSignIn = async (accessToken) => {
    if (!accessToken) {
        return { error: 'Request Error: access token is required.', status: 400 };
    }

    try {
        const profile = await User.getFacebookProfile(accessToken);
        console.log('profile', profile);
        const { id, name, email } = profile;

        if (!id || !name || !email) {
            return {
                error: 'Permissions Error: facebook access token can not get user id, name or email',
            };
        }

        return await User.facebookSignIn(id, name, email);
    } catch (error) {
        return { error: error };
    }
};

const signIn = async (req, res) => {
    const { data } = req.body;

    let result;
    switch (data.provider) {
        case 'native':
            result = await User.nativeSignIn(data.email, data.password);
            break;
        case 'facebook':
            result = await facebookSignIn(data.access_token);
            break;
        default:
            result = { error: 'Wrong Request' };
    }

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    res.status(200).send({
        data: {
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
        },
    });
};

const getUserProfile = async (req, res) => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('profile')
        .find({ user_id: 1 })
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
};

const insertUserProfile = async (req, res) => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect.collection('profile').insertOne({
        user_id: 2,
        question_id: 2,
        video_answer: 'https://google.com.tw',
        code_answer: "console.log('123')",
    });

    res.status(200).send('Insert finish!');

    return;
};

module.exports = {
    signUp,
    signIn,
    getUserProfile,
    insertUserProfile,
};
