import React from 'react';

export default function Logout() {
    React.useEffect((e) => {
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        window.location.href = '/login';
    }, []);
}
