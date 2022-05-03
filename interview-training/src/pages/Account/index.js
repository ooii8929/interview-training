import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { getFileName } from './utils/index';
import axios from 'axios';
import Card from './Card';
import TutorCard from './TutorCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';

import './index.scss';

let allTutors;

function Tutor() {
    const { Constant } = useContext(AppContext);

    const [profiles, setProfiles] = React.useState(null);
    const [appointments, setAppointments] = React.useState(null);
    const [allTraining, setAllTraining] = React.useState(null);

    const [time, setTime] = React.useState(null);
    const userID = localStorage.getItem('userid');
    const userEmail = localStorage.getItem('useremail');
    const userIdentity = localStorage.getItem('identity');
    const [file, setFile] = React.useState();
    const [fileContent, setFileContent] = React.useState();
    const [fileType, setFileType] = React.useState();
    const [fileName, setFileName] = React.useState();
    function handleChange(e) {
        console.log('e.target.files', e.target.files[0]);
        setFile(URL.createObjectURL(e.target.files[0]));
        setFileType(e.target.files[0]['type']);
        setFileName(e.target.files[0]['name']);
        setFileContent(e.target.files[0]);
    }

    async function updateAvator() {
        let getAvatorURL = await axios.get(`${Constant[0]}/user/avator`, {
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

        let updateAvator = await axios.post(`${Constant[0]}/user/avator`, data);

        console.log('updateAvator', updateAvator);
    }

    async function getProfile() {
        try {
            // let responseProfile = await axios.get(`${Constant[0]}/user/profile`, {
            //     params: {
            //         userID: userID,
            //     },
            // });

            let responseAppoint = await axios.get(`${Constant[0]}/tutor/user/appoint`, {
                params: {
                    userID: userID,
                },
            });

            // console.log('responseProfile', responseProfile);
            let profile = await axios.get(`${Constant[0]}/user/profile`, {
                params: {
                    userID: userID,
                    userEmail: userEmail,
                    identity: userIdentity,
                },
            });
            if (profile) {
                console.log('profile', profile);
                let now = new Date();
                let createDT = new Date(profile['data']['userProfile']['create_dt']);
                const diffTime = Math.abs(now - createDT);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setTime(diffDays);
                setFile(profile['data']['userProfile']['picture']);
                setProfiles(profile['data']);
                console.log('responseAppoint', responseAppoint['data']);
                setAppointments(responseAppoint['data']);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getTraining() {
        try {
            // let responseProfile = await axios.get(`${Constant[0]}/user/profile`, {
            //     params: {
            //         userID: userID,
            //     },
            // });

            let responseAllTraining = await axios.get(`${Constant[0]}/training`, {
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
    React.useEffect(() => {
        getProfile();
        getTraining();
    }, []);

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
                        <h1>{profiles['userProfile']['name']}</h1>
                        <br />
                        <p>{profiles['userProfile']['email']}</p>
                        已經加入面面 {time} 天了 ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡
                    </div>
                ) : null}

                <Container className="account-box">
                    <Typography variant="h4" component="h2">
                        近期課程
                    </Typography>
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
                </Container>
                <Container className="account-box">
                    <Typography variant="h4" component="h2">
                        歷屆模擬題
                    </Typography>
                    <Grid container columns={12} className="account-box-grid-self">
                        {allTraining
                            ? allTraining['data'].map((training, index) => {
                                  return (
                                      <Grid item xs={4} key={index}>
                                          <Card key={index} tID={training['video']['title']} availableTime={training['profesiion']} createDT={training['create_dt']} />
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
