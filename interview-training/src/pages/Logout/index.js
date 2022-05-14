import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../../App';
import axios from 'axios';
import Cookies from 'universal-cookie';

export default function Logout() {
    const { Constant } = useContext(AppContext);

    React.useEffect((e) => {
        async function logout() {
            await axios({
                withCredential: true,
                method: 'POST',
                url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/logout`,
            });
            await localStorage.removeItem('userid');
            await localStorage.removeItem('username');
            await localStorage.removeItem('useremail');
            await localStorage.removeItem('identity');
            //document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            console.log('run deleteAllCookies after');
            // window.location.href = '/login';
        }

        logout();
    }, []);
}
