import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from '../../App';
import Lottie from 'lottie-react';
import Finished from './finished.json';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './main.scss';
import Swal from 'sweetalert2';

let jobType;
let nowUserId;
export default function CourseResult() {
    const { Constant } = useContext(AppContext);
    // score
    const [codeSuccess, setCodeSuccess] = useState(null);
    const [codeFail, setCodeFail] = useState(null);
    const [videoSuccess, setVideoSuccess] = useState(null);
    const [videoCheck, setVideoCheck] = useState(null);
    //

    const [profileQuestion, setProfileQuestion] = React.useState('');

    // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
    React.useEffect((e) => {
        console.log('1. profileQuestion', profileQuestion);

        async function getVideoQuestions() {
            nowUserId = localStorage.getItem('userid');
            jobType = localStorage.getItem('jobType');
            let questionID = localStorage.getItem('question_id');
            let response = await axios.get(`${process.env.REACT_APP_BASE_URL}/training/profile/result`, {
                params: {
                    userID: nowUserId,
                    question_id: questionID,
                },
            });

            if (response['data'].length === 0) {
                await Swal.fire({
                    title: '尚未完成作答!別偷作弊',
                    text: '即將導回模擬訓練頁，請先檢查是否已完成題目',
                    icon: 'error',
                    confirmButtonText: '遣返',
                });
                window.location.href = '/course';
            }
            console.log('2. get question result', response);
            setProfileQuestion(response);
        }
        getVideoQuestions();
    }, []);
    React.useEffect(
        (e) => {
            if (!codeSuccess) {
                if (profileQuestion) {
                    // calculate score
                    // code

                    profileQuestion['data'][0]['code'].map((e) => {
                        if (e['javascript_answer_status']) {
                            if (e['javascript_answer_status'].answer_status === 1) {
                                setCodeSuccess((prev) => prev + 1);
                            }
                            if (e['javascript_answer_status'].answer_status === -1) {
                                setCodeFail((prev) => prev + 1);
                            }
                        }
                    });

                    profileQuestion['data'][0]['video'].map((e) => {
                        console.log('e.checked.length', e.checked.length);
                        setVideoSuccess((prev) => prev + e.checked.length);
                        return setVideoCheck((prev) => prev + e.check.length);
                    });
                }
            }
        },
        [profileQuestion]
    );

    return (
        <>
            <Row>
                <Col xs="5" id="code-main">
                    <Lottie animationData={Finished} />
                </Col>{' '}
                <Col xs="7">
                    <h2>恭喜完成！</h2>
                    {profileQuestion ? (
                        <div id="result-content">
                            <p>
                                {' '}
                                此次挑戰，你共獲得 <span className="special-font">
                                    {((codeSuccess + videoSuccess) / (codeSuccess + codeFail + videoCheck)).toFixed(2) * 100}
                                </span>{' '}
                                分
                            </p>
                            <p>
                                在 {codeSuccess + codeFail} 題技術題中，你答對了 <span className="special-font">{codeSuccess}</span> 題
                            </p>
                            <p>
                                並在模擬實境中獲得{' '}
                                <span className="special-font">
                                    {videoSuccess}/{videoCheck}
                                </span>{' '}
                                的重點分數
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
        </>
    );
}
