import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import groovyWalkAnimation from './lottie.json';
// Choose and change
import SelectAutoWidth from './components/Select';
import IconLabelButtons from './components/ButtonGoTraining';
import './index.scss';

export default function Home(props) {
  const [profession, setprofession] = useState('');
  const [clicked, setClicked] = useState(true);

  function changeprofession(event) {
    setprofession(event.target.value);

    setClicked(false);
  }

  useEffect(() => {
    localStorage.setItem('profession', profession);
  }, [profession]);
  return (
    <React.Fragment>
      <div id="home-herobar">
        <Row>
          <Col xs="6">
            <Lottie animationData={groovyWalkAnimation} id="lottie-icon" />
          </Col>
          <Col xs="6">
            <div id="home-title">
              <h2>『為優秀面試者而生』</h2>
              <h1>面面培訓系統</h1>
            </div>
            <div id="go-to-training">
              <SelectAutoWidth onJobChange={changeprofession} profession={profession} className="select-profession" onSelect={setClicked} />
              <IconLabelButtons href="/course" clicked={clicked} />
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}
