import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './index.scss';

// Choose and change
import StepperSection from './components/Stepper';
import Question from './components/Question';
import Prepare from './components/Prepare';

function Code() {
  const [profession, setprofession] = useState('');
  function changeprofession(event) {
    setprofession(event.target.value);
  }

  useEffect(() => {
    localStorage.setItem('profession', profession);
  }, [profession]);
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

export default Code;
