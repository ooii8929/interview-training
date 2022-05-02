const userID = localStorage.getItem('userid');
const userName = localStorage.getItem('username');
const userEmail = localStorage.getItem('useremail');
const logOut = document.querySelector('#logout');

// auth
window.addEventListener('load', () => {
    if (!userName) {
        alert('You need login first');
        localStorage.setItem('returnPage', location.href);
        window.location.href = '/member/login.html';
    }
});

logOut.addEventListener('click', (event) => {
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    location.reload();
});
