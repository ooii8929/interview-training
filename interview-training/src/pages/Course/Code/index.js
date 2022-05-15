import React, { useState, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { Grid, Button } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VideoCheck from '../VideoCheck';
import Accordion from './components/accordion';
import './index.scss';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CodeEditor from '@uiw/react-textarea-code-editor';
import CountDownTimer from './components/CountDownTimer';
import CountDownTimerAnswer from './components/CountDownTimerAnswer';
import ProgressBar from '../ProgressBar';

let response;
let isPause = false;

export default function Video(props) {
    // Progress Bar
    const [progressBarTitleArr, setProgressBarTitleArr] = useState('');

    const [progressBarNumber, setProgressBarNumber] = useState('');

    // Button Choose
    const [startBtn, setStartBtn] = useState(false);
    const [answerBtn, setAnswerBtn] = useState(false);
    const [nextBtn, setNextBtn] = useState(true);

    // Backbard
    const [open, setOpen] = React.useState(false);
    const [randomFun, setRandomFun] = React.useState(1);
    const loadingFun = [
        '你知道嗎？在非洲，每一分鐘，就有６０秒過去',
        '你知道嗎？車子貼baby in car 是為了事故時讓救護人員救援時特別注意到',
        '你知道嗎？7-ELEVEn的最後一個n是小寫唷！',
        '你知道嗎？加拿大有一座北極熊的專屬監獄。\r\n如果北極熊闖入民宅偷吃食物被抓到，就會被抓去坐牢。',
    ];
    const loadingFunImg = ['', '', '', 'https://i1.wp.com/animal-friendly.co/wp-content/uploads/2019/08/jail3.jpg?w=1392&ssl=1'];
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    let navigate = useNavigate();
    const location = useLocation();

    const [userCodeLogs, setUserCodeLogs] = React.useState(null);
    const [questionID, setQuestionID] = React.useState(null);

    let profession = localStorage.getItem('profession');
    let userId = localStorage.getItem('userid');

    const [profileQuestion, setProfileQuestion] = React.useState('');
    let languages = ['javascript', 'python'];
    const [answerStatus, setAnswerStatus] = useState(false);
    const [question, setQuestion] = React.useState('');
    const [code, setCode] = React.useState(null);
    const [runCodeResponse, setRunCodeResponse] = React.useState(null);

    const [nowQuestionNumber, setNowQuestionNumber] = React.useState(null);
    const defaultLanguage = 'javascript';
    const [language, setLanguage] = React.useState(defaultLanguage);
    const isInitialMount = useRef(true);
    const resultTest = useRef(null);

    const [endQuestion, setEndQuestion] = React.useState(false);

    const [runCodeResponseInput, setRunCodeResponseInput] = React.useState(null);
    const [runCodeResponseOutput, setRunCodeResponseOutput] = React.useState(null);
    const [runCodeResponseExpect, setRunCodeResponseExpect] = React.useState(null);
    const [changeStatus, setChangeStatus] = React.useState('');

    const [runCodeResponseStatus, setRunCodeResponseStatus] = React.useState(null);

    // Answer Area
    const [waitAnswer, setWaitAnswer] = React.useState(false);
    const countDownDiv = useRef(null);
    const countDownDivAnswer = useRef(null);
    const [seconds, setSeconds] = React.useState(null);
    const [isCount, setIsCount] = React.useState(true);
    const [answerIsCount, setAnswerIsCount] = React.useState(true);

    // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
    React.useEffect((e) => {
        async function getCodeQuestions() {
            try {
                let response = await axios({
                    withCredentials: true,
                    method: 'GET',
                    credentials: 'same-origin',
                    url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/profile/questions`,
                    params: {
                        profession: profession || 'backend',
                        userID: userId,
                    },
                    headers: { 'Access-Control-Allow-Origin': 'process.env.REACT_APP_BASE_URL', 'Content-Type': 'application/json' },
                });
                console.log('1. get question response', response);

                setProfileQuestion(response);
            } catch (error) {
                await Swal.fire({
                    title: `錯誤代碼${error.response.status}`,
                    text: `${error.response.data.error}`,
                    icon: 'error',
                    confirmButtonText: '立刻登入',
                });
                localStorage.setItem('returnPage', location.pathname);
                navigate('/login');
            }
        }
        getCodeQuestions();
    }, []);

    // 2. 如果有數據，找出當前題目並set
    React.useEffect(
        (e) => {
            if (profileQuestion) {
                console.log('2. 找出當前題目並set', profileQuestion);
                setNowQuestion(profileQuestion);
                let progressBarTitle = [];
                profileQuestion['data']['code'].map((e) => {
                    progressBarTitle.push(e.title);
                });
                console.log('progressBarTitle', progressBarTitle);
                setProgressBarTitleArr(progressBarTitle);
            }
        },
        [profileQuestion]
    );

    React.useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            console.log('run code by language , response => ', question);
            console.log('run code by language', language);
            // Your useEffect code here to be run on update
            setCode(question[0][`${language}_question`]);
        }
    }, [language]);

    React.useEffect(() => {
        if (runCodeResponseStatus === 'Fail') {
            resultTest.current.style.color = 'red';
        }
        if (runCodeResponseStatus === 'Success') {
            resultTest.current.style.color = 'green';
        }
    }, [runCodeResponseStatus]);

    async function getUserCodeLog(questionID) {
        let codeLog = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/code/log`, {
            params: {
                question_id: questionID,
                user_id: userId,
            },
        });
        console.log('codeLog', codeLog);
        setUserCodeLogs(codeLog.data);
    }
    // submit answer
    async function submitAnswer(e) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        setRandomFun(getRandomInt(4));
        handleToggle();
        try {
            response = await axios({
                withCredentials: true,
                method: 'POST',
                credentials: 'same-origin',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/submit/compile/`,
                data: {
                    user_id: userId,
                    question_id: profileQuestion.data._id,
                    qid: nowQuestionNumber,
                    content: code,
                    language: language,
                },
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });

            handleClose();
            console.log('submitAnswer response', response);
            setRunCodeResponse(response['data']);
            if (response['data']['answer_status'] === -1) {
                await Swal.fire({
                    title: '答錯了拉...',
                    text: '再想一下，想清楚，好嗎？',
                    icon: 'error',
                    confirmButtonText: '再試一次',
                });

                setRunCodeResponseStatus('Fail');
            } else if (response['data']['answer_status'] === 1) {
                await Swal.fire({
                    title: '成功了！！！',
                    text: '太棒了！再往下一題邁進吧',
                    icon: 'success',
                    confirmButtonText: '查看結果',
                });

                setRunCodeResponseStatus('Success');
            } else {
                await Swal.fire({
                    title: '未知問題',
                    icon: 'error',
                    confirmButtonText: '再試一次',
                });
            }
            setRunCodeResponseInput(response['data']['input']);
            setRunCodeResponseOutput(response['data']['output']);
            setRunCodeResponseExpect(response['data']['except']);
            console.log('questionID', questionID);
            await getUserCodeLog(questionID);

            // count down
            setSeconds(6);
            setAnswerBtn(true);
            setAnswerIsCount(true);
            countDownDivAnswer.current.style.display = 'block ';
            setNextBtn(false);
        } catch (error) {
            handleClose();
            await Swal.fire({
                title: `錯誤代碼${error.response.status}`,
                text: `${error.response.data.error}`,
                icon: 'error',
                confirmButtonText: '再修改看看',
            });
        }
    }

    function nextQuestion() {
        if (endQuestion) {
            window.location.href = '/course/result';
        } else {
            navigate(0);
        }
    }

    async function runCode() {
        try {
            setRandomFun(getRandomInt(4));
            handleToggle();
            response = await axios({
                withCredentials: true,
                method: 'POST',
                credentials: 'same-origin',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/run/compile`,
                data: {
                    question_id: questionID,
                    language: language,
                    content: code,
                },
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });
            handleClose();

            if (response.data.code === 137) {
                await Swal.fire({
                    title: '錯誤代碼137',
                    text: '可能是無窮迴圈、記憶體耗盡',
                    icon: 'error',
                    confirmButtonText: '再修改看看',
                });
                response['data']['answer_status'] = -1;
            }
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }

            setRunCodeResponse(response['data']);
            if (response['data']['answer_status'] === 1) {
                setRunCodeResponseStatus('Success');
            } else {
                setRunCodeResponseStatus('Fail');
            }

            setRunCodeResponseInput(response['data']['input']);
            setRunCodeResponseOutput(response['data']['output']);
            setRunCodeResponseExpect(response['data']['except']);

            // count down
            setSeconds(5);
            setStartBtn(true);
            setIsCount(true);
            countDownDiv.current.style.display = 'block ';
        } catch (error) {
            console.error(error);
        }
    }

    const handleTimeup = useCallback(() => {
        console.log('time up!!');
        setStartBtn(false);
        setIsCount(false);
        countDownDiv.current.style.display = 'none ';
    }, []);

    const handleTimeupAnswer = useCallback(() => {
        console.log('time up!!');
        setAnswerBtn(false);
        setAnswerIsCount(false);
        countDownDivAnswer.current.style.display = 'none';
    }, []);

    async function setNowQuestion(profileQuestion) {
        if (profileQuestion) {
            // 3.找到尚未完成的題目
            let notFinishedQuestion = profileQuestion.data.code.filter((e) => {
                console.log('e', e);
                return e.status === 0;
            });
            console.log('3. 找到尚未完成題目', notFinishedQuestion);
            // 如果題目都完成了，跳轉到結果頁
            if (notFinishedQuestion.length === 1) {
                localStorage.setItem('question_id', profileQuestion.data._id);
                setEndQuestion(true);
            }
            setProgressBarNumber(notFinishedQuestion.length);
            if (notFinishedQuestion.length === 0) {
                // 發送答題結束的req

                let endQuestionResponse = await axios({
                    withCredentials: true,
                    method: 'POST',
                    credentials: 'same-origin',
                    url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/end`,
                    data: {
                        user_id: userId,
                        question_id: profileQuestion.data._id,
                    },
                    headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
                });

                localStorage.setItem('question_id', profileQuestion.data._id);
                window.location.href = '/course/result';
            }
            // 4. 如果有，設定題號
            if (notFinishedQuestion) setNowQuestionNumber(notFinishedQuestion[0]['qid']);
        }
    }
    // 5.設定當前題號
    React.useEffect(
        (e) => {
            if (nowQuestionNumber) console.log('5. 設定當前題號成功：', nowQuestionNumber);
            // 5. 用當前題號拿到題目
            getNowQuestion(nowQuestionNumber);
        },
        [nowQuestionNumber]
    );

    // React.useEffect(
    //     (e) => {
    //         if (waitAnswer) {
    //             // set answer cannot click
    //             setAnswerBtn(true);
    //             // wait 20 s
    //             setTimeout(function () {
    //                 // set wait false
    //                 setWaitAnswer(false);
    //                 setAnswerBtn(false);
    //             }, 20000);
    //         }
    //     },
    //     [waitAnswer]
    // );

    // 6.用題號得到當前題目
    function getNowQuestion(nowQuestionNumber) {
        if (profileQuestion) {
            let nowQuestion = profileQuestion.data.code.filter((e) => {
                return e.qid === nowQuestionNumber;
            });
            console.log('6. 得到當前題目', nowQuestion);
            setQuestion(nowQuestion);
        }
    }

    // 7.當前題目為question
    React.useEffect(
        (e) => {
            if (question) {
                console.log('question', question);
                setQuestionID(question[0]['qid']);

                setCode(question[0][`${language}_question`]);
            }
        },
        [question]
    );

    //  <div className="user-log-container">
    //      {userCodeLogs ? (
    //          <>
    //              <h3>過往答題紀錄</h3>
    //              <Accordion userLogs={userCodeLogs} />
    //          </>
    //      ) : null}
    //  </div>;

    React.useEffect(
        (e) => {
            if (changeStatus) {
                setNowQuestion(changeStatus);
            }
        },
        [changeStatus]
    );

    return (
        <>
            {progressBarTitleArr ? (
                <div style={{ width: '70%', margin: 'auto', marginTop: '3%' }}>
                    <ProgressBar title={progressBarTitleArr} num={progressBarNumber} />
                </div>
            ) : null}
            {question ? (
                <div className="code_container">
                    <div className="code_title">
                        <h1>{question[0].title}</h1>
                    </div>

                    <Grid container spacing={2} col={{ xs: 12 }} className="code-content-container">
                        <Grid item xs={6} className="code-description-container">
                            <div dangerouslySetInnerHTML={{ __html: question[0].description }}></div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="ControlsBox">
                                <select onChange={(e) => setLanguage(e.target.value)}>
                                    {languages.map((theme, index) => {
                                        return (
                                            <option key={index} value={theme}>
                                                {theme}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <div>{question.title}</div>
                                <div className="w-tc-editor-var"> </div>
                                <CodeEditor
                                    value={code}
                                    language={language}
                                    placeholder="Please enter JS code."
                                    onChange={(evn) => setCode(evn.target.value)}
                                    padding={15}
                                    className="codeeditor"
                                    style={{
                                        minHeight: '60vh',
                                        fontSize: 16,
                                        backgroundColor: '#161b22',
                                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                    }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    {runCodeResponse ? (
                        <>
                            <Grid container columns={{ md: 12 }} className="runcode-container">
                                <Grid item className="runcode-result-label">
                                    <p>測試結果</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div>
                                        <p ref={resultTest}>{runCodeResponseStatus}</p>
                                    </div>
                                </Grid>
                                <Grid item className="runcode-result-label">
                                    <p>測試數據</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div>
                                        <p>{runCodeResponseInput}</p>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container columns={{ md: 12 }} className="runcode-container">
                                <Grid item className="runcode-result-label">
                                    <p>期待答案</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div>
                                        <p>{runCodeResponseExpect} </p>
                                    </div>
                                </Grid>
                                <Grid item className="runcode-result-label">
                                    <p>你的答案</p>
                                </Grid>

                                <Grid item xs={4} className="runcode-result">
                                    <div>
                                        <p>{runCodeResponseOutput} </p>
                                    </div>
                                </Grid>
                            </Grid>
                        </>
                    ) : null}
                    <div style={{ marginTop: '2%' }} className="btn-div">
                        <Button
                            endIcon={<PlayCircleFilledIcon />}
                            size="large"
                            variant="contained"
                            className="run-answer"
                            data-question={question[0].qid}
                            sx={{ mt: 1, mr: 1 }}
                            onClick={runCode}
                            disabled={startBtn}
                        >
                            <span className="btn-text">跑看看</span>
                            <div ref={countDownDiv} style={{ display: 'none' }} className="count-num">
                                <CountDownTimer seconds={seconds} onTimeUp={handleTimeup} className="countTime" isCount={isCount} setIsCount={setIsCount} />
                            </div>
                        </Button>

                        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                            <CircularProgress color="inherit" />
                            <div className="loading-div">
                                {loadingFunImg[randomFun] ? (
                                    <>
                                        <img src={`${loadingFunImg[randomFun]}`} className="loading-image" /> <br />
                                    </>
                                ) : null}

                                <span className="fun-div">{loadingFun[randomFun]}</span>
                            </div>
                        </Backdrop>
                        <Button
                            endIcon={<StopCircleIcon />}
                            disabled={answerBtn}
                            size="large"
                            variant="contained"
                            className="run-answer"
                            data-question={question[0].qid}
                            onClick={submitAnswer}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            <span className="btn-text">提交答案</span>
                            <div ref={countDownDivAnswer} style={{ display: 'none' }} className="count-num">
                                <CountDownTimerAnswer seconds={seconds} onTimeUp={handleTimeupAnswer} className="countTime" isCount={answerIsCount} setIsCount={setAnswerIsCount} />
                            </div>
                        </Button>

                        <Button disabled={nextBtn} variant="contained" endIcon={<SendIcon />} className="run-answer" size="large" onClick={nextQuestion} sx={{ mt: 1, mr: 1 }}>
                            <span className="btn-text">前往下一題</span>
                        </Button>
                    </div>
                </div>
            ) : null}
        </>
    );
}
