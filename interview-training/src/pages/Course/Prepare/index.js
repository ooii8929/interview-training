import Introduce from './introduce';
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import './main.scss';
import { Grid, Stack } from '@mui/material';
import axios from 'axios';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Swal from 'sweetalert2';

export default function Prepare() {
    let location = useLocation();
    const { jobType, userId } = useContext(AppContext);
    const [profileQuestion, setProfileQuestion] = React.useState('');
    const [codeFinishedPercent, setCodeFinishedPercent] = React.useState('');
    const [senseFinishedPercent, setSenseFinishedPercent] = React.useState('');
    let navigate = useNavigate();

    React.useEffect((e) => {
        console.log('profileQuestion', profileQuestion);
        if (!profileQuestion) {
            async function getVideoQuestions() {
                console.log('user info', jobType, userId);
                try {
                    let response = await axios({
                        withCredentials: true,
                        method: 'GET',
                        credentials: 'same-origin',
                        url: `${process.env.REACT_APP_BASE_URL}/training/profile/questions`,
                        params: {
                            profession: jobType || 'backend',
                        },
                        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
                    });

                    console.log('response', response);
                    setProfileQuestion(response);
                } catch (error) {
                    console.log('error', error);
                    await Swal.fire({
                        title: '你還沒登入，對拔!',
                        text: '先登入讓我們好好認識你呀',
                        icon: 'error',
                        confirmButtonText: '好，立刻登入',
                    });
                    localStorage.setItem('returnPage', location.pathname);
                    navigate('/login');
                }
            }
            getVideoQuestions();
        }
    }, []);

    React.useEffect(
        (e) => {
            if (profileQuestion) {
                console.log('course.js profileQuestion', profileQuestion);
                let codeFinished = profileQuestion.data.code.filter((e) => e.status === 1);
                console.log('codeFinished', codeFinished);
                setCodeFinishedPercent((codeFinished.length / profileQuestion.data.code.length).toFixed(2));
                let senseFinished = profileQuestion.data.video.filter((e) => e.status === 1);
                setSenseFinishedPercent((senseFinished.length / profileQuestion.data.video.length).toFixed(2));
            }
        },
        [profileQuestion]
    );
    return (
        <>
            {profileQuestion ? <Introduce profilequestions={profileQuestion} /> : null}

            <Grid container spacing={2} alignItems="center" justifyContent="center" direction="row" className="course-percent">
                <Grid item xs={4} className="course-percent-grid">
                    <div
                        onClick={() => {
                            window.location.href = '/course/video';
                        }}
                    >
                        <Stack direction="row" spacing={2} className="course-percent-container">
                            <div>
                                <AutoAwesomeIcon />
                            </div>
                            <div>概念題</div>
                            {profileQuestion ? <div>{senseFinishedPercent * 100}%</div> : 0}
                        </Stack>
                    </div>
                </Grid>
                <Grid item xs={4} className="course-percent-grid">
                    <div
                        onClick={() => {
                            window.location.href = '/course/code';
                        }}
                    >
                        <Stack direction="row" spacing={2} className="course-percent-container">
                            <div>
                                <AutoFixHighIcon />
                            </div>
                            <div>技術題</div>
                            {profileQuestion ? <div>{codeFinishedPercent * 100}%</div> : 0}
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
