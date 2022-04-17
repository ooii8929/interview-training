require('dotenv').config();
var cors = require('cors');
var bodyParser = require('body-parser');
const { exec, execFile } = require('child_process');
const fs = require('fs');

const goCompile = async (req, res) => {
    let ans;
    console.log('req.body', req.body);
    const content = req.body.content;
    console.log('content', content);
    await fs.writeFile('./server/env-build/app.go', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        //file written successfully
    });

    let cmd = './server/env-build/build.sh';

    await exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            ans = `${error.message}`;
            res.send(ans);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            ans = `${stderr}`;
            res.send(ans);
            return;
        }

        ans = `${stdout}`;
        console.log(`stdout: ${stdout}`);
        console.log('ans');

        console.log(ans);

        res.send(ans);
    });
};

const pythonCompile = async (req, res) => {
    let ans;
    console.log('req.body', req.body);
    const content = req.body.content;
    await fs.writeFile('test.py', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        //file written successfully
    });

    await exec('./server/util/code-training/build-python.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            ans = `${error.message}`;
            res.send(ans);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            ans = `${stderr}`;
            res.send(ans);
            return;
        }
        console.log(`${stdout}`);
        ans = `${stdout}`;
        console.log(`stdout: ${stdout}`);
        console.log('ans');

        console.log(ans);

        res.status(200).send(ans);
    });
};

const javascriptCompile = async (accessToken) => {
    let ans;
    console.log('req.body', req.body);
    const content = req.body.content;
    await fs.writeFile('test.js', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        //file written successfully
    });

    await exec('../util/code-training/build-javascript.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            ans = `${error.message}`;
            res.send(ans);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            ans = `${stderr}`;
            res.send(ans);
            return;
        }
        console.log(`${stdout}`);
        ans = `${stdout}`;
        console.log(`stdout: ${stdout}`);
        console.log('ans');

        console.log(ans);

        res.send(ans);
    });
};

module.exports = {
    goCompile,
    pythonCompile,
    javascriptCompile,
};
