import React from 'react';

export default function Logout() {
    React.useEffect((e) => {
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('username');
        window.location.href = '/login';
    }, []);
}
