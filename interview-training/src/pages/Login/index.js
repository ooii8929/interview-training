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
import './main.scss';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import Toggle from './Toggle';

const theme = createTheme();

export default function SignUp() {
    const cookies = new Cookies();
    let navigate = useNavigate();
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
        localStorage.setItem('identity', event.target.value);
    };

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
                    identity: data.get('signIdentity'),
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
            localStorage.setItem('userid', signInResponse.data.id);
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
            identity: data.get('identity'),
            name: data.get('name'),
            email: data.get('registerEmail'),
            password: data.get('registerPassword'),
            provider: 'native',
        };
        try {
            let updateResult;
            if (data.get('identity') === 'teacher') {
                updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/teacher/signup`, registerInfo);
            } else if (data.get('identity') === 'student') {
                updateResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/signup`, registerInfo);
            }
            console.log('update result', updateResult);
            localStorage.setItem('userid', updateResult.data.data.user.id);
            localStorage.setItem('username', updateResult.data.data.user.name);
            localStorage.setItem('useremail', updateResult.data.data.user.email);
            // localStorage.setItem('identity', identity);
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
    //                 identity: identity,
    //                 email: registerEmail,
    //                 password: registerPassword,
    //                 provider: 'native',
    //             },
    //         });
    //         console.log(name, identity, registerEmail, registerPassword);

    //         localStorage.setItem('userid', signInResponse.data.data.user.id);
    //         localStorage.setItem('username', signInResponse.data.data.user.name);
    //         localStorage.setItem('useremail', signInResponse.data.data.user.email);
    //         localStorage.setItem('identity', identity);

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
        <div className="login-page-container">
            <Toggle></Toggle>
        </div>
    );
}
