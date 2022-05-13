import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import axios from 'axios';
import Card from './Card';
import { useParams } from 'react-router-dom';
import './index.scss';
import Grid from '@mui/material/Grid';
import Swal from 'sweetalert2';

let allTutors;

function Tutor() {
    const { Constant } = useContext(AppContext);

    let { id } = useParams();
    const [display, setDisplay] = React.useState(false);
    const [tutors, setTutors] = React.useState(null);
    const [appointment, setAppointment] = React.useState(null);
    const baseURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/tutor/teacher/schedule`;
    const userID = localStorage.getItem('userid');

    async function getTutors() {
        try {
            allTutors = await axios({
                withCredentials: true,
                method: 'GET',
                credentials: 'same-origin',
                url: baseURL,
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });
            console.log('allTutors', allTutors);
            setTutors(allTutors['data']);
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
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            async function sendAppointment(course_id) {
                try {
                    let response = await axios({
                        withCredentials: true,
                        method: 'POST',
                        credentials: 'same-origin',
                        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/tutor/user/appoint`,
                        data: {
                            course_id: course_id,
                        },
                        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
                    });
                    console.log('response', response);
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
            sendAppointment(appointment);
        }
    }, [appointment]);

    return (
        <>
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
        </>
    );
}

export default Tutor;
