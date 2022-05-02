let codeNow = {};
let codeNowOne;
let codeNowTwo;
let codeNowThree;
let QuestionNow = 0;
let language = 'javascript';
let getQuestionsArr;
let allCodeQuestions;
let nowQuestion;
let nowVideo = '';
let startCounter;
let choosedQuestionID;
let response = '';

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

        // video test content
        document.getElementById('content').innerHTML += `
        <li>${r.title}</li>
        `;

        // video area
        document.getElementById('test-area').innerHTML += `
                    <div id="question-${tmpVarCodeArea}" class="question" data-order="${res_order}-0" style="display:none">
                    <h2>第${res_order + 1}題</h2>
                    <div id="question-${tmpVarCodeArea}-title">${r.title}</div>
                    <div id="question-${tmpVarCodeArea}-description">${r.description}</div>
                    <video id="question-${tmpVarCodeArea}-video" type="video/webm" controls preload src="${r.video}"></video><br>
                    <div style="display:none">倒數計時：<a id="timer">30</a>s</div>
                    <div class="record">
                        <button id="btn-start-recording" onclick="start()">開始回答</button>
                        <button id="btn-pause-recording" style="display: none; font-size: 15px">
                            暫停一下
                        </button>
                        <div style="text-align: center; display: none">
                            <button id="save-to-disk" data-question-id="${r.id}">提交答案</button>
                        </div>
                        <div style="margin-top: 10px" id="recording-player"></div>
                    </div>
                    <button id="next-${res_order}-0" onclick="next(this)">檢視答案</button>
                    </div>
        
                    <!--- 檢視區 --->

                    <div id="review-video-area" class="question" data-order="${res_order}-1" style="display:none">
                    <h2>請檢視以下幾點</h2>
                    <video id="review-video-${res_order}" type="video/webm" controls preload></video>
                    <form action="/action_page.php">
                    <input type="checkbox" id="vehicle1" name="vehicle" value="1" class="messageCheckbox">
                    <label for="vehicle1"> ${r.hint_1}</label><br>
                    <input type="checkbox" id="vehicle2" name="vehicle" value="2" class="messageCheckbox">
                    <label for="vehicle2"> ${r.hint_2}</label><br>
                    <input type="checkbox" id="vehicle3" name="vehicle" value="3" class="messageCheckbox">
                    <label for="vehicle3"> ${r.hint_3}</label><br><br>
            
                    </form>
                    <button id="next-${res_order}-1" onclick="next(this)">沒問題，下一題</button>
                    <button id="prev-${res_order}-0" onclick="prev(this)">還可以更好，再試一次</button>
                    
                    `;

        // show first dom
        document.querySelector("[data-order = '0-0']").style.display = 'block';
        res_order += 1;
    }

    nextOne = document.getElementById('next-0-0');
    nextTwo = document.getElementById('next-1-1');

    // import record file
    var tag = document.createElement('script');
    tag.src = '/js/online/record.js';
    document.getElementsByTagName('head')[0].appendChild(tag);
})();

async function next(e) {
    if (!nowVideo) {
        alert('請先做題');
        return;
    }
    let nowID = e.getAttribute('id');
    let sendAnswer;
    if (nowID == 'next-0-0') {
        document.querySelector("[data-order = '0-0']").style.display = 'none';
        document.querySelector("[data-order = '0-1']").style.display = 'block';
        console.log('nowVideo', nowVideo);
        if (nowVideo) {
            document.getElementById('review-video-0').src = `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/${nowVideo}`;
            localStorage.setItem('video-answer-0', `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/${nowVideo}`);
        }
    }
    if (nowID == 'next-0-1') {
        document.querySelector("[data-order = '0-1']").style.display = 'none';
        document.querySelector("[data-order = '1-0']").style.display = 'block';
        let checkboxes = document.querySelectorAll('input[name="vehicle"]:checked');
        let output = [];
        checkboxes.forEach((checkbox) => {
            output.push(checkbox.value);
        });
        console.log('checked', output);
        sendAnswer = await axios.post('/api/1.0/training/video/submit/compile', {
            videoAnswer: localStorage.getItem('video-answer-0'),
            checked: output,
        });
    }
    if (nowID == 'next-1-0') {
        document.querySelector("[data-order = '1-0']").style.display = 'none';
        document.querySelector("[data-order = '1-1']").style.display = 'block';
        if (nowVideo) {
            document.getElementById('review-video-1').src = `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/${nowVideo}`;
            localStorage.setItem('video-answer-1', `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/${nowVideo}`);
        }
    }
}

function prev(e) {
    let nowID = e.getAttribute('id');
    if (nowID == 'prev-0-0') {
        document.querySelector("[data-order = '0-1']").style.display = 'none';
        document.querySelector("[data-order = '0-0']").style.display = 'block';
        document.getElementById('success-send').remove();
        clearInterval(startCounter);
        document.querySelector('#timer').innerText = 30;
    }
    if (nowID == 'prev-1-0') {
        document.querySelector("[data-order = '1-1']").style.display = 'none';
        document.querySelector("[data-order = '1-0']").style.display = 'block';
        document.getElementById('success-send').remove();
        clearInterval(startCounter);
        document.querySelector('#timer').textContent = 30;
    }
}
