import React from 'react';
import axios from 'axios';

export default function Logout() {
  React.useEffect((e) => {
    async function logout() {
      await axios({
        withCredential: true,
        credentials: 'same-origin',
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/logout`,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });
      await localStorage.removeItem('userid');
      await localStorage.removeItem('username');
      await localStorage.removeItem('useremail');
      await localStorage.removeItem('identity');
      //document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      console.log('run deleteAllCookies after');
      window.location.href = '/login';
    }

    logout();
  }, []);
}
