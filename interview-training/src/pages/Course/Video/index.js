import React, { useContext, useCallback, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../../App';

import axios from 'axios';
import './main.scss';
import CountDownTimer from './CountDownTimer';
import { Grid, Button } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VideoCheck from '../VideoCheck';
import ProgressBar from '../ProgressBar';
import Swal from 'sweetalert2';

export default function Video(props) {
  const { Constant } = useContext(AppContext);

  const [stream, setStream] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(false);
  const [question, setQuestion] = React.useState('');
  const [blob, setBlob] = useState(null);

  // Button Choose
  const [start, setStart] = useState(false);
  const [stop, setStop] = useState(true);
  const [check, setCheck] = useState(true);
  const [restart, setRestart] = useState(true);

  const refVideo = useRef(null);
  const startBtn = useRef(null);
  const finishBtn = useRef(null);

  const checkBtn = useRef(null);
  const [progressBarTitleArr, setProgressBarTitleArr] = useState('');

  const [progressBarNumber, setProgressBarNumber] = useState('');
  let timeWarning = useRef(null);
  const [nowQuestionNumber, setNowQuestionNumber] = React.useState(null);
  const display = useRef(null);
  const showAnswerDisplay = useRef(null);
  const recorderRef = useRef(null);
  const countDownDiv = useRef(null);
  let profession = localStorage.getItem('profession');

  const [seconds, setSeconds] = React.useState(null);
  const [changeStatus, setChangeStatus] = React.useState('');
  const [profileQuestion, setProfileQuestion] = React.useState('');
  let isPause = false;

  const handleTimeup = useCallback(() => {
    if (isPause) {
      if (seconds < 1) timeWarning.current.textContent = '時間到';
      if (seconds > 1) timeWarning.current.textContent = '在時間內完成，你真棒！';
    }
  }, []);
  const handleRecording = async () => {
    showAnswerDisplay.current.style.display = 'none';
    display.current.style.display = 'block';
    countDownDiv.current.style.display = 'block';

    setIsCount(true);
    setSeconds(30);

    recorderRef.current.startRecording();

    // Button Choose
    setStart(true);
    setStop(false);
    setAnswerStatus(false);
    setRestart(true);
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      display.current.style.display = 'none';
      showAnswerDisplay.current.style.display = 'block';
      showAnswerDisplay.current.src = window.URL.createObjectURL(recorderRef.current.getBlob());
      setBlob(recorderRef.current.getBlob());
    });

    // display.current.srcObject = false;
    isPause = true;
    clearInterval(seconds);
    handleTimeup();

    // Button Choose
    setCheck(false);
    setStop(true);
  };

  useEffect(() => {
    if (blob) {
      display.current.src = URL.createObjectURL(blob);
      console.log('blob first', blob);
    }
  }, [blob]);

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }
  }, [stream, refVideo]);

  // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
  useEffect((e) => {
    console.log('1. profileQuestion', profileQuestion);

    async function getVideoQuestions() {
      let response = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/exam/progress`,
        params: {
          profession: profession || 'backend',
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      // 2. get question response
      setProfileQuestion(response);
    }
    getVideoQuestions();
  }, []);

  // 2. 如果有數據，找出當前題目並set
  useEffect(
    (e) => {
      if (profileQuestion) {
        // 3. 找出當前題目並set
        setNowQuestion(profileQuestion);
        let progressBarTitle = [];
        profileQuestion['data']['video'].map((e) => {
          progressBarTitle.push(e.title);
        });

        setProgressBarTitleArr(progressBarTitle);
      }
      async function initStream(params) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1920,
            height: 1080,
            frameRate: 30,
          },
          audio: true,
        });

        recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
        display.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
      initStream();
    },
    [profileQuestion]
  );

  useEffect(
    (e) => {
      console.log('changeStatus', changeStatus);
      if (changeStatus) {
        setNowQuestion(changeStatus);
      }
    },
    [changeStatus]
  );

  useEffect(
    (e) => {
      if (nowQuestionNumber) console.log('5. 設定當前題號成功：', nowQuestionNumber);
      // 5. 用當前題號拿到題目
      getNowQuestion(nowQuestionNumber);
    },
    [nowQuestionNumber]
  );

  useEffect(
    (e) => {
      if (question) {
        console.log('question', question);
        setChangeStatus('');
      }
      // getNowQuestion();
    },
    [question]
  );

  useEffect(
    (e) => {
      if (answerStatus) {
        setRestart(false);
        setCheck(true);
        setStart(false);
        startBtn.current.innerText = '重新作答';
      }
    },
    [answerStatus]
  );
  async function handleBack() {
    await Swal.fire({
      title: '前往社群聊聊天吧！',
      icon: 'success',
      confirmButtonText: '立刻前往',
    });
    window.location.href = '/social';
  }

  function setNowQuestion(profileQuestion) {
    if (profileQuestion) {
      console.log('setNowQuestion profileQuestion', profileQuestion);
      // 3.找到尚未完成的題目
      let notFinishedQuestion = profileQuestion.data.video.filter((e) => {
        console.log('e', e);
        return e.status === 0;
      });

      console.log('4. 找到尚未完成題目', notFinishedQuestion);
      if (notFinishedQuestion.length === 0) {
        window.location.href = '/course/code';
      }

      setProgressBarNumber(notFinishedQuestion.length);
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

  const [isCount, setIsCount] = React.useState(true);
  async function stopCountDown() {
    setIsCount(false);
    //setStopNum(remainSecond);
  }

  return (
    <>
      {progressBarTitleArr ? (
        <div style={{ width: '70%', margin: 'auto', marginTop: '3%' }}>
          <ProgressBar title={progressBarTitleArr} num={progressBarNumber} />
        </div>
      ) : null}

      <div ref={timeWarning}></div>
      {question ? (
        <div className="video_container">
          <div className="video_title">
            <h1>{question[0].title}</h1>
          </div>
          <div ref={countDownDiv} style={{ display: 'none' }}>
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
                  setRestart={setRestart}
                  restart={restart}
                  blob={blob}
                />
              </Grid>
            ) : null}
            <Grid item xs={6}>
              <video type="video/webm" autoPlay ref={display} />
              <video type="video/webm" autoPlay controls ref={showAnswerDisplay} style={{ display: 'none' }} />
            </Grid>
          </Grid>
          <Button variant="contained" disabled={start} ref={startBtn} endIcon={<PlayCircleFilledIcon />} onClick={handleRecording} className="video-btn" size="large">
            開始作答
          </Button>
          <Button
            variant="contained"
            endIcon={<StopCircleIcon />}
            onClick={(e) => {
              handleStop();
              stopCountDown();
            }}
            disabled={stop}
            className="video-btn"
            size="large"
            ref={finishBtn}
          >
            完成作答
          </Button>

          <Button
            disabled={check}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={() => {
              setAnswerStatus(true);
            }}
            className="video-btn"
            size="large"
            ref={checkBtn}
          >
            檢視答案
          </Button>
        </div>
      ) : null}
      <Button color="inherit" onClick={handleBack} sx={{ mr: 1, position: 'fixed', bottom: 0, right: 0 }}>
        暫時放棄
      </Button>
    </>
  );
}
