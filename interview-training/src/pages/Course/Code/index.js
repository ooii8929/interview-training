import React, { useState, useRef, useContext } from 'react';
import { AppContext } from '../../../App';
import axios from 'axios';
import { Box, Grid, Button } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VideoCheck from '../VideoCheck';
import Accordion from './components/accordion';
import './index.scss';
import { useNavigate } from 'react-router-dom';

import CodeEditor from '@uiw/react-textarea-code-editor';
let response;
export default function Video(props) {
    const { Constant } = useContext(AppContext);

    let navigate = useNavigate();
    let userId = sessionStorage.getItem('userid');
    const [userCodeLogs, setUserCodeLogs] = React.useState(null);
    const [questionID, setQuestionID] = React.useState(null);

    let jobType = sessionStorage.getItem('jobType');
    const [profileQuestion, setProfileQuestion] = React.useState('');
    let languages = ['javascript', 'python'];
    const [answerStatus, setAnswerStatus] = useState(false);
    const [question, setQuestion] = React.useState('');
    const [code, setCode] = React.useState(null);
    const [runCodeResponse, setRunCodeResponse] = React.useState(null);

    const [nowQuestionNumber, setNowQuestionNumber] = React.useState(null);
    const defaultLanguage = 'javascript';
    const [language, setLanguage] = React.useState(defaultLanguage);
    const isInitialMount = React.useRef(true);

    const shareBtn = useRef(null);
    const [runCodeResponseInput, setRunCodeResponseInput] = React.useState(null);
    const [runCodeResponseOutput, setRunCodeResponseOutput] = React.useState(null);
    const [runCodeResponseExpect, setRunCodeResponseExpect] = React.useState(null);
    const [changeStatus, setChangeStatus] = React.useState('');

    const [runCodeResponseStatus, setRunCodeResponseStatus] = React.useState(null);

    // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
    React.useEffect((e) => {
        async function getCodeQuestions() {
            userId = sessionStorage.getItem('userid');
            jobType = sessionStorage.getItem('jobType');

            let response = await axios.get(`${Constant}/training/profile/questions`, {
                params: {
                    profession: jobType || 'backend',
                    userID: userId,
                },
            });
            console.log('1. get question response', response);

            setProfileQuestion(response);
        }
        getCodeQuestions();
    }, []);

    // 2. 如果有數據，找出當前題目並set
    React.useEffect(
        (e) => {
            if (profileQuestion) {
                console.log('2. 找出當前題目並set', profileQuestion);
                setNowQuestion(profileQuestion);
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

    async function getUserCodeLog(questionID) {
        let codeLog = await axios.get(`${Constant}/user/code/log`, {
            params: {
                question_id: questionID,
                user_id: userId,
            },
        });
        setUserCodeLogs(codeLog.data);
    }
    // submit answer
    async function submitAnswer(e) {
        response = await axios.post(`${Constant}/training/submit/compile/`, {
            user_id: userId,
            question_id: profileQuestion.data._id,
            qid: nowQuestionNumber,
            content: code,
            language: language,
        });
        console.log('submitAnswer response', response);
        setRunCodeResponse(response['data']);
        if (response['data']['answer_status'] == -1) {
            setRunCodeResponseStatus('Fail');
        } else {
            setRunCodeResponseStatus('Success');
        }
        setRunCodeResponseInput(response['data']['input']);
        setRunCodeResponseOutput(response['data']['output']);
        setRunCodeResponseExpect(response['data']['except']);
        await getUserCodeLog(questionID);
    }

    function nextQuestion() {
        navigate(0);
    }

    async function runCode() {
        try {
            response = await axios.post(`${Constant}/training/run/compile`, {
                question_id: questionID,
                language: language,
                content: code,
            });
            console.log('run code response', response);
            setRunCodeResponse(response['data']);
            if (response['data']['answer_status'] == -1) {
                setRunCodeResponseStatus('Fail');
            } else {
                setRunCodeResponseStatus('Success');
            }
            setRunCodeResponseInput(response['data']['input']);
            setRunCodeResponseOutput(response['data']['output']);
            setRunCodeResponseExpect(response['data']['except']);
        } catch (error) {
            console.error(error);
        }
    }

    function setNowQuestion(profileQuestion) {
        if (profileQuestion) {
            // 3.找到尚未完成的題目
            let notFinishedQuestion = profileQuestion.data.code.filter((e) => {
                console.log('e', e);
                return e.status == 0;
            });
            console.log('3. 找到尚未完成題目', notFinishedQuestion);
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
            // getNowQuestion();
        },
        [question]
    );

    React.useEffect(
        (e) => {
            console.log('changeStatus', changeStatus);
            if (changeStatus) {
                setNowQuestion(changeStatus);
            }
        },
        [changeStatus]
    );

    async function shareAnswer(n) {
        try {
            response = await axios.post(`${Constant}/article/code`, {
                user_id: userId,
                question_id: questionID,
                code: code,
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
            shareBtn.current.textContent = '分享成功';
            shareBtn.current.disabled = true;
            await getUserCodeLog(questionID);
        }
    }

    return (
        <>
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
                                <CodeEditor
                                    value={code}
                                    language={language}
                                    placeholder="Please enter JS code."
                                    onChange={(evn) => setCode(evn.target.value)}
                                    padding={15}
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
                            <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                                <Grid item xs={1} className="runcode-result-label">
                                    <p>測試結果</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div> {runCodeResponseStatus}</div>
                                </Grid>
                                <Grid item xs={1} className="runcode-result-label">
                                    <p>測試數據</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div>{runCodeResponseInput}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                                <Grid item xs={1} className="runcode-result-label">
                                    <p>期待答案</p>
                                </Grid>
                                <Grid item xs={4} className="runcode-result">
                                    <div>{runCodeResponseExpect}</div>
                                </Grid>
                                <Grid item xs={1} className="runcode-result-label">
                                    <p>你的答案</p>
                                </Grid>

                                <Grid item xs={4} className="runcode-result">
                                    <div>{runCodeResponseOutput}</div>
                                </Grid>
                            </Grid>
                        </>
                    ) : null}

                    <Button
                        endIcon={<PlayCircleFilledIcon />}
                        size="large"
                        variant="contained"
                        className="run-answer"
                        data-question={question[0].qid}
                        sx={{ mt: 1, mr: 1 }}
                        onClick={runCode}
                    >
                        跑看看
                    </Button>
                    <Button
                        endIcon={<StopCircleIcon />}
                        size="large"
                        variant="contained"
                        className="run-answer"
                        data-question={question[0].qid}
                        onClick={submitAnswer}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        提交答案
                    </Button>
                    <Button variant="contained" endIcon={<SendIcon />} className="run-answer" size="large" onClick={nextQuestion} sx={{ mt: 1, mr: 1 }}>
                        前往下一題
                    </Button>
                    <Button variant="contained" ref={shareBtn} endIcon={<SendIcon />} className="run-answer" size="large" onClick={shareAnswer} sx={{ mt: 1, mr: 1 }}>
                        分享社群
                    </Button>
                    {answerStatus ? (
                        <VideoCheck
                            check={question[0].check}
                            setChangeStatus={setChangeStatus}
                            profileQuestion={profileQuestion}
                            nowQuestionNumber={nowQuestionNumber}
                            setAnswerStatus={setAnswerStatus}
                        />
                    ) : null}
                    <div className="user-log-container">
                        <h3>過往答題紀錄</h3>
                        {userCodeLogs ? <Accordion userLogs={userCodeLogs} /> : null}
                    </div>
                </div>
            ) : null}
        </>
    );
}
