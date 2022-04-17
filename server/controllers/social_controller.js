require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;
// This will help us connect to the database
const dbo = require('../models/mongodbcon');

const getAllArticle = async (req, res) => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('interview')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
};

const insertArticle = async (req, res) => {
    // Get records
    const dbConnect = dbo.getDb();

    dbConnect.collection('article').insertOne({
        id: 1,
        title: '什麼是時間複雜度',
        description: '時間複雜度就是....',
        author_name: 'alvin',
        post_video: 'https://video.com',
        goods: 300,
        subscribe: 300,
        best_answer: 3,
        post_time: new Date(),
        category: ['軟體工程師', '資安'],
        reply: [
            {
                reply_id: 1,
                reply_description: '在我看來，時間複雜度應該是....',
                reply_author_id: 2,
                post_video: 'https://video.com',
                reply_goods: 300,
                reply_time: new Date(),
                reply_reply: [
                    {
                        reply_in_id: 1,
                        reply_in_description: '在我看來，時間複雜度應該是....',
                        reply_in_author_id: 2,
                        reply_in_time: new Date(),
                    },
                ],
            },
            {
                reply_id: 4,
                reply_description: '在我看來，時間複雜度應該是....',
                reply_author_id: 3,
                post_video: 'https://video.com',
                reply_goods: 30,
                reply_time: new Date(),
                reply_reply: [
                    {
                        reply_in_id: 1,
                        reply_in_description: '在我看來，時間複雜度應該是....',
                        reply_in_author_id: 2,
                        reply_in_time: new Date(),
                    },
                ],
            },
        ],
    });
    res.status(200).send('Insert finish!');
};

module.exports = {
    getAllArticle,
    insertArticle,
};
