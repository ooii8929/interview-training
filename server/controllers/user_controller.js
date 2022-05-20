require('dotenv').config();
const validator = require('validator');
const User = require('../models/user_model');
const util = require('../util/util');
const Cache = require('../util/cache');
const dbo = require('../models/mongodbcon');

const signUp = async (req, res) => {
  try {
    const { identity, name, email, password } = req.body;
    let { provider } = req.body;

    if (!name || !email || !password) {
      res.status(400).send({ error: 'Request Error: name, email and password are required.' });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).send({ error: 'Invalid email format' });
      return;
    }

    if (!provider) {
      provider = 'native';
    }

    let result;

    if (identity === 'tutor') {
      const { experience1, experience2, experience3, introduce, profession } = req.body;
      result = await User.signUpTotutor(name, email, password, experience1, experience2, experience3, introduce, profession, provider);
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
      return res.status(500).send({ error: 'server error' });
    }
    if (Cache.ready) {
      let sess = req.session;

      sess.user = { id: user.id, provider: user.provider, name: user.name, email: user.email, picture: user.picture, identity: identity };

      sess.save((err) => {
        if (err) {
          return res.status(400).send({ error: 'session fail' });
        } else {
          res.header('Content-Type', 'application/json');
          return res.status(200).send({
            id: user.id,
            provider: user.provider,
            name: user.name,
            email: user.email,
          });
        }
      });
    }
  } catch (error) {
    console.log('sign up error', error);
    return res.status(500).send({ error: 'server error' });
  }
};

const signIn = async (req, res) => {
  const { email, password, identity, provider } = req.body;
  if (!util.isValidEmail(email)) {
    res.status('400').send({ error: 'email format wrong' });
    return;
  }

  if (Cache.ready) {
    try {
      let sess = req.session;

      let result;
      switch (provider) {
        case 'native':
          if (identity == 'student') {
            result = await User.nativeSignIn(email, password);
          }

          if (identity == 'tutor') {
            result = await User.nativetutorSignIn(email, password);
          }

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
        return res.status(500).send({ error: 'server error' });
      }

      sess.user = { id: user.id, provider: user.provider, name: user.name, email: user.email, picture: user.picture, create_dt: user.create_dt, identity: identity };

      sess.save((err) => {
        if (err) {
          return res.status(400).send({ error: 'fail' });
        } else {
          res.header('Content-Type', 'application/json');
          return res.status(200).send(sess.user);
        }
      });
    } catch (error) {
      return res.status(500).send({ error: 'server error' });
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
      return res.status(500).send({ error: 'server error' });
    }
  }
};

const getUserProfileByUserEmail = async (req, res) => {
  if (req.locals) {
    return res.status(200).send(req.locals);
  } else {
    return res.status(500).send({ error: 'server error' });
  }
};

const getAvatorUploadURL = async (req, res) => {
  let { file_name, file_type } = req.query;
  try {
    let avatorURL = await util.storeAvatorURL(file_name, file_type);
    return res.status(200).send(avatorURL);
  } catch (error) {
    return res.status(500).send({ error: 'server error' });
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
        return res.status(500).send({ error: 'server error' });
      }
    });

    return res.status(200).send({ userUpdateAvator });
  } catch (error) {
    return res.status(500).send({ error: 'server error' });
  }
};

const getUserCodeLog = async (req, res) => {
  let { question_id, user_id } = req.query;

  // Get records
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('profile')
    .find({ user_id: user_id, question_id: parseInt(question_id) })
    .limit(50)
    .sort({ create_dt: -1 })
    .toArray(function (err, result) {
      if (err) {
        return res.status(400).send({ error: 'Error fetching listings!' });
      } else {
        console.log('result', result);
        return res.status(500).send({ error: 'server error' });
      }
    });
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getUserProfileByUserEmail,
  getUserCodeLog,
  getAvatorUploadURL,
  updateAvator,
};
