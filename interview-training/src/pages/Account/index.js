import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';

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
    const userID = localStorage.getItem('userid');

    async function getProfile() {
        try {
            let responseProfile = await axios.get(`${Constant[0]}/user/profile`, {
                params: {
                    userID: userID,
                },
            });

            let responseAppoint = await axios.get(`${Constant[0]}/tutor/user/appoint`, {
                params: {
                    userID: userID,
                },
            });

            setProfiles(responseProfile['data']);
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
                        {profiles
                            ? profiles.map((profile, index) => {
                                  return (
                                      <Grid item xs={4} key={index}>
                                          <Card key={index} tID={profile['question_id']} availableTime={profile['content']} createDT={profile['create_dt']} />
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
