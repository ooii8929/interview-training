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
            localStorage.setItem('userid', response.data.data.user.id);
            localStorage.setItem('username', response.data.data.user.name);
            localStorage.setItem('useremail', response.data.data.user.email);
            if (localStorage.getItem('returnPage')) {
                let returnPageURL = localStorage.getItem('returnPage');
                localStorage.removeItem('returnPage');
                window.location.href = returnPageURL;
            }
            alert('登入成功');
        })
        .catch(function (error) {
            console.log(error);
        });
});

$('.form')
    .find('input, textarea')
    .on('keyup blur focus', function (e) {
        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {
            if ($this.val() === '') {
                label.removeClass('highlight');
            } else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }
    });

$('.tab a').on('click', function (e) {
    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);
});
