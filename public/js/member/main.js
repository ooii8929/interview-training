const username = sessionStorage.getItem('username');
const userEmail = sessionStorage.getItem('useremail');
// auth

document.addEventListener('load', () => {
    if (!username) {
        alert('You need login first');
        sessionStorage.setItem('returnPage', location.href);
        window.location.href = '/member/login.html';
    }
});
