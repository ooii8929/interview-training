import './index.scss';
import React from 'react';
import axios from 'axios';
import Card from './Card';
import './index.scss';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';

let allTutors;

function Tutor() {
  const [tutors, setTutors] = React.useState(null);
  const [appointment, setAppointment] = React.useState(null);
  const getScheduleURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/course/tutor/schedule`;

  React.useEffect(() => {
    getTutors();
  }, []);

  async function getTutors() {
    try {
      allTutors = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: getScheduleURL,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      if (Object.keys(allTutors['data']).length === 0) {
        await Swal.fire({
          title: '目前尚無老師預約，先自主練習',
          icon: 'error',
          confirmButtonText: '前往模擬面試',
        });

        window.location.href = '/';
      }
      setTutors(allTutors['data']);
    } catch (error) {
      console.log(error);
    }
  }

  // init pass
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      makeAppointment(appointment);
    }
  }, [appointment]);

  async function makeAppointment(course_id) {
    try {
      await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/course/interviewee/appoint`,
        data: {
          course_id: course_id,
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      await Swal.fire({
        title: '預約成功！',
        icon: 'success',
        confirmButtonText: '前往會員頁查看',
      });

      window.location.href = '/account';
    } catch (error) {
      await Swal.fire({
        title: `${error.response.status}`,
        text: `${error.response.data.error}`,
        icon: 'error',
        confirmButtonText: '前往登入',
      });
      window.location.href = '/login';
    }
  }

  return (
    <React.Fragment>
      <h1 className="tutor-main-title">本日推薦導師</h1>

      <Grid container spacing={2}>
        {tutors
          ? Object.keys(tutors).map((tutor, index) => {
              //<p key={index}>{tutors[tutor][0]['password']}</p>;
              return (
                <Grid item xs={4} key={index}>
                  <Card
                    avator={tutors[tutor][0]['picture']}
                    name={tutors[tutor][0]['name']}
                    profession={tutors[tutor][0]['profession']}
                    introduce={tutors[tutor][0]['introduce']}
                    tutorContent={tutors[tutor]}
                    sendAppointment={setAppointment}
                  />
                </Grid>
              );
            })
          : null}
      </Grid>
    </React.Fragment>
  );
}

export default Tutor;
