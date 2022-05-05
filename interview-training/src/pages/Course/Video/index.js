import React, { useContext, useCallback, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../../App';

import { getFileName } from './utils/index';
import axios from 'axios';
import './main.scss';
import CountDownTimer from './CountDownTimer';
import CountDown from './CountDown';
import { Grid, Button } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VideoCheck from '../VideoCheck';
export default function Video(props) {
    const { Constant } = useContext(AppContext);

    const [stream, setStream] = useState(null);
    const [answerStatus, setAnswerStatus] = useState(false);
    const [question, setQuestion] = React.useState('');
    const [blob, setBlob] = useState(null);
    const refVideo = useRef(null);
    let timeWarning = useRef(null);
    const [nowQuestionNumber, setNowQuestionNumber] = React.useState(null);
    const display = useRef(null);
    const recorderRef = useRef(null);
    let nowUserId = localStorage.getItem('userid');
    let jobType = localStorage.getItem('jobType');
    let tmpProfile;
    const [seconds, setSeconds] = React.useState(null);
    const [changeStatus, setChangeStatus] = React.useState('');
    const [profileQuestion, setProfileQuestion] = React.useState('');
    let isPause = false;

    const handleTimeup = useCallback(() => {
        console.log('time up!!');
        if (isPause) {
            if (seconds < 1) timeWarning.current.textContent = '時間到';
            if (seconds > 1) timeWarning.current.textContent = '在時間內完成，你真棒！';
        }
    }, []);
    const handleRecording = async () => {
        // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 1920,
                height: 1080,
                frameRate: 30,
            },
            audio: false,
        });
        setSeconds(30);
        setStream(mediaStream);
        recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
        display.current.srcObject = mediaStream;
        recorderRef.current.startRecording();
    };

    const handleStop = () => {
        recorderRef.current.stopRecording(() => {
            console.log('recorderRef.current.getBlob()', recorderRef.current.getBlob());
            setBlob(recorderRef.current.getBlob());
        });

        // display.current.srcObject = false;
        isPause = true;
        clearInterval(seconds);
        handleTimeup();
    };

    useEffect(() => {
        if (blob) {
            display.current.src = URL.createObjectURL(blob);
        }
    }, [blob]);

    const handleSave = async () => {
        var file = new File([blob], getFileName('webm'), {
            type: 'video/webm',
        });

        try {
            let presignedUrl = await axios.get(`${Constant[0]}/training/video/answer/url`, {
                params: {
                    filename: file.name,
                },
            });
            let success = await axios.put(presignedUrl['data'], file, {
                headers: { 'Content-Type': 'video/webm' },
            });

            console.log('success file name', success.config.data.name);

            tmpProfile = profileQuestion;
            console.log('提交答案');
            console.log('tmpProfile', tmpProfile);
            let data = {
                user_id: nowUserId,
                question_id: tmpProfile.data._id,
                qid: nowQuestionNumber,
                answer_url: `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/` + success.config.data.name,
            };
            console.log('data', data);
            let submitAnswer = await axios.post(`${Constant[0]}/training/video/answer`, data);
            // tmpProfile.data.video.filter((e) => {
            //   console.log("e", e);
            //   if (e.qid == nowQuestionNumber) {
            //     e.answer_url =
            //       `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/` +
            //       success.config.data.name;
            //     e.status = 1;
            //   }
            //   console.log("tmpProfile after", submitAnswer);
            // });
            console.log('tmpProfile after', submitAnswer);
            setAnswerStatus(true);
        } catch (error) {
            console.log(error);
        }

        // invokeSaveAsDialog(blob);
    };

    useEffect(() => {
        if (!refVideo.current) {
            return;
        }
    }, [stream, refVideo]);

    // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
    React.useEffect((e) => {
        console.log('1. profileQuestion', profileQuestion);

        async function getVideoQuestions() {
            nowUserId = localStorage.getItem('userid');
            jobType = localStorage.getItem('jobType');

            let response = await axios.get(`${Constant[0]}/training/profile/questions`, {
                params: {
                    profession: jobType || 'backend',
                    userID: nowUserId,
                },
            });
            console.log('2. get question response', response);
            setProfileQuestion(response);
        }
        getVideoQuestions();
    }, []);

    // 2. 如果有數據，找出當前題目並set
    React.useEffect(
        (e) => {
            console.log('profileQuestion return page', profileQuestion);
            if (profileQuestion) {
                console.log('3. 找出當前題目並set', profileQuestion);
                setNowQuestion(profileQuestion);
                console.log('setNowQuestion after axios');
            }
        },
        [profileQuestion]
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

    React.useEffect(
        (e) => {
            if (nowQuestionNumber) console.log('5. 設定當前題號成功：', nowQuestionNumber);
            // 5. 用當前題號拿到題目
            getNowQuestion(nowQuestionNumber);
        },
        [nowQuestionNumber]
    );

    React.useEffect(
        (e) => {
            if (question) {
                console.log('question', question);
                setChangeStatus('');
            }
            // getNowQuestion();
        },
        [question]
    );

    function setNowQuestion(profileQuestion) {
        if (profileQuestion) {
            console.log('setNowQuestion profileQuestion', profileQuestion);
            // 3.找到尚未完成的題目
            let notFinishedQuestion = profileQuestion.data.video.filter((e) => {
                console.log('e', e);
                return e.status == 0;
            });
            console.log('4. 找到尚未完成題目', notFinishedQuestion);
            if (notFinishedQuestion.length == 0) {
                window.location.href = '/course/code';
            }
            // 4. 如果有，設定題號
            if (notFinishedQuestion) setNowQuestionNumber(notFinishedQuestion[0]['qid']);
        }
    }

    function getNowQuestion(nowQuestionNumber) {
        if (profileQuestion) {
            let nowQuestion = profileQuestion.data.video.filter((e) => {
                return e.qid === nowQuestionNumber;
            });
            console.log('6. 得到當前題目', nowQuestion);
            setQuestion(nowQuestion);
        }
    }
    // <Grid item xs={6}>
    //     {answerStatus ? (
    //         <VideoCheck
    //             check={question[0].check}
    //             setChangeStatus={setChangeStatus}
    //             profileQuestion={profileQuestion}
    //             nowQuestionNumber={nowQuestionNumber}
    //             setAnswerStatus={setAnswerStatus}
    //         />
    //     ) : (
    //         <video type="video/webm" controls preload src={question[0].video_url} />
    //     )}
    // </Grid>;

    const [isCount, setIsCount] = React.useState(true);
    async function stopCountDown() {
        setIsCount(false);
        //setStopNum(remainSecond);
    }

    return (
        <>
            <div ref={timeWarning}></div>
            {question ? (
                <div className="video_container">
                    <div className="video_title">
                        <h1>{question[0].title}</h1>
                    </div>
                    <div>
                        <CountDownTimer seconds={seconds} onTimeUp={handleTimeup} className="countTime" isCount={isCount} setIsCount={setIsCount} />
                    </div>

                    <Grid container spacing={2} col={{ xs: 12 }} className="display-video">
                        {answerStatus ? (
                            <Grid item xs={6}>
                                <VideoCheck
                                    check={question[0].check}
                                    setChangeStatus={setChangeStatus}
                                    profileQuestion={profileQuestion}
                                    nowQuestionNumber={nowQuestionNumber}
                                    setAnswerStatus={setAnswerStatus}
                                />
                            </Grid>
                        ) : null}
                        <Grid item xs={6}>
                            <video type="video/webm" autoPlay ref={display} />
                        </Grid>
                    </Grid>
                    <Button variant="contained" endIcon={<PlayCircleFilledIcon />} onClick={handleRecording} className="video-btn" size="large">
                        開始作答
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<StopCircleIcon />}
                        onClick={(e) => {
                            handleStop();
                            stopCountDown();
                        }}
                        className="video-btn"
                        size="large"
                    >
                        完成作答
                    </Button>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handleSave} className="video-btn" size="large">
                        提交答案
                    </Button>
                </div>
            ) : null}
        </>
    );
}
