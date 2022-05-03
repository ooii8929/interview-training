import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import axios from 'axios';
import Card from './Card';
import { useParams } from 'react-router-dom';
import './index.scss';

let allTutors;

function Tutor() {
    const { Constant } = useContext(AppContext);

    let { id } = useParams();
    const [display, setDisplay] = React.useState(false);
    const [tutors, setTutors] = React.useState(null);
    const [appointment, setAppointment] = React.useState(null);
    const baseURL = `${Constant[0]}/tutor/teacher/schedule`;
    const userID = localStorage.getItem('userid');

    async function getTutors() {
        try {
            allTutors = await axios.get(baseURL);
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
                    let response = await axios.post(`${Constant[0]}/tutor/user/appoint`, {
                        user_id: userID,
                        course_id: course_id,
                    });
                    console.log('response', response);
                    alert('Appoinment success');
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
                    ? Object.keys(tutors).map((tutor, index) => {
                          //<p key={index}>{tutors[tutor][0]['password']}</p>;
                          return (
                              <Card
                                  key={index}
                                  name={tutors[tutor][0]['name']}
                                  profession={tutors[tutor][0]['profession']}
                                  introduce={tutors[tutor][0]['introduce']}
                                  tutorContent={tutors[tutor]}
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
