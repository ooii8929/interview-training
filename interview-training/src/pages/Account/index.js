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
                },
            });
            console.log('profile', profile);
            let now = new Date();
            let createDT = new Date(profile['data']['userProfile']['create_dt']);
            const diffTime = Math.abs(now - createDT);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTime(diffDays);
            setFile(profile['data']['userProfile']['picture']);
            setProfiles(profile['data']);
            setAppointments(responseAppoint['data']);
        } catch (error) {
            console.log(error);
        }
    }
    React.useEffect(() => {
        getProfile();
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
                                      <Grid item xs={4} key={index}>
                                          <TutorCard
                                              key={index}
                                              tID={appointment['question_id']}
                                              availableTime={appointment['course_url']}
                                              createDT={appointment['create_dt']}
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
                    <Grid container columns={12} className="account-box-grid">
                        {/* {profiles
                            ? profiles['userProfile'].map((profile, index) => {
                                  return (
                                      <Grid item xs={4} key={index}>
                                          <Card key={index} tID={profile['question_id']} availableTime={profile['content']} createDT={profile['create_dt']} />
                                      </Grid>
                                  );
                              })
                            : null} */}
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default Tutor;
