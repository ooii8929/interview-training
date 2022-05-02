import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TeacherLottie from './teacher.json';
import Lottie from 'lottie-react';
import { Row, Col } from 'react-bootstrap';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Introduce(props) {
    let navigate = useNavigate();

    let userName = localStorage.getItem('username');
    let jobType = localStorage.getItem('jobtype');
    return (
        <Row>
            <Col xs="5">
                <Lottie animationData={TeacherLottie} />
            </Col>
            <Col xs="7" className="introduce-container">
                <Typography variant="h5" gutterBottom className="introduce-container-title">
                    Hey，{userName}，<br />
                    你接下來將要挑戰10分鐘的{jobType}挑戰。其中包含線上模擬面試、程式技術實作。
                    <br />
                    請確保網路順暢以及視訊音訊設備正常。
                    <br />
                    準備好請按『開始挑戰』
                </Typography>
                <Divider />
                <Button
                    size="large"
                    value={props.createDT}
                    href={props.href}
                    profilequestions={props.profilequestions}
                    onClick={() => navigate('video')}
                    className="introduce-container-btn"
                >
                    立刻開始挑戰
                </Button>
            </Col>
        </Row>
    );
}
