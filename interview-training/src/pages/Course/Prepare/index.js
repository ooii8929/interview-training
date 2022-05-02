import Introduce from './introduce';
import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import './main.scss';
import { Grid, Stack } from '@mui/material';
import axios from 'axios';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BalanceIcon from '@mui/icons-material/Balance';

export default function Prepare() {
    const { jobType, userId, Constant } = useContext(AppContext);
    const [profileQuestion, setProfileQuestion] = React.useState('');
    const [codeFinishedPercent, setCodeFinishedPercent] = React.useState('');
    const [senseFinishedPercent, setSenseFinishedPercent] = React.useState('');

    React.useEffect((e) => {
        console.log('profileQuestion', profileQuestion);
        if (!profileQuestion) {
            async function getVideoQuestions() {
                console.log('user info', jobType, userId);
                let response = await axios.get(`${Constant}/training/profile/questions`, {
                    params: {
                        profession: jobType || 'backend',
                        userID: userId,
                    },
                });
                console.log('response', response);
                setProfileQuestion(response);
            }
            getVideoQuestions();
        }
    }, []);

    React.useEffect(
        (e) => {
            if (profileQuestion) {
                console.log('course.js profileQuestion', profileQuestion);
                let codeFinished = profileQuestion.data.code.filter((e) => e.status == 1);
                console.log('codeFinished', codeFinished);
                setCodeFinishedPercent((codeFinished.length / profileQuestion.data.code.length).toFixed(2));
                let senseFinished = profileQuestion.data.video.filter((e) => e.status == 1);
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
                <Grid item xs={4} className="course-percent-grid">
                    <div>
                        <Stack direction="row" spacing={2} className="course-percent-container">
                            <div>
                                <BalanceIcon />
                            </div>
                            <div>邏輯題</div>
                            {profileQuestion ? <div>{profileQuestion.data.percent.logic}</div> : 0}
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
