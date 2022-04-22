let codeNow = {};
let codeNowOne;
let codeNowTwo;
let codeNowThree;
let QuestionNow = 0;
let language = 'javascript';
let getQuestionsArr;
let allCodeQuestions;
let nowQuestion;
let hasVideo = false;
let choosedQuestionID;
let response = '';

let prev = '';
let nextOne = '';
let nextTwo = '';

let test = (async function getQuestions() {
    // Get Questions
    let response = await axios.get('/api/1.0/training/questions', {
        params: {
            profession: 'backend',
        },
    });
    getQuestionsArr = response.data;

    let res = response.data;

    // filter code questions
    function isCodeQuestion(x) {
        return x.video == null;
    }

    allCodeQuestions = res.filter(isCodeQuestion);
    if (allCodeQuestions.length !== res.length) {
        hasVideo = true;
    }
    for (let i = 0; i < res.length; i++) {
        let tmpVarCodeArea = res[i]['id'];
        let tmpVar = i == 0 ? 'one' : i == 1 ? 'two' : i == 2 ? 'three' : 'test';
        let tmpVarCode = '';
        switch (i) {
            case 0:
                tmpVarCode = 'codeNowOne';
                codeNowOne = res[i][language];
                break;
            case 1:
                tmpVarCode = 'codeNowTwo';
                codeNowTwo = res[i][language];
                break;
            case 2:
                tmpVarCode = 'codeNowThree';
                codeNowThree = res[i][language];
                break;
        }
        if (res[i]['video']) {
            console.log(res[i]['video']);
            // video area
            document.getElementById('test-area').innerHTML += `
                    <div id="question-${tmpVar}" class="question" data-order="${i}" style="display:none">
                    <h2>第${tmpVar}題</h2>
                    <div id="question-${tmpVar}-title">${res[i].title}</div>
                    <div id="question-${tmpVar}-description">${res[i].description}</div>
                    <video id="question-${tmpVar}-video" type="video/webm" controls preload src="${res[i].video}"></video>

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
            <div id="question-${tmpVar}" class="question" data-order="${i}" style="display:none">
                    <h2>第${tmpVar}題</h2>
                    <div id="question-${tmpVar}-title">${res[i].title}</div>
                    <div class="question-block question-block-left">
                    <div id="question-${tmpVar}-description">${res[i].description}</div>
                    </div>
                    <div class="question-block question-block-right">
                    <select class="language-select" data-language="${tmpVarCodeArea}">
                        <option value="javascript" class='language-btn'>javascript</option>
                        <option value="python" class='language-btn'>python</option>
                    </select>
                    <form id="question-${tmpVar}-form">
                        <div id="codeeditor-${tmpVarCodeArea}" class="codeeditor codeeditor-javascript"></div>
                        <input type="button" value="跑看看" data-question="${res[i].id}" class="run-answer" />
                        <input type="button" value="提交答案" data-question="${res[i].id}" onclick="submitAnswer(this)" />
                    </form>
                    <div class="answer-area">
                        <div id="answer-${tmpVarCode}"></div>
                    </div>
                    </div>
                    <button id="share-btn-${res[i].id}" data-question="${res[i].id}" onclick="shareAnswer(this)" style="display:none"/>我的答案真不錯！立刻分享</button>
                    <div class="code-history-log" data-log="${res[i].id}"></div>
                    <button id="next-${tmpVar}" class="next-btn">下一題</button>
                    </div>
                    
                    `;
        }

        // show first dom
        document.querySelector("[data-order = '0']").style.display = 'block';

        // run event
        var runBtns = document.querySelectorAll('.run-answer');

        Array.from(runBtns).forEach((link) => {
            link.addEventListener('click', async function (e) {
                let runQuestionID = e.target.getAttribute('data-question');
                let runLanguage = document.querySelector(`[data-language='${runQuestionID}']`).value;

                let codeSend;
                if (QuestionNow == 0) {
                    codeSend = getQuestionsArr[0][runLanguage];
                    QuestionNumString = 'codeNowOne';
                }
                if (QuestionNow == 1) {
                    codeSend = getQuestionsArr[1][runLanguage];
                    QuestionNumString = 'codeNowTwo';
                }

                if (QuestionNow == 2) {
                    codeSend = getQuestionsArr[2][runLanguage];
                    QuestionNumString = 'codeNowThree';
                }

                try {
                    response = await axios.post('/api/1.0/training/run/compile', {
                        question_id: runQuestionID,
                        language: runLanguage,
                        content: codeSend,
                    });
                } catch (error) {
                    console.error(error);
                }
                // handle success
                if (!response.data.answer_status) {
                    console.log('response.data', response.data);
                    document.querySelector(`#answer-${QuestionNumString}`).innerHTML = ` 
                    <div class="answer-block"><div class="answer-title">error:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.stderr}</div></div>`;
                } else {
                    document.querySelector(`#answer-${QuestionNumString}`).innerHTML = ` 
                    <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.answer_status}</div></div>
                    <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-input" class="answer-reply">${response.data.input}</div></div>
                    <div class="answer-block"><div class="answer-title">output:</div><div id="answer-${QuestionNumString}-output" class="answer-reply">${response.data.output}</div></div>
                    <div class="answer-block"><div class="answer-title">except:</div><div id="answer-${QuestionNumString}-except" class="answer-reply">${response.data.except}</div></div>
                    <div class="answer-block"><div class="answer-title">run time:</div><div id="answer-${QuestionNumString}-run_time" class="answer-reply">${response.data.run_time}</div></div>
                    `;
                }
            });
        });
    }

    // handle success
    var tag = document.createElement('script');
    tag.src = '../codemirror/editor.bundle.js';
    document.getElementsByTagName('head')[0].appendChild(tag);

    prev = document.querySelector('.prev');
    nextOne = document.getElementById('next-one');
    nextTwo = document.getElementById('next-two');
    nextOne.addEventListener('click', function () {
        console.log('click next');
        QuestionNow = 1;
        document.querySelector("[data-order = '0']").style.display = 'none';
        document.querySelector("[data-order = '1']").style.display = 'inline-block';
    });

    nextTwo.addEventListener('click', function () {
        console.log('click next');
        QuestionNow = 2;
        document.querySelector("[data-order = '1']").style.display = 'none';
        document.querySelector("[data-order = '2']").style.display = 'inline-block';
    });

    if (hasVideo) {
        // import record file
        var tag = document.createElement('script');
        tag.src = '/js/online/record.js';
        document.getElementsByTagName('head')[0].appendChild(tag);
    }
})();

