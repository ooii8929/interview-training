import React from 'react';

export default function Logout() {
    React.useEffect((e) => {
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
        localStorage.removeItem('identity');
        window.location.href = '/login';
    }, []);
}
