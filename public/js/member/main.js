const signIn = document.querySelector('#signInBtn');

signIn.addEventListener('click', (event) => {
    const signInEmail = document.querySelector('#signInEmail').value;
    const signInPassword = document.querySelector('#signInPassword').value;

    // TODO do something here to show user that form is being submitted
    axios
        .post('/api/1.0/user/login', {
            data: {
                email: signInEmail,
                password: signInPassword,
                provider: 'native',
            },
        })
        .then(function (response) {
            sessionStorage.setItem('userid', response.data.data.user.id);
            sessionStorage.setItem('username', response.data.data.user.name);
            sessionStorage.setItem('useremail', response.data.data.user.email);
            if (sessionStorage.getItem('returnPage')) {
                let returnPageURL = sessionStorage.getItem('returnPage');
                sessionStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});
