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
const theme = createTheme();

export default function SignUp() {
    const { Constant } = useContext(AppContext);

    let navigate = useNavigate();
    const { setProfileQuestion, profileQuestion, jobType, userId, setUserId } = useContext(AppContext);
    const [email, setEmail] = React.useState('');
    const [isLogin, setIsLogin] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [identity, setIdentify] = React.useState('');
    const [name, setName] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setIdentify(event.target.value);
    };

    async function signIn(e) {
        try {
            let signInResponse = await axios.post(`${Constant}/user/login`, {
                data: {
                    email: email,
                    password: password,
                    provider: 'native',
                },
            });

            localStorage.setItem('userid', signInResponse.data.data.user.id);
            localStorage.setItem('username', signInResponse.data.data.user.name);
            localStorage.setItem('useremail', signInResponse.data.data.user.email);
            setUserId(signInResponse.data.data.user.id);
            alert('success login');
            // setIsLogin(true);
        } catch (error) {
            alert('wrong password');
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
            if (data.get('identity') == 'teacher') {
                updateResult = await axios.post(`${Constant}/teacher/signup`, registerInfo);
            } else if (data.get('identity') == 'student') {
                updateResult = await axios.post(`${Constant}/user/signup`, registerInfo);
            }
            console.log('update result', updateResult);
            localStorage.setItem('userid', updateResult.data.data.user.id);
            localStorage.setItem('username', updateResult.data.data.user.name);
            localStorage.setItem('useremail', updateResult.data.data.user.email);
            alert('success register');
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            }
        } catch (error) {
            console.log('update error', error);
        }
    };

    async function register(e) {
        try {
            let signInResponse = await axios.post(`${Constant}/user/signup`, {
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

            alert('success register');
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
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
                    </Grid>{' '}
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
                                <Box component="form" noValidate sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
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
                                                name="password"
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
                                    <Button type="button" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={signIn}>
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
