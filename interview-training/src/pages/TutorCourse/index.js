import Fragment from "react";
import Header from "../../layouts/sections/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import RCT from "./components/RTC";
import { useParams } from "react-router-dom";
import "./index.scss";

export default function Course() {
  const [jobType, setJobType] = useState("");
  function changeJobType(event) {
    setJobType(event.target.value);
  }

  useEffect(() => {
    sessionStorage.setItem("jobType", jobType);
  }, [jobType]);
  return (
    <div>
      <Header />
      <RCT />
    </div>
  );
}
