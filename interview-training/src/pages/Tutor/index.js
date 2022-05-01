import "./index.scss";
import React from "react";
import axios from "axios";
import Card from "./Card";
import { useParams } from "react-router-dom";
import "./index.scss";

let allTutors;

function Tutor() {
  let { id } = useParams();
  const [display, setDisplay] = React.useState(false);
  const [tutors, setTutors] = React.useState(null);
  const [appointment, setAppointment] = React.useState(null);
  const baseURL = "http://localhost:3001/api/1.0/tutor/teacher/schedule";
  const userID = sessionStorage.getItem("userid");

  async function getTutors() {
    try {
      allTutors = await axios.get(baseURL);
      console.log("allTutors", allTutors);
      setTutors(allTutors["data"]);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    getTutors();
  }, []);

  // init pass
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    console.log("appointment", appointment);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      async function sendAppointment(course_id) {
        try {
          let response = await axios.post(
            "http://localhost:3001/api/1.0/tutor/user/appoint",
            {
              user_id: userID,
              course_id: course_id,
            }
          );
          console.log("response", response);
          alert("Appoinment success");
          getTutors();
        } catch (error) {
          alert(error.response.data.error);
        }
      }
      sendAppointment(appointment);
    }
  }, [appointment]);

  return (
    <>
      <div>
        {tutors
          ? tutors.map((tutor, index) => {
              return (
                <Card
                  key={index}
                  tID={tutor["t_id"]}
                  availableTime={tutor["available_time"]}
                  id={tutor["id"]}
                  sendAppointment={setAppointment}
                />
              );
            })
          : null}
      </div>
    </>
  );
}

export default Tutor;
