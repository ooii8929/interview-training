let codeNow = {};
let codeNowOne;
let codeNowTwo;
let codeNowThree;
let QuestionNow = 0;
let language = 'javascript';
let getQuestionsArr;
let allCodeQuestions;
let nowQuestion;

let choosedQuestionID;
let response = '';

let prev = '';
let nextOne = '';
let nextTwo = '';

let getVideoQuestionss = (async function getQuestions() {
    // Get Questions
    let response = await axios.get('/api/1.0/training/video/questions', {
        params: {
            profession: 'backend',
        },
    });
    getQuestionsArr = response.data;

    let res = response.data;
    let res_order = 0;
    for await (const r of res) {
        let tmpVarCodeArea = r['id'];
        let tmpVarCode = '';
        switch (res_order) {
            case 0:
                tmpVarCode = 'codeNowOne';
                codeNowOne = r[language];
                break;
            case 1:
                tmpVarCode = 'codeNowTwo';
                codeNowTwo = r[language];
                break;
            case 2:
                tmpVarCode = 'codeNowThree';
                codeNowThree = r[language];
                break;
        }
        // video area
        document.getElementById('test-area').innerHTML += `
                    <div id="question-${tmpVarCodeArea}" class="question" data-order="${res_order}" style="display:none">
                    <h2>第${res_order + 1}題</h2>
                    <div id="question-${tmpVarCodeArea}-title">${r.title}</div>
                    <div id="question-${tmpVarCodeArea}-description">${r.description}</div>
                    <video id="question-${tmpVarCodeArea}-video" type="video/webm" controls preload src="${r.video}"></video>

                    <div class="record">
                        <button id="btn-start-recording">開始回答</button>
                        <button id="btn-pause-recording" style="display: none; font-size: 15px">
                            暫停一下
                        </button>
                        <div style="text-align: center; display: none">
                            <button id="save-to-disk" data-question-id="${r.id}">提交答案</button>
                        </div>


                        <div style="margin-top: 10px" id="recording-player"></div>
                    </div>
                    <button id="next-${res_order}">下一題</button>
                    </div>`;

        // show first dom
        document.querySelector("[data-order = '0']").style.display = 'block';
        res_order += 1;
    }

    prev = document.querySelector('.prev');
    nextOne = document.getElementById('next-0');
    nextTwo = document.getElementById('next-1');
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
    // import record file
    var tag = document.createElement('script');
    tag.src = '/js/online/record.js';
    document.getElementsByTagName('head')[0].appendChild(tag);
})();
