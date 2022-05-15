require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const { pool } = require('../models/mysqlcon');
const util = require('../util/util');
const Cache = require('../util/cache');
const _ = require('lodash');
var session = require('express-session');

const argon2 = require('argon2');
const dbo = require('../models/mongodbcon');
const signUp = async (req, res) => {
    const { identity, name, email, password, provider } = req.body;
    if (!util.isValidEmail(email)) {
        res.status('400').send({ error: 'email format wrong' });
        return;
    }
    if (!name || !email || !password) {
        res.status(400).send({ error: 'Request Error: name, email and password are required.' });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'Request Error: Invalid email format' });
        return;
    }
    let result;
    if (identity === 'teacher') {
        const { experience1, experience2, experience3, introduce, profession } = req.body;
        result = await User.signUpToTeacher(name, email, password, experience1, experience2, experience3, introduce, profession);
    }
    if (identity === 'student') {
        result = await User.signUpToStudent(name, email, password);
    }

    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }
    console.log('user', user);
    // req.session.isLoggedIn = true;
    sess.user = { id: user.id, provider: user.provider, name: user.name, email: user.email, picture: user.picture, create_dt: user.create_dt, identity: identity };

    sess.save((err) => {
        if (err) {
            return res.status(400).send('fail');
        } else {
            console.log('save', sess);
            res.header('Content-Type', 'application/json');
            return res.status(200).send(sess.user);
        }
    });

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

const signIn = async (req, res) => {
    const { email, password, identity, provider } = req.body;
    if (!util.isValidEmail(email)) {
        res.status('400').send({ error: 'email format wrong' });
        return;
    }

    if (Cache.ready) {
        try {
            var sess = req.session;

            let result;
            switch (provider) {
                case 'native':
                    if (identity == 'student') {
                        result = await User.nativeSignIn(email, password);
                    }

                    if (identity == 'teacher') {
                        result = await User.nativeTeacherSignIn(email, password);
                    }

                    break;
                case 'facebook':
                    result = await facebookSignIn(access_token);
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

            sess.user = { id: user.id, provider: user.provider, name: user.name, email: user.email, picture: user.picture, create_dt: user.create_dt, identity: identity };

            sess.save((err) => {
                if (err) {
                    return res.status(400).send('fail');
                } else {
                    console.log('save', sess);
                    res.header('Content-Type', 'application/json');
                    return res.status(200).send(sess.user);
                }
            });
        } catch (error) {
            console.log('error', error);
            return res.status(400).send('fail');
        }
    }
};

const signOut = async (req, res) => {
    if (Cache.ready) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: 'error' });
                }

                res.clearCookie('connect.sid', { path: '/' }).status(200).send('Ok.');
            });
        } catch (error) {
            console.log('error', error);
            return res.status(400).send({ error: 'error' });
        }
    }
};

const getAvatorURL = async (req, res) => {
    let { file_name, file_type } = req.query;
    try {
        let avatorURL = await util.storeAvatorURL(file_name, file_type);
        return res.status(200).send({ avatorURL });
    } catch (error) {
        console.log('avatorURL error', error);
        return res.status(400).send({ error: error });
    }
};

const updateAvator = async (req, res) => {
    let { identity, userID, picture } = req.body;

    try {
        let userUpdateAvator;

        userUpdateAvator = await User.updateAvator(identity, userID, picture);

        // update cache
        req.session.user.picture = picture;
        req.session.save((err) => {
            if (err) {
                return res.status(400).send('fail');
            } else {
                console.log('save');
            }
        });

        return res.status(200).send({ userUpdateAvator });
    } catch (error) {
        console.log('userUpdateAvator error', error);
        return res.status(400).send({ error });
    }
};

const getUserProfile = async (req, res) => {
    if (req.locals) {
        return res.status(200).send(req.locals);
    }

    let { userID, userEmail, identity } = req.query;
    try {
        let userProfile;
        if (identity == 'teacher') {
            userProfile = await User.getTeacherProfile(userID, userEmail);
        }
        if (identity == 'student') {
            userProfile = await User.getUserProfile(userID, userEmail);
        }

        return res.status(200).send(userProfile);
    } catch (error) {
        console.log('getUserProfile error', error);
        return res.status(400).send({ error: error });
    }
};

const getUserPureProfile = async (req, res) => {
    let { user_id, user_email, identity } = req.query;

    try {
        let userProfile;
        if (identity == 'teacher') {
            userProfile = await User.getTeacherProfile(user_id, user_email);
        }
        if (identity == 'student') {
            userProfile = await User.getUserPureProfile(user_id, user_email);
        }
        return res.status(200).send(userProfile);
    } catch (error) {
        return res.status(400).send({ error: error });
    }
};

const getUserCodeLog = async (req, res) => {
    let { question_id, user_id } = req.query;
    console.log('question_id, user_id', question_id, user_id);

    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('profile')
        .find({ user_id: user_id, question_id: parseInt(question_id) })
        .limit(50)
        .sort({ create_dt: -1 })
        .toArray(function (err, result) {
            if (err) {
                return res.status(400).send('Error fetching listings!');
            } else {
                console.log('result', result);
                return res.status(200).json(result);
            }
        });
};

const insertUserProfile = async (req, res) => {
    const { data } = req.body;

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
    signOut,
    getUserProfile,
    insertUserProfile,
    getUserCodeLog,

    getAvatorURL,
    updateAvator,
    getUserPureProfile,
};
