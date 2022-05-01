import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./lottie.json";
// Choose and change
import SelectAutoWidth from "./components/Select";
import IconLabelButtons from "./components/ButtonGoTraining";
import "./index.scss";

function Home() {
  const [jobType, setJobType] = useState("");
  function changeJobType(event) {
    setJobType(event.target.value);
  }

  useEffect(() => {
    sessionStorage.setItem("jobType", jobType);
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
              <h1>面面一到，工作就到</h1>
              <h2>用聰明的方式訓練面試</h2>
            </div>
            <div id="go-to-training">
              <SelectAutoWidth onJobChange={changeJobType} jobType={jobType} />
              <IconLabelButtons href="/course" />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
