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
    const [allCode, setAllCode] = useState(null);
    const [codeFail, setCodeFail] = useState(null);
    const [videoSuccess, setVideoSuccess] = useState(null);
    const [videoCheck, setVideoCheck] = useState(null);
    //

    const [profileQuestion, setProfileQuestion] = React.useState('');

    // 1. 判斷有沒有此數據，沒有則Get。如果有，就進入題目判斷
    React.useEffect((e) => {
        async function getVideoQuestions() {
            nowUserId = localStorage.getItem('userid');
            jobType = localStorage.getItem('jobType');
            let questionID = localStorage.getItem('question_id');

            let response = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/question/result`,
                params: {
                    question_id: questionID,
                },
            });
            console.log('response', response);
            // if the questions is not finished yet
            if (response['data']['status'] !== 1) {
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

    // React.useEffect(
    //     (e) => {
    //         if (codeSuccess) {
    //             setAllCode((prev) => prev + 1);
    //         }
    //     },
    //     [codeSuccess]
    // );

    // React.useEffect(
    //     (e) => {
    //         if (codeFail) {
    //             setAllCode((prev) => prev + 1);
    //         }
    //     },
    //     [codeFail]
    // );
    React.useEffect(
        (e) => {
            console.log('profileQuestion', profileQuestion);
            if (profileQuestion) {
                // calculate score

                // code
                let tmpCodeSuccess = 0;
                let tmpCodeFail = 0;
                profileQuestion['data']['code'].map((e) => {
                    if (e['javascript_answer_status']) {
                        console.log('javascript_answer_status', e['javascript_answer_status']);
                        if (e['javascript_answer_status'].answer_status === 1) {
                            tmpCodeSuccess++;
                            console.log('tmpCodeSuccess', tmpCodeSuccess);
                        }
                        if (e['javascript_answer_status'].answer_status === -1) {
                            tmpCodeFail++;
                        }
                    }
                    setCodeSuccess(tmpCodeSuccess);
                    setAllCode(tmpCodeSuccess + tmpCodeFail);
                });

                // video
                let tmpVideoSuccess = 0;
                let tmpVideoCheck = 0;
                profileQuestion['data']['video'].map((e) => {
                    console.log('e.checked.length', e.checked.length);
                    tmpVideoSuccess += e.checked.length;
                    tmpVideoCheck += e.check.length;
                });
                setVideoSuccess(tmpVideoSuccess);
                setVideoCheck(tmpVideoCheck);
            }
        },
        [profileQuestion]
    );

    return (
        <>
            <Row>
                <Col xs="5" id="code-main">
                    <Lottie animationData={Finished} />
                </Col>
                <Col xs="7">
                    <h2>恭喜完成！</h2>
                    {profileQuestion ? (
                        <div id="result-content">
                            <p>
                                此次挑戰，你共獲得 <span className="special-font">{((codeSuccess + videoSuccess) / (allCode + videoCheck)).toFixed(1) * 100}</span>分
                            </p>
                            <p>
                                在 {allCode ? allCode : 0} 題技術題中，你答對了 <span className="special-font">{codeSuccess ? codeSuccess : 0}</span> 題
                            </p>
                            <p>
                                並在模擬實境中獲得
                                <span className="special-font">
                                    {videoSuccess ? videoSuccess : 0}/{videoCheck ? videoCheck : 0}
                                </span>
                                的重點分數
                            </p>
                        </div>
                    ) : null}
                </Col>
            </Row>
        </>
    );
}
