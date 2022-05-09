import Swal from 'sweetalert2';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Constant from './Constant.js';

export default function RequireAuth({ Component }) {
    let location = useLocation();
    let profile;
    async function getProfile() {
        profile = await axios({
            withCredentials: true,
            method: 'GET',
            credentials: 'same-origin',
            url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/profile`,
            headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
        });
    }
    getProfile();
    if (!profile) {
        Swal.fire({
            title: '你還沒登入，對拔!',
            text: '先登入讓我們好好認識你呀',
            icon: 'error',
            confirmButtonText: '好，立刻登入',
        });
        localStorage.setItem('returnPage', location.pathname);
        return <Navigate to="/login" />;
    }

    console.log('profile', profile);
    console.log('Auth');
    return <Component />;
}
