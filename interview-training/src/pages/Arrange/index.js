import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { AppContext } from '../../App';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import './index.scss';
const theme = createTheme();
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const names = ['Backend', 'Frontend', 'SRE', 'Full-Stack', 'DevOps', 'Architect'];
export default function Arrange() {
    const { Constant } = useContext(AppContext);

    let userId = localStorage.getItem('userid');
    let userName = localStorage.getItem('username');
    const [personName, setPersonName] = React.useState([]);

    const handleMultiSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };
    const [value, setValue] = React.useState(new Date());

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log('data', data);
        let teacherInfo = {
            user_id: userId,
            experience1: data.get('experience1'),
            experience2: data.get('experience2'),
            experience3: data.get('experience3'),
            introduce: data.get('introduce'),
            profession: data.get('profession'),
        };
        try {
            let updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/tutor/teacher/information`, teacherInfo);
            console.log('update result', updateResult);
        } catch (error) {
            console.log('update error', error);
        }
    };
    const handleScheduleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let time = data.get('dateTimeText');

        console.log('time', time);
        let roomLink = generateRoomUrl(time);
        let scheduleInfo = {
            teacher_id: userId,
            available_time: time,
            roomURL: roomLink,
        };

        // default setting
        function generateRandomString() {
            const crypto = window.crypto || window.msCrypto;
            let array = new Uint32Array(1);

            return crypto.getRandomValues(array);
        }

        function generateRoomUrl(time) {
            let roomLink = `${time}_${generateRandomString()}`;
            return roomLink;
        }

        try {
            let updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/tutor/teacher/schedule`, scheduleInfo);
            console.log('update result', updateResult);
        } catch (error) {
            console.log('update error', error);
        }
    };
    const [count, setCount] = React.useState(0);

    const countStyle = React.useRef(null);
    React.useEffect(
        (e) => {
            if (count > 40) {
                countStyle.current.style.color = 'red';
            }
            if (count < 40) {
                countStyle.current.style.color = '#212529';
            }
        },
        [count]
    );

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" align="center">
                        嗨，{userName}，歡迎申請成為面面面試官
                        <br />
                        請幫我完成個人介紹及排課時間
                    </Typography>
                    <Box className="submit-teacher-arrange">
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }} className="flex-items">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    以下請列舉三點你的工作經驗
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth id="experience1" label="經驗一" name="experience1" autoComplete="experience1" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth id="experience2" label="經驗二" name="experience2" autoComplete="experience2" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth id="experience3" label="經驗三" name="experience3" autoComplete="experience3" />
                                </Grid>
                                <Grid item xs={12}>
                                    請自我介紹
                                    <br />
                                    (限縮在40字內。根據研究，好的介紹大大影響排課率)
                                    <textarea type="text" rows={5} className="full_height_Width" onChange={(e) => setCount(e.target.value.length)} name="introduce" />
                                    <p ref={countStyle}>{count}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            name="profession"
                                            multiple
                                            value={personName}
                                            onChange={handleMultiSelectChange}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {names.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                註冊
                            </Button>
                        </Box>
                        <Box component="form" noValidate onSubmit={handleScheduleSubmit} sx={{ mt: 4 }} className="flex-items">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ width: '100%' }}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField {...props} className="datetime-items" name="dateTimeText" />}
                                            label="DateTimePicker"
                                            name="dateTime"
                                            value={value}
                                            onChange={(newValue) => {
                                                setValue(newValue);
                                            }}
                                            inputFormat="yyyy-MM-dd'T'HH:mm"
                                            className="datetime-items"
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                安排時間
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
