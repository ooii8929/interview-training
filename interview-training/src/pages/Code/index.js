import React from "react";
import Header from "../../layouts/sections/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./index.scss";

// Choose and change
import StepperSection from "./components/Stepper";
import Question from "./components/Question";
import Prepare from "./components/Prepare";

function Code() {
  const [jobType, setJobType] = useState("");
  function changeJobType(event) {
    setJobType(event.target.value);
  }

  useEffect(() => {
    sessionStorage.setItem("jobType", jobType);
  }, [jobType]);
  return (
    <>
      <Header />
      <Row>
        <Col xs="10" id="code-main">
          <StepperSection prepare={<Prepare />} question={<Question />} />
        </Col>
      </Row>
    </>
  );
}

export default Code;
