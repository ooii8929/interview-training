let codeNowGolang;
let codeNowOne;
let codeNowTwo;
let codeNowThree;
let QuestionNow;

let prev = '';
let nextOne = '';
let nextTwo = '';

let test = (async function getQuestions() {
    let response = await axios.get('/api/1.0/training/questions', {
        params: {
            profession: 'backend',
        },
    });

    let res = response.data;

    for (let i = 0; i < res.length; i++) {
        console.log('res.length', i);
        let tmpVar = i == 0 ? 'one' : i == 1 ? 'two' : i == 2 ? 'three' : 'test';
        let tmpVarCode = '';
        switch (i) {
            case 0:
                tmpVarCode = 'codeNowOne';
                codeNowOne = res[i].code;
                break;
            case 1:
                tmpVarCode = 'codeNowTwo';
                codeNowTwo = res[i].code;
                break;
            case 2:
                tmpVarCode = 'codeNowThree';
                codeNowThree = res[i].code;
                break;
        }
        if (res[i]['video']) {
            console.log(res[i]['video']);
            // video area
            document.getElementById('test-area').innerHTML += `
                    <div id="question-${tmpVar}" class="question">
                    <h2>第${tmpVar}題</h2>
                    <div id="question-${tmpVar}-title">${res[i].title}</div>
                    <div id="question-${tmpVar}-description">${res[i].description}</div>
                    <video id="question-${tmpVar}-video" type="video/webm" controls autoplay preload src="${res[i].video}"></video>

                    <div class="record">
                        <button id="btn-start-recording">開始回答</button>
                        <button id="btn-pause-recording" style="display: none; font-size: 15px">
                            暫停一下
                        </button>
                        <div style="text-align: center; display: none">
                            <button id="save-to-disk" data-question-id="${res[i].id}">提交答案</button>
                        </div>


                        <div style="margin-top: 10px" id="recording-player"></div>
                    </div>
                    <button id="next-${tmpVar}">下一題</button>
                    </div>`;
        } else {
            document.getElementById('test-area').innerHTML += `
            <div id="question-${tmpVar}" class="question">
                    <h2>第${tmpVar}題</h2>
                    <div id="question-${tmpVar}-title">${res[i].title}</div>
                    <div class="question-block question-block-left">
                    <div id="question-${tmpVar}-description">${res[i].description}</div>
                    </div>
                    <div class="question-block question-block-right">
                    <form id="question-${tmpVar}-form">
                        <div id="codeeditor-${tmpVar}" class="codeeditor codeeditor-javascript"></div>
                        <input type="button" value="跑看看" data-question="${res[i].id}" onclick="runAnswer(this)" />
                        <input type="button" value="提交答案" data-question="${res[i].id}" onclick="submitAnswer(this)" />
                    </form>
                    <div class="answer-area">
                        <div id="answer-${tmpVarCode}"></div>
                    </div>
                    </div>
                    <button id="next-${tmpVar}" class="next-btn">下一題</button>
                    </div>`;
        }

        // code area
    }

    const firstQuestion = document.getElementById('question-one');
    const secondQuestion = document.getElementById('question-two');
    const thirdQuestion = document.getElementById('question-three');

    secondQuestion.style.display = 'none';
    thirdQuestion.style.display = 'none';

    // handle success

    var tag = document.createElement('script');
    tag.src = '../codemirror/editor.bundle.js';
    document.getElementsByTagName('head')[0].appendChild(tag);

    prev = document.querySelector('.prev');
    nextOne = document.getElementById('next-one');
    nextTwo = document.getElementById('next-two');
    nextOne.addEventListener('click', function () {
        console.log('click next');
        QuestionNow = 2;
        firstQuestion.style.display = 'none';
        secondQuestion.style.display = 'inline-block';
    });

    nextTwo.addEventListener('click', function () {
        console.log('click next');
        QuestionNow = 3;
        secondQuestion.style.display = 'none';
        thirdQuestion.style.display = 'inline-block';
    });

    // import record file
    var tag = document.createElement('script');
    tag.src = '/js/online/record.js';
    document.getElementsByTagName('head')[0].appendChild(tag);
})();

async function submitAnswer(n) {
    let codeSend;
    if (QuestionNow == 2) {
        codeSend = codeNowTwo;
        QuestionNumString = 'codeNowTwo';
    }

    if (QuestionNow == 3) {
        codeSend = codeNowThree;
        QuestionNumString = 'codeNowThree';
    }

    let questionID = n.getAttribute('data-question');
    console.log(userID, questionID, codeSend);
    let response = '';
    try {
        response = await axios.post('/api/1.0/training/submit/compile/', {
            user_id: userID,
            question_id: questionID,
            content: codeSend,
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }

    document.querySelector(`#answer-${QuestionNumString}`).innerHTML = ` 
    <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-input" class="answer-reply">${response.data.input}</div></div>
    <div class="answer-block"><div class="answer-title">output:</div><div id="answer-${QuestionNumString}-output" class="answer-reply">${response.data.output}</div></div>
    <div class="answer-block"><div class="answer-title">except:</div><div id="answer-${QuestionNumString}-except" class="answer-reply">${response.data.except}</div></div>
    `;

    await getUserCodeLog(questionID);
}

function runAnswer(n) {
    let codeSend;
    if (QuestionNow == 2) {
        codeSend = codeNowTwo;
        QuestionNumString = 'codeNowTwo';
    }

    if (QuestionNow == 3) {
        codeSend = codeNowThree;
        QuestionNumString = 'codeNowThree';
    }

    let questionID = n.getAttribute('data-question');

    let language = 'javascript';
    axios
        .post(`/api/1.0/training/run/compile`, {
            question_id: questionID,
            language: language,
            content: codeSend,
        })
        .then(function (response) {
            console.log('response', response);
            // handle success
            document.querySelector(`#answer-${QuestionNumString}`).innerHTML = `
           
            <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-input" class="answer-reply">${response.data.input}</div></div>
            <div class="answer-block"><div class="answer-title">output:</div><div id="answer-${QuestionNumString}-output" class="answer-reply">${response.data.output}</div></div>
            <div class="answer-block"><div class="answer-title">except:</div><div id="answer-${QuestionNumString}-except" class="answer-reply">${response.data.except}</div></div>
            `;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

function sendGolangAnswer() {
    axios
        .post('/api/1.0/training/go', {
            content: codeNowGolang,
        })
        .then(function (response) {
            document.querySelector('#ans').textContent = response.data;
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

function getUserCodeLog(questionID) {
    axios
        .get('/api/1.0/user/code/log', {
            params: {
                question_id: questionID,
                user_id: userID,
            },
        })
        .then(function (response) {
            console.log('getUserCodeLog response', response.data);
            for (let i = 0; i < response.data.length; i++) {
                document.querySelector(`#answer-${QuestionNumString}`).innerHTML += `
           <div class="answer-block">${response.data[i].create_dt}</div>
            <div class="answer-block"><div class="answer-history">content:</div><div id="answer-${QuestionNumString}-input" class="answer-reply">${response.data[i].content}</div></div>
            <div class="answer-block"><div class="answer-history">answer_status:</div><div id="answer-${QuestionNumString}-output" class="answer-reply">${response.data[i].code_answer.answer_status}</div></div>
            `;
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
