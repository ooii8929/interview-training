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
                    <video id="question-${tmpVarCodeArea}-video" type="video/webm" controls preload src="${r.video}"></video>
<div id="timer">
  30
</div>
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
                    <button id="next-${res_order}-${res_order}" onclick="next(this)">檢視答案</button>
                    </div>`;

        // show first dom
        document.querySelector("[data-order = '0-0']").style.display = 'block';
        res_order += 1;
    }

    prev = document.querySelector('.prev');

    nextOne = document.getElementById('next-0-0');
    nextTwo = document.getElementById('next-1-1');
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
function next(e) {
    let nowID = e.getAttribute('id');
    if (nowID == 'next-0-0') {
        document.querySelector("[data-order = '0-0']").style.display = 'none';
        document.getElementById('test-area').innerHTML += `
            <div id="review-video-area" class="question" data-order="0-1">
            <h2>請檢視以下幾點</h2>
            <video id="review-video" type="video/webm" controls preload src="https://interview-appworks.s3.ap-northeast-1.amazonaws.com/${nowVideo}"></video>
            <form action="/action_page.php">
            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
            <label for="vehicle1"> 你的基本資料是否有在10秒內完成，並有記憶點？(例如，海上韭菜)</label><br>
            <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
            <label for="vehicle2"> 是否有用過去經驗展示人格特質</label><br>
            <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
            <label for="vehicle3"> 有沒有提到你對這份工作的嚮往</label><br><br>
            <input type="submit" value="Submit">
            </form>
            `;
        console.log('0-0');
    }
    if (nowID == 'next-0-1') {
        console.log('0-1');
    }
    if (nowID == 'next-1-0') {
        console.log('1-0');
    }
    if (nowID == 'next-1-1') {
        console.log('1-1');
    }
}
