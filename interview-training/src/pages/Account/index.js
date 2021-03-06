import './index.scss';
import React from 'react';

import axios from 'axios';
import TutorCard from './TutorCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import ArrangeTime from './ArrangeTime';
import './index.scss';
import Swal from 'sweetalert2';
import Camera from './camera.png';
import Tab from './Tab';
import CourseTabs from './CourseTabs';

export default function Account(props) {
  let navigate = useNavigate();

  const userID = localStorage.getItem('userid');

  const [profiles, setProfiles] = React.useState(null);
  const [appointments, setAppointments] = React.useState('');
  const [appointmentsFinished, setAppointmentsFinished] = React.useState('');

  const [allTraining, setAllTraining] = React.useState('');
  const [allTutorRecords, setAllTutorRecords] = React.useState('');
  const [identity, setIdentity] = React.useState('');
  const [avator, setAvator] = React.useState(null);
  const [time, setTime] = React.useState(null);

  let location = useLocation();

  React.useEffect(() => {
    async function init() {
      await getProfile();
    }
    init();
  }, []);

  async function handleChange(e) {
    try {
      updateAvator(e.target.files[0]['name'], e.target.files[0]['type'], URL.createObjectURL(e.target.files[0]), e.target.files[0]);
      setAvator(URL.createObjectURL(e.target.files[0]));
      props.setAvatorURL(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.log('error', error);
      console.log('error response', error.response);
      await Swal.fire({
        title: '出現一些問題',
        text: `${error.response.data.error}`,
        icon: 'error',
        confirmButtonText: '再試一次',
      });
    }
  }

  async function updateAvator(avatorName, avatorType, avator, avatorContent) {
    try {
      // Get S3 Upload URL
      let getAvatorURL = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/avator/upload`,
        params: {
          file_name: avatorName,
          file_type: avatorType,
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });
      console.log('getAvatorURL', getAvatorURL);

      // Put to S3
      await axios.put(getAvatorURL['data'], avatorContent, {
        headers: { 'Content-Type': avatorType },
      });

      let data = {
        userID: userID,
        identity: identity,
        picture: `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/` + avatorName,
      };

      console.log('data', data);

      // Update Profile Avator URL
      let updateAvatorURL = await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/avator`,
        data: data,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      console.log('updateAvatorURL', updateAvatorURL);

      // setAvator(updateAvatorURL);
    } catch (error) {
      console.log('error', error);
    }
  }

  // Get user profile
  async function getProfile() {
    try {
      let profile = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/profile`,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      let now = new Date();
      let createDT = new Date(profile['data']['create_dt']);
      const diffTime = Math.abs(now - createDT);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTime(diffDays);
      setAvator(profile['data']['picture']);
      setProfiles(profile['data']);
      setIdentity(profile['data']['identity']);

      // Get record
      if (profile['data']['identity'] === 'tutor') {
        await gettutorTrainingRecords();
      }

      if (profile['data']['identity'] === 'student') {
        await getTraining();
        await getUserAppointments();
      }
    } catch (error) {
      console.log('error', error);
      await Swal.fire({
        title: '你還沒登入，對拔!',
        text: '先登入讓我們好好認識你呀',
        icon: 'error',
        confirmButtonText: '好，立刻登入',
      });
      localStorage.setItem('returnPage', location.pathname);
      navigate('/login');
    }
  }

  // Get user appointments
  async function getUserAppointments() {
    try {
      let responseAppoint = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/course/user/appoint`,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      if (responseAppoint['data'].length !== 0) {
        let responseAppointFilterUpTONow = responseAppoint['data'].filter((e) => {
          return new Date(e.available_time) > Date.now();
        });

        let finalRecentClass = responseAppointFilterUpTONow.sort((a, b) => new Date(a.available_time) - new Date(b.available_time));

        setAppointments(finalRecentClass);

        let responseAppointFilterDownTONow = responseAppoint['data'].filter((e) => {
          return new Date(e.available_time) <= Date.now();
        });

        let finalPastClass = responseAppointFilterDownTONow.sort((a, b) => new Date(b.available_time) - new Date(a.available_time));

        setAppointmentsFinished(finalPastClass);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getTraining() {
    try {
      let responseAllTraining = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training`,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      if (responseAllTraining) {
        let allTrainingFilter = responseAllTraining['data'].filter((e) => {
          return e['status'] === 1;
        });

        setAllTraining(allTrainingFilter);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function gettutorTrainingRecords() {
    try {
      let responseAllTraining = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/tutor/records`,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });
      setAllTutorRecords(responseAllTraining);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    console.log('use effect allTutorRecords', allTutorRecords);
  }, [allTutorRecords]);

  React.useEffect(() => {
    if (appointments) console.log('appointments', appointments);
  }, [appointments]);

  return (
    <div>
      {profiles && profiles['picture'] ? (
        <div className="account-avator-container">
          <img src={avator} alt="avator" className="account-avator" />
          <div className="upload_avator">
            <label htmlFor="filePicker" className="update-avator-label">
              <input id="filePicker" type="file" onChange={handleChange} style={{ display: 'none' }} />
              <div className="update-avator-img">
                <img src={Camera} alt="avator" className="update-avator-icon" />
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="account-avator-container">
          <img src="https://truth.bahamut.com.tw/s01/201207/28a8513919088d3328aaa40284c6b13e.PNG" alt="avator" className="account-avator" />
          <div className="upload_avator">
            <label htmlFor="filePicker" className="update-avator-label">
              <input id="filePicker" type="file" onChange={handleChange} style={{ display: 'none' }} />
              <div className="update-avator-img">
                <img src={Camera} alt="avator" className="update-avator-icon" />
              </div>
            </label>
          </div>
        </div>
      )}

      {profiles ? (
        <div className="account-info">
          <h1>{profiles['name']}</h1>
          <br />
          <span>{profiles['email']}</span>
          <br />
          已經加入面面 {time} 天了 ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡
        </div>
      ) : null}

      <Container className="account-box">
        {allTraining ? (
          <CourseTabs appointments={appointments} appointmentsFinished={appointmentsFinished} />
        ) : (
          <Typography variant="h4" component="h2">
            已安排時間
          </Typography>
        )}

        <Grid container columns={12} className="account-box-grid">
          {allTutorRecords
            ? allTutorRecords['data']['unappointed'].map((arrange, index) => {
                return (
                  <Grid item xs={4} key={index} className="account-box-grid-self">
                    <ArrangeTime
                      key={index}
                      student={arrange['name']}
                      time={arrange['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                      create={arrange['create_dt'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                    />
                  </Grid>
                );
              })
            : null}
        </Grid>
      </Container>
      <Container className="account-box">
        {allTraining ? (
          <Typography variant="h4" component="h2">
            歷屆模擬題
          </Typography>
        ) : (
          <Typography variant="h4" component="h2">
            已預約課程
          </Typography>
        )}
        {allTraining ? (
          <Grid container columns={12} className="account-box-grid-self">
            <Tab training={allTraining} setAllTraining={setAllTraining} />
          </Grid>
        ) : (
          <Grid container columns={12} className="account-box-grid">
            {allTutorRecords
              ? allTutorRecords['data']['appointed'].map((arrange, index) => {
                  return identity === 'tutor' ? (
                    <Grid item xs={4} key={index} className="account-box-grid-self">
                      <TutorCard
                        key={index}
                        picture={arrange['picture']}
                        tutor={arrange['name']}
                        href={arrange['course_url']}
                        createDT={arrange['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={4} key={index} className="account-box-grid-self">
                      <TutorCard
                        key={index}
                        picture={arrange['picture']}
                        tutor={arrange['name']}
                        href={arrange['course_url']}
                        time={arrange['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                        createDT={arrange['update_dt'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                      />
                    </Grid>
                  );
                })
              : null}
          </Grid>
        )}
      </Container>
    </div>
  );
}
