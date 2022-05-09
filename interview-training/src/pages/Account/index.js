import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { getFileName } from './utils/index';
import axios from 'axios';
import Card from './Card';
import TutorCard from './TutorCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Records from './Records';
import ArrangeTime from './ArrangeTime';
import './index.scss';

let allTutors;

function Tutor() {
    const { Constant } = useContext(AppContext);

    const [profiles, setProfiles] = React.useState(null);
    const [appointments, setAppointments] = React.useState('');
    const [allTraining, setAllTraining] = React.useState('');
    const [allTutorRecords, setAllTutorRecords] = React.useState('');

    const [time, setTime] = React.useState(null);
    const userID = localStorage.getItem('userid');
    const userEmail = localStorage.getItem('useremail');
    let userIdentity = '';
    const [file, setFile] = React.useState();
    const [fileContent, setFileContent] = React.useState();
    const [fileType, setFileType] = React.useState();
    const [fileName, setFileName] = React.useState();
    let location = useLocation();
    function handleChange(e) {
        console.log('e.target.files', e.target.files[0]);
        setFile(URL.createObjectURL(e.target.files[0]));
        setFileType(e.target.files[0]['type']);
        setFileName(e.target.files[0]['name']);
        setFileContent(e.target.files[0]);
    }

    async function updateAvator() {
        let getAvatorURL = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/avator`, {
            params: {
                file_name: fileName,
                file_type: fileType,
            },
        });
        console.log('getAvatorURL', fileName, getAvatorURL, file, fileType);

        let sendAvatorToS3 = await axios.put(getAvatorURL['data']['avatorURL'], fileContent, {
            headers: { 'Content-Type': fileType },
        });

        console.log('success file name before', sendAvatorToS3);
        console.log('success file name', sendAvatorToS3.config.data.name);

        let data = {
            userID: userID,
            identity: userIdentity,
            picture: `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/avator/` + fileName,
        };

        console.log('data', data);

        let updateAvator = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/avator`, data);

        console.log('updateAvator', updateAvator);
    }

    React.useEffect(() => {
        // let nowUserId = localStorage.getItem('userid');
        // userIdentity = localStorage.getItem('identity');
        // if (!nowUserId) {
        //     alert('你需要先登入');
        //     localStorage.setItem('returnPage', location.pathname);
        //     return <Navigate to="/login" />;
        // }
        async function init() {
            await getProfile();
            // if (userIdentity === 'student') {
            //     getTraining();
            //     getUserAppointments();
            // }
        }
        init();
    }, []);

    //TODO: Get user profile
    async function getProfile() {
        try {
            // console.log('responseProfile', responseProfile);
            let profile = await axios({
                withCredentials: true,
                method: 'GET',
                credentials: 'same-origin',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/profile`,
                params: {
                    userID: userID,
                    userEmail: userEmail,
                    identity: userIdentity,
                },
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });

            console.log('1. get profile', profile);
            let now = new Date();
            let createDT = new Date(profile['data']['create_dt']);
            const diffTime = Math.abs(now - createDT);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTime(diffDays);
            setFile(profile['data']['picture']);
            setProfiles(profile['data']);

            //TODO: get record
            if (userIdentity === 'teacher') {
                await getTeacherTrainingRecords();
            }

            if (userIdentity === 'student') {
                await getTraining();
                await getUserAppointments();
            }
        } catch (error) {
            console.log(error);
        }
    }

    //TODO: Get user profile
    async function getUserAppointments() {
        try {
            let responseAppoint = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/tutor/user/appoint`, {
                params: {
                    userID: userID,
                },
            });
            if (responseAppoint['data'].length !== 0) {
                console.log('responseAppoint', responseAppoint);
                setAppointments(responseAppoint['data']);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getTraining() {
        try {
            let responseAllTraining = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training`, {
                params: {
                    user_id: userID,
                },
            });

            if (responseAllTraining) {
                console.log('responseAllTraining', responseAllTraining);

                setAllTraining(responseAllTraining);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getTeacherTrainingRecords() {
        try {
            let responseAllTraining = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/records`, {
                params: {
                    user_id: userID,
                    identity: userIdentity,
                },
            });

            console.log('responseAllTraining', responseAllTraining);
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
        <>
            <div>
                <div className="account-avator-container">
                    <img src={file} className="account-avator" />
                    <div className="upload_avator">
                        <input type="file" onChange={handleChange} />
                        <button onClick={updateAvator} className="upload_avator_check">
                            確定更新大頭貼
                        </button>
                    </div>
                </div>

                {profiles ? (
                    <div className="account-info">
                        <h1>{profiles['name']}</h1>
                        <br />
                        <p>{profiles['email']}</p>
                        已經加入面面 {time} 天了 ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡
                    </div>
                ) : null}

                <Container className="account-box">
                    {allTraining ? (
                        <Typography variant="h4" component="h2">
                            近期課程
                        </Typography>
                    ) : (
                        <Typography variant="h4" component="h2">
                            已安排時間
                        </Typography>
                    )}

                    <Grid container columns={12} className="account-box-grid">
                        {appointments
                            ? appointments.map((appointment, index) => {
                                  return (
                                      <Grid item xs={4} key={index} className="account-box-grid-self">
                                          <TutorCard
                                              key={index}
                                              teacher={appointment['name']}
                                              profession={appointment['profession']}
                                              picture={appointment['picture']}
                                              tID={appointment['question_id']}
                                              createDT={appointment['create_dt'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                                              href={appointment['course_url']}
                                          />
                                      </Grid>
                                  );
                              })
                            : null}
                    </Grid>

                    <Grid container columns={12} className="account-box-grid">
                        {allTutorRecords
                            ? allTutorRecords['data']['unappointed'].map((arrange, index) => {
                                  console.log('====================================');
                                  console.log('arrange', arrange);
                                  console.log('====================================');
                                  return (
                                      <Grid item xs={4} key={index} className="account-box-grid-self">
                                          <ArrangeTime key={index} time={arrange['available_time']} create={arrange['create_dt']} />
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
                    <Grid container columns={12} className="account-box-grid-self">
                        {allTraining
                            ? allTraining['data'].map((training, index) => {
                                  return (
                                      <>
                                          <Grid item xs={4} key={index}>
                                              <Card key={index} tID={training['video']['title']} availableTime={training['profesiion']} createDT={training['create_dt']} />
                                          </Grid>
                                      </>
                                  );
                              })
                            : null}
                    </Grid>

                    <Grid container columns={12} className="account-box-grid-self">
                        {allTutorRecords
                            ? allTutorRecords['data']['appointed'].map((record, index) => {
                                  console.log('====================================');
                                  console.log('record', record);
                                  console.log('====================================');
                                  return (
                                      <Grid item xs={4} key={index}>
                                          <Records href={record['course_url']} availableTime={record['available_time']} picture={record['picture']} />
                                      </Grid>
                                  );
                              })
                            : null}
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default Tutor;
