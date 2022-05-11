require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT;
const User = require('../models/user_model');
const { TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // util from native nodejs library
const mailgun = require('mailgun-js');
const AWS = require('aws-sdk');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const productId = req.body.product_id;
            const imagePath = path.join(__dirname, `../public/assets/${productId}`);
            if (!fs.existsSync(imagePath)) {
                fs.mkdirSync(imagePath);
            }
            cb(null, imagePath);
        },
        filename: (req, file, cb) => {
            const customFileName = crypto.randomBytes(18).toString('hex').substr(0, 8);
            const fileExtension = file.mimetype.split('/')[1]; // get file extension from original file name
            cb(null, customFileName + '.' + fileExtension);
        },
    }),
});

const getImagePath = (protocol, hostname, productId) => {
    if (protocol == 'http') {
        return protocol + '://' + hostname + ':' + port + '/assets/' + productId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + productId + '/';
    }
};

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const authentication = () => {
    return async function (req, res, next) {
        req.locals = req.session.user;
        if (!req.locals || req.locals === undefined) {
            console.log('forbidden');
            res.status(403).send({ error: 'Forbidden' });
            return;
        }

        next();
    };
};

const sendMail = (mail, payment) => {
    const DOMAIN = 'wooah.app';
    const order = JSON.stringify(payment);
    const mg = mailgun({ apiKey: process.env.MAIL_GUN_API, domain: DOMAIN });
    const data = {
        from: 'Alvin <service@wooah.app>',
        to: mail,
        subject: 'Order info',
        text: `${order}`,
    };
    console.log('send mail');
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
};

const sendFailMail = (mail, content) => {
    const DOMAIN = 'wooah.app';
    const mg = mailgun({ apiKey: process.env.MAIL_GUN_API, domain: DOMAIN });
    const data = {
        from: 'Alvin <service@wooah.app>',
        to: mail,
        subject: 'Unsuccessful Group Buy',
        text: content,
    };
    console.log('send mail');
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
};

// get s3 upload url
const storeAvatorURL = async (avatorFileName, avatorFileType) => {
    AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_ACCESS_PASSWORD, region: 'ap-northeast-1', signatureVersion: 'v4' });

    const s3 = new AWS.S3();

    console.log('avatorFileName', avatorFileName);
    const myBucket = 'interview-appworks';
    const myKey = 'avator/filename';
    const signedUrlExpireSeconds = 600 * 5;
    let avaStorageUrl = await s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: `avator/${avatorFileName}`,
        Expires: signedUrlExpireSeconds,
        ContentType: avatorFileType,
    });
    return avaStorageUrl;
};

module.exports = {
    upload,
    getImagePath,
    wrapAsync,
    authentication,
    sendMail,
    sendFailMail,
    storeAvatorURL,
};
