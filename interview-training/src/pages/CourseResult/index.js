import React, { useContext, useCallback, useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import './index.scss';
import axios from 'axios';
// Choose and change
import StepperSection from './components/Stepper';
import Question from './components/Question';
import Prepare from './components/Prepare';

export default function CourseResult() {
    const { Constant } = useContext(AppContext);

    const [stream, setStream] = useState(null);
    const [answerStatus, setAnswerStatus] = useState(false);
    const [question, setQuestion] = React.useState('');
    const [blob, setBlob] = useState(null);
    const refVideo = useRef(null);
    let timeWarning = useRef(null);
    const [nowQuestionNumber, setNowQuestionNumber] = React.useState(null);
    const display = useRef(null);
    const showAnswerDisplay = useRef(null);
    const recorderRef = useRef(null);
    const countDownDiv = useRef(null);
    let nowUserId = localStorage.getItem('userid');
    let jobType = localStorage.getItem('jobType');
    let tmpProfile;
    const [seconds, setSeconds] = React.useState(null);
    const [changeStatus, setChangeStatus] = React.useState('');
    const [profileQuestion, setProfileQuestion] = React.useState('');
    let isPause = false;

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
    return (
        <>
            <Row>
                <Col xs="10" id="code-main">
                    <StepperSection prepare={<Prepare />} question={<Question />} />
                </Col>
            </Row>
        </>
    );
}
