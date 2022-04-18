let codeNowGolang;
let codeNowOne;
let codeNowTwo;
let codeNowThree;
let QuestionNow;

let test = (function getQuestions() {
    console.log('start');
    axios
        .get('/api/1.0/training/javascript')
        .then(function (response) {
            res = response.data.questions;
            console.log('response.data', response.data);
            // First Question
            document.querySelector('#question-one-title').innerText = res[0][0].title;
            document.querySelector('#question-one-description').innerText = res[0][0].description;
            codeNowOne = res[0][0].code;
            document.querySelector('#question-one-video').setAttribute('src', res[0][0].video);
            document.querySelector('#save-to-disk').setAttribute('data-question-id', res[0][0].id);

            // Second Question
            document.querySelector('#question-two-title').innerText = res[0][1].title;
            document.querySelector('#question-two-description').innerText = res[0][1].description;
            codeNowTwo = res[0][1].code;

            // Third Question
            document.querySelector('#question-three-title').innerText = res[0][2].title;
            document.querySelector('#question-three-description').innerText = res[0][2].description;
            codeNowThree = res[0][2].code;

            // handle success
            console.log(response);
            var tag = document.createElement('script');
            tag.src = '../codemirror/editor.bundle.js';
            document.getElementsByTagName('head')[0].appendChild(tag);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
})();

function sendJavascriptAnswer() {
    let codeSend;
    if (QuestionNow == 2) {
        codeSend = codeNowTwo;
        QuestionNumString = 'codeNowTwo';
    }

    if (QuestionNow == 3) {
        codeSend = codeNowThree;
        QuestionNumString = 'codeNowThree';
    }

    axios
        .post('/api/1.0/training/javascript', {
            content: codeSend,
        })
        .then(function (response) {
            // handle success

            document.querySelector(`#answer-${QuestionNumString}`).innerText = response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

const firstQuestion = document.getElementById('question-one');
const secondQuestion = document.getElementById('question-two');
const thirdQuestion = document.getElementById('question-three');

secondQuestion.style.display = 'none';
thirdQuestion.style.display = 'none';

const prev = document.querySelector('.prev');
const nextOne = document.getElementById('next-one');
const nextTwo = document.getElementById('next-two');

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
