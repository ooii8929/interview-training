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
    const [jobType, setJobType] = useState('');
    const [clicked, setClicked] = useState(true);
    useEffect(() => {
        if (props.title) document.title = props.title;
    }, []);

    function changeJobType(event) {
        setJobType(event.target.value);

        setClicked(false);
    }

    useEffect(() => {
        localStorage.setItem('jobType', jobType);
    }, [jobType]);
    return (
        <>
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
                            <SelectAutoWidth onJobChange={changeJobType} jobType={jobType} className="select-profession" onSelect={setClicked} />
                            <IconLabelButtons href="/course" clicked={clicked} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}
