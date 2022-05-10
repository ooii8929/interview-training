import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function LoginForm(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    async function signIn(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (!props.identity) {
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

    return (
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
                    登入
                </Typography>

                <Box component="form" onSubmit={signIn} noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="信箱"
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
                                label="密碼"
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
                        登入
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
