import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../App';
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
import './main.scss';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';

const theme = createTheme();

export default function SignUp() {
    const { Constant } = useContext(AppContext);
    const cookies = new Cookies();
    let navigate = useNavigate();
    const { userId, setUserId } = useContext(AppContext);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [identity, setIdentify] = React.useState('');
    const [signIdentity, setSignIdentify] = React.useState('');

    const [name, setName] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setIdentify(event.target.value);
    };

    const handleSignChange = (event: SelectChangeEvent) => {
        setSignIdentify(event.target.value);
    };

    async function signIn(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        console.log('user sign in', data.get('signIdentity'));
        try {
            let signInResponse = await axios({
                withCredentials: true,
                method: 'POST',
                credentials: 'same-origin',
                url: `${Constant[0]}/user/login`,
                data: {
                    identity: data.get('signIdentity'),
                    email: data.get('signEmail'),
                    password: data.get('signPassword'),
                    provider: 'native',
                },
                headers: { 'Access-Control-Allow-Origin': 'https://localhost:3001', 'Content-Type': 'application/json' },
            });

            console.log('signInResponse', signInResponse);
            //cookies.set('connect.sid', '2');
            Swal.fire({
                title: 'Success Login!',
                text: '歡迎回來',
                icon: 'success',
                confirmButtonText: 'Cool',
            });
            localStorage.setItem('userid', signInResponse.data.id);
            localStorage.setItem('username', signInResponse.data.name);
            localStorage.setItem('useremail', signInResponse.data.email);
            localStorage.setItem('identity', identity);

            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            } else {
                window.location.href = '/account';
            }
        } catch (error) {
            Swal.fire({
                title: 'Wrong password!',
                text: '再試看看！會不會是生日？',
                icon: 'error',
                confirmButtonText: '再試一次',
            });
        }
    }
    React.useEffect(
        (e) => {
            console.log('userId', userId);
            if (userId) {
                if (localStorage.getItem('returnPage')) {
                    let returnPageURL = localStorage.getItem('returnPage');
                    localStorage.removeItem('returnPage');
                    return navigate(returnPageURL);
                }
            }
        },
        [userId]
    );
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log('data', data);
        let registerInfo = {
            identity: data.get('identity'),
            name: data.get('name'),
            email: data.get('registerEmail'),
            password: data.get('registerPassword'),
            provider: 'native',
        };
        try {
            let updateResult;
            if (data.get('identity') === 'teacher') {
                updateResult = await axios.post(`${Constant[0]}/teacher/signup`, registerInfo);
            } else if (data.get('identity') === 'student') {
                updateResult = await axios.post(`${Constant[0]}/user/signup`, registerInfo);
            }
            console.log('update result', updateResult);
            localStorage.setItem('userid', updateResult.data.data.user.id);
            localStorage.setItem('username', updateResult.data.data.user.name);
            localStorage.setItem('useremail', updateResult.data.data.user.email);
            localStorage.setItem('identity', identity);
            Swal.fire({
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

    async function register(e) {
        try {
            let signInResponse = await axios.post(`${Constant[0]}/user/signup`, {
                data: {
                    name: name,
                    identity: identity,
                    email: registerEmail,
                    password: registerPassword,
                    provider: 'native',
                },
            });
            console.log(name, identity, registerEmail, registerPassword);

            localStorage.setItem('userid', signInResponse.data.data.user.id);
            localStorage.setItem('username', signInResponse.data.data.user.name);
            localStorage.setItem('useremail', signInResponse.data.data.user.email);
            localStorage.setItem('identity', identity);

            alert('success register');
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            } else {
                window.location.href = '/account';
            }
        } catch (error) {
            console.log('error', error.response);
            alert(error.response.data.error);
        }
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid container spacing={2} className="login-container">
                    <Grid item xs={5}>
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
                                    Register
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <FormControl className="role-form">
                                            <InputLabel id="demo-simple-select-autowidth-label">Role</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={identity}
                                                onChange={handleChange}
                                                autoWidth
                                                name="identity"
                                                label="identity"
                                            >
                                                <MenuItem value={'student'}>學生</MenuItem>
                                                <MenuItem value={'teacher'}>老師</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="name"
                                                label="Name"
                                                name="name"
                                                value={name}
                                                autoComplete="name"
                                                onInput={(e) => {
                                                    setName(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="registerEmail"
                                                label="Email Address"
                                                name="registerEmail"
                                                value={registerEmail}
                                                autoComplete="registerEmail"
                                                onInput={(e) => {
                                                    setRegisterEmail(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="registerPassword"
                                                label="registerPassword"
                                                type="password"
                                                value={registerPassword}
                                                id="registerPassword"
                                                autoComplete="registerPassword"
                                                onInput={(e) => {
                                                    setRegisterPassword(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        Register
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </Grid>
                    <Grid item xs={5}>
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
                                        <FormControl className="role-form">
                                            <InputLabel id="demo-simple-select-autowidth-label-login">Role</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={signIdentity}
                                                onChange={handleSignChange}
                                                autoWidth
                                                name="signIdentity"
                                                label="identity"
                                            >
                                                <MenuItem value={'student'}>學生</MenuItem>
                                                <MenuItem value={'teacher'}>老師</MenuItem>
                                            </Select>
                                        </FormControl>
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
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    );
}
