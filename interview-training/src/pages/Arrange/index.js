import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import './index.scss';
const theme = createTheme();

export default function Arrange() {
  let userName = localStorage.getItem('username');

  const [value, setValue] = React.useState(new Date());

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let time = data.get('dateTimeText');

    let roomLink = generateRoomUrl(time);
    let scheduleInfo = {
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
      await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/course/tutor/schedule`,
        data: scheduleInfo,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      let timeShow = time.replace('T', ' ');
      await Swal.fire({
        title: '安排成功！!',
        text: `已為您安排${timeShow}`,
        icon: 'success',
        confirmButtonText: '繼續安排',
      });
    } catch (error) {
      console.log(error.response);
      await Swal.fire({
        title: '發生問題!',
        text: `${error.response.data.error}`,
        icon: 'error',
        confirmButtonText: '再試一次',
      });
    }
  };

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
            請幫我完成排課時間
          </Typography>
          <Box className="submit-tutor-arrange">
            <Box component="form" noValidate onSubmit={handleScheduleSubmit} sx={{ mt: 4 }} className="flex-items">
              <Grid container spacing={2} sx={{ width: '100%', p: 0, pl: 0, m: 0 }} style={{ paddingLeft: '0px !important' }}>
                <Grid item xs={12} sx={{ width: '100%', p: 0, pl: 0, m: 0 }} className="arrange-time" style={{ paddingLeft: '0px !important' }}>
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
              <Button type="submit" fullWidth variant="contained" xs={12} sx={{ mt: 3, mb: 2 }}>
                安排時間
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
