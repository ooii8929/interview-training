import React, { useContext, useState, useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';

const theme = createTheme();

export default function LoginForm(props) {
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');

    const [name, setName] = React.useState('');

    async function signIn(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        console.log('user sign in', data.get('signIdentity'));
        if (!data.get('signIdentity')) {
            await Swal.fire({
                title: '請選擇身份!',
                icon: 'error',
                confirmButtonText: '再試一次',
            });
            return;
        }
        try {
            let signInResponse = await axios({
                withCredentials: true,
                method: 'POST',
                credentials: 'same-origin',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/login`,
                data: {
                    identity: props.identity,
                    email: data.get('signEmail'),
                    password: data.get('signPassword'),
                    provider: 'native',
                },
                headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
            });

            console.log('signInResponse', signInResponse);
            //cookies.set('connect.sid', '2');
            await Swal.fire({
                title: 'Success Login!',
                text: '歡迎回來',
                icon: 'success',
                confirmButtonText: 'Cool',
            });
            localStorage.setItem('props.userID', signInResponse.data.id);
            localStorage.setItem('username', signInResponse.data.name);
            localStorage.setItem('useremail', signInResponse.data.email);

            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            } else {
                window.location.href = '/account';
            }
        } catch (error) {
            await Swal.fire({
                title: 'Wrong password!',
                text: '再試看看！會不會是生日？',
                icon: 'error',
                confirmButtonText: '再試一次',
            });
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log('data', data);
        let registerInfo = {
            identity: props.identity,
            name: data.get('name'),
            email: data.get('registerEmail'),
            password: data.get('registerPassword'),
            provider: 'native',
        };
        try {
            let updateResult;
            if (data.get('props.identity') === 'teacher') {
                updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/teacher/signup`, registerInfo);
            } else if (data.get('props.identity') === 'student') {
                updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/signup`, registerInfo);
            }
            console.log('update result', updateResult);
            localStorage.setItem('props.userID', updateResult.data.data.user.id);
            localStorage.setItem('username', updateResult.data.data.user.name);
            localStorage.setItem('useremail', updateResult.data.data.user.email);
            // localStorage.setItem('props.identity', props.identity);
            await Swal.fire({
                title: 'Success Register!',
                text: '歡迎回來',
                icon: 'success',
                confirmButtonText: 'Cool',
            });
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            } else {
                window.location.href = '/account';
            }
        } catch (error) {
            console.log('update error', error);
        }
    };

    // async function register(e) {
    //     try {
    //         let signInResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/signup`, {
    //             data: {
    //                 name: name,
    //                 props.identity: props.identity,
    //                 email: registerEmail,
    //                 password: registerPassword,
    //                 provider: 'native',
    //             },
    //         });
    //         console.log(name, props.identity, registerEmail, registerPassword);

    //         localStorage.setItem('props.userID', signInResponse.data.data.user.id);
    //         localStorage.setItem('username', signInResponse.data.data.user.name);
    //         localStorage.setItem('useremail', signInResponse.data.data.user.email);
    //         localStorage.setItem('props.identity', props.identity);

    //         alert('success register');
    //         if (localStorage.getItem('returnPage')) {
    //             let returnPageURL = localStorage.getItem('returnPage');
    //             localStorage.removeItem('returnPage');
    //             window.location.href = returnPageURL;
    //         } else {
    //             window.location.href = '/account';
    //         }
    //     } catch (error) {
    //         console.log('error', error.response);
    //         alert(error.response.data.error);
    //     }
    // }

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>

                    <Box component="form" onSubmit={signIn} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="signEmail"
                                    value={email}
                                    autoComplete="email"
                                    onInput={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="signPassword"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    id="password"
                                    autoComplete="new-password"
                                    onInput={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign in
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
