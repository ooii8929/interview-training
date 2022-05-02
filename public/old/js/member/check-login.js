const userID = sessionStorage.getItem('userid');
const userName = sessionStorage.getItem('username');
const userEmail = sessionStorage.getItem('useremail');
const logOut = document.querySelector('#logout');

// auth
window.addEventListener('load', () => {
    if (!userName) {
        alert('You need login first');
        sessionStorage.setItem('returnPage', location.href);
        window.location.href = '/member/login.html';
    }
});

logOut.addEventListener('click', (event) => {
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('useremail');
    location.reload();
});
