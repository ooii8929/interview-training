import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TeacherLottie from "./teacher.json";
import Lottie from "lottie-react";
import { Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Introduce(props) {
  let navigate = useNavigate();

  let userName = sessionStorage.getItem("username");
  let jobType = sessionStorage.getItem("jobtype");
  return (
    <Row>
      <Col xs="5">
        <Lottie animationData={TeacherLottie} />
      </Col>
      <Col xs="7">
        <Typography variant="h6" gutterBottom>
          Hey，{userName}，你接下來將要挑戰10分鐘的{jobType}
          挑戰。其中包含線上模擬面試、程式技術實作。請確保網路順暢以及視訊音訊設備正常。準備好請按『下一步』
        </Typography>
        <Divider />
        <Button
          size="small"
          value={props.createDT}
          href={props.href}
          profilequestions={props.profilequestions}
          onClick={() => navigate("video")}
        >
          立刻挑戰
        </Button>
      </Col>
    </Row>
  );
}
