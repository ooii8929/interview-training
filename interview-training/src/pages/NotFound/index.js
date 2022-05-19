import React from 'react';

import NotFoundLottie from './notfound.json';
import Lottie from 'lottie-react';
import { Row, Col } from 'react-bootstrap';
import './main.scss';

export default function NotFound(props) {
  return (
    <Row>
      <Col xs="6" className="notfound">
        <Lottie animationData={NotFoundLottie} />
      </Col>
    </Row>
  );
}
