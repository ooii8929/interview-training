import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../../App';
import { getFileName } from '../Video/utils/index';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './main.scss';
export default function VideoCheck(props) {
    const { Constant } = useContext(AppContext);
    let tmpProfile;
    let navigate = useNavigate();
    const [checked, setChecked] = React.useState([true, false, false]);
    let nowUserId = localStorage.getItem('userid');
    async function storeChecked(params) {
        console.log('checked', checked);
        let tmpChecked = [];
        for (let i = 0; i < checked.length; i++) {
            if (checked[i]) {
                tmpChecked.push(props.check[i]);
            }
        }
        console.log(tmpChecked);
        let tmpProfile = props.profileQuestion;
        await handleSave();
        await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/video/answer/check`, {
            user_id: nowUserId,
            question_id: tmpProfile.data._id,
            qid: props.nowQuestionNumber,
            checked: tmpChecked,
        });
        tmpProfile.data.video.filter((e) => {
            console.log('e', e);
            if (e.qid === props.nowQuestionNumber) {
                e.status = 1;
            }
        });
        console.log('tmpProfile after change status', tmpProfile);
        navigate(0);
    }

    const handleSave = async () => {
        var file = new File([props.blob], getFileName('webm'), {
            type: 'video/webm',
        });

        try {
            let presignedUrl = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/video/answer/url`, {
                params: {
                    filename: file.name,
                },
            });
            let success = await axios.put(presignedUrl['data'], file, {
                headers: { 'Content-Type': 'video/webm' },
            });

            console.log('success file name', success.config.data.name);

            tmpProfile = props.profileQuestion;
            console.log('提交答案');
            console.log('tmpProfile', tmpProfile);
            let data = {
                user_id: nowUserId,
                question_id: tmpProfile.data._id,
                qid: props.nowQuestionNumber,
                answer_url: `https://interview-appworks.s3.ap-northeast-1.amazonaws.com/` + success.config.data.name,
            };
            console.log('data', data);
            let submitAnswer = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/video/answer`, data);

            console.log('tmpProfile after', submitAnswer);
        } catch (error) {
            console.log(error);
        }

        // invokeSaveAsDialog(blob);
    };

    const handleChange1 = (event) => {
        setChecked([event.target.checked, event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event) => {
        setChecked([event.target.checked, checked[1], checked[2]]);
    };

    const handleChange3 = (event) => {
        setChecked([checked[0], event.target.checked, checked[2]]);
    };

    const handleChange4 = (event) => {
        setChecked([checked[0], checked[1], event.target.checked]);
    };

    let handleChanges = [handleChange2, handleChange3, handleChange4];

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }} className="selected-btn-div">
            {props.check
                ? props.check.map((e, index) => {
                      return <FormControlLabel label={e} key={index} control={<Checkbox checked={checked[index]} onChange={handleChanges[index]} className="selected-btn" />} />;
                  })
                : null}
        </Box>
    );

    return (
        <div className="check-video-box">
            <FormControlLabel
                label="我超棒，都做到了"
                control={
                    <Checkbox checked={checked[0] && checked[1] && checked[2]} indeterminate={checked[0] !== checked[1] || checked[0] !== checked[2]} onChange={handleChange1} />
                }
            />
            {children}
            <Button variant="contained" endIcon={<SendIcon />} onClick={storeChecked} className="video-btn" size="large">
                提交答案
            </Button>
        </div>
    );
}
