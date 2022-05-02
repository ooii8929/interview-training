import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../../App';
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
        await axios.post(`${Constant}/training/video/answer/check`, {
            user_id: nowUserId,
            question_id: tmpProfile.data._id,
            qid: props.nowQuestionNumber,
            checked: tmpChecked,
        });
        tmpProfile.data.video.filter((e) => {
            console.log('e', e);
            if (e.qid == props.nowQuestionNumber) {
                e.status = 1;
            }
        });
        console.log('tmpProfile after change status', tmpProfile);
        navigate(0);
    }

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
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {props.check
                ? props.check.map((e, index) => {
                      return <FormControlLabel label={e} ket={index} control={<Checkbox checked={checked[index]} onChange={handleChanges[index]} />} />;
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
