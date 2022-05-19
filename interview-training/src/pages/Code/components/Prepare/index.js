import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import tutorLottie from './tutor.json';
import Lottie from 'lottie-react';
import { Row, Col } from 'react-bootstrap';

function Prepare(props) {
  let userName = localStorage.getItem('username');
  let profession = localStorage.getItem('profession');
  return (
    <Row>
      <Col xs="6">
        <Lottie animationData={tutorLottie} />
      </Col>
      <Col xs="6">
        <Typography variant="h6" gutterBottom>
          Hey，{userName}，你接下來將要挑戰10分鐘的{profession}
          挑戰。其中包含線上模擬面試、程式技術實作。請確保網路順暢以及視訊音訊設備正常。準備好請按『下一步』
        </Typography>
        <Divider />
      </Col>
    </Row>
  );
}

export default Prepare;
