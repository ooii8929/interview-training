import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../App';
import axios from 'axios';

export default function Logout() {
    const { Constant } = useContext(AppContext);

    React.useEffect((e) => {
        async function logout() {
            await axios({
                withCredential: true,
                method: 'POST',
                url: `${Constant[0]}/user/logout`,
            });
            localStorage.removeItem('userid');
            localStorage.removeItem('username');
            localStorage.removeItem('useremail');
            localStorage.removeItem('identity');
            window.location.href = '/login';
        }

        logout();
    }, []);
}
