import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import './index.scss';

// Choose and change
import StepperSection from './components/Stepper';
import Question from './components/Question';
import Prepare from './components/Prepare';

function Code() {
  return (
    <React.Fragment>
      <Row>
        <Col xs="10" id="code-main">
          <StepperSection prepare={<Prepare />} question={<Question />} />
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default Code;