async function submitAnswer(n) {
    let codeSend;
    console.log('language in question.js', language);

    if (QuestionNow == 0) {
        codeSend = getQuestionsArr[0][language];
        QuestionNumString = 'codeNowOne';
    }
    if (QuestionNow == 1) {
        codeSend = getQuestionsArr[1][language];
        QuestionNumString = 'codeNowTwo';
    }

    if (QuestionNow == 2) {
        codeSend = getQuestionsArr[2][language];
        QuestionNumString = 'codeNowThree';
    }

    let questionID = n.getAttribute('data-question');

    try {
        response = await axios.post('/api/1.0/training/submit/compile/', {
            user_id: userID,
            question_id: questionID,
            content: codeSend,
            language: language,
        });
    } catch (error) {
        console.error(error);
    }

    console.log('response.data', response.data);

    if (!response.data.answer_status) {
        document.querySelector(`#answer-${QuestionNumString}`).innerHTML = ` 
        <div class="answer-block"><div class="answer-title">error:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.stderr}</div></div>`;
    } else {
        document.querySelector(`#answer-${QuestionNumString}`).innerHTML = ` 
        <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.answer_status}</div></div>
        <div class="answer-block"><div class="answer-title">input:</div><div id="answer-${QuestionNumString}-input" class="answer-reply">${response.data.input}</div></div>
        <div class="answer-block"><div class="answer-title">output:</div><div id="answer-${QuestionNumString}-output" class="answer-reply">${response.data.output}</div></div>
        <div class="answer-block"><div class="answer-title">except:</div><div id="answer-${QuestionNumString}-except" class="answer-reply">${response.data.except}</div></div>
        <div class="answer-block"><div class="answer-title">run time:</div><div id="answer-${QuestionNumString}-run_time" class="answer-reply">${response.data.run_time}</div></div>
        `;

        document.getElementById(`share-btn-${questionID}`).style.display = 'block';

        await getUserCodeLog(questionID);
    }
}

async function shareAnswer(n) {
    console.log('shareAnswer');
    let codeSend;

    if (QuestionNow == 0) {
        codeSend = getQuestionsArr[0][language];
        QuestionNumString = 'codeNowOne';
    }
    if (QuestionNow == 1) {
        codeSend = getQuestionsArr[1][language];
        QuestionNumString = 'codeNowTwo';
    }

    if (QuestionNow == 2) {
        codeSend = getQuestionsArr[2][language];
        QuestionNumString = 'codeNowThree';
    }

    let questionID = n.getAttribute('data-question');

    try {
        response = await axios.post('/api/1.0/article/code', {
            user_id: userID,
            question_id: questionID,
            code: codeSend,
            language: language,
        });
    } catch (error) {
        console.error(error);
    }

    if (!response) {
        console.log('share error');
        //     document.querySelector(`#answer-${QuestionNumString}`).innerHTML = `
        // <div class="answer-block"><div class="answer-title">error:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.stderr}</div></div>`;
    } else {
        console.log('share reponse', response);
        document.querySelector(`#answer-${QuestionNumString}`).innerHTML = `
        <h1>分享成功</h1>
    `;

        await getUserCodeLog(questionID);
    }
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
                document.querySelector(`[data-log = '${questionID}']`).innerHTML += `
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
