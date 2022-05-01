import Introduce from "./introduce";
import React, { useContext } from "react";
import { AppContext } from "../../../App";
import { Grid, Stack } from "@mui/material";
import axios from "axios";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BalanceIcon from "@mui/icons-material/Balance";

export default function Prepare() {
  const { setProfileQuestion, profileQuestion, jobType, userId } =
    useContext(AppContext);

  React.useEffect((e) => {
    console.log("profileQuestion", profileQuestion);
    if (!profileQuestion) {
      async function getVideoQuestions() {
        console.log("user info", jobType, userId);
        let response = await axios.get(
          "http://localhost:3001/api/1.0/training/profile/questions",
          {
            params: {
              profession: jobType || "backend",
              userID: userId,
            },
          }
        );
        console.log("response", response);
        setProfileQuestion(response);
      }
      getVideoQuestions();
    }
  }, []);

  React.useEffect(
    (e) => {
      if (profileQuestion) {
        console.log("course.js profileQuestion", profileQuestion);
      }
    },
    [profileQuestion]
  );
  return (
    <>
      {profileQuestion ? (
        <Introduce profilequestions={profileQuestion} />
      ) : null}

      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction="row"
        className="course-percent"
      >
        <Grid item xs={4}>
          <div>
            <Stack
              direction="row"
              spacing={2}
              className="course-percent-container"
            >
              <div>
                <AutoAwesomeIcon />
              </div>
              <div>概念題</div>
              {profileQuestion ? (
                <div>{profileQuestion.data.percent.video}</div>
              ) : (
                0
              )}
            </Stack>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Stack
              direction="row"
              spacing={2}
              className="course-percent-container"
            >
              <div>
                <AutoFixHighIcon />
              </div>
              <div>技術題</div>
              {profileQuestion ? (
                <div>{profileQuestion.data.percent.code}</div>
              ) : (
                0
              )}
            </Stack>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Stack
              direction="row"
              spacing={2}
              className="course-percent-container"
            >
              <div>
                <BalanceIcon />
              </div>
              <div>邏輯題</div>
              {profileQuestion ? (
                <div>{profileQuestion.data.percent.logic}</div>
              ) : (
                0
              )}
            </Stack>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
