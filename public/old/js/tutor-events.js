window.addEventListener('load', () => {
    //When the video frame is clicked. This will enable picture-in-picture
    document.getElementById('local').addEventListener('click', () => {
        if (!document.pictureInPictureElement) {
            document
                .getElementById('local')
                .requestPictureInPicture()
                .catch((error) => {
                    // Video failed to enter Picture-in-Picture mode.
                    console.error(error);
                });
        } else {
            document.exitPictureInPicture().catch((error) => {
                // Video failed to leave Picture-in-Picture mode.
                console.error(error);
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('expand-remote-video')) {
            helpers.maximiseStream(e);
        } else if (e.target && e.target.classList.contains('mute-remote-mic')) {
            helpers.singleStreamToggleMute(e);
        }
    });

    document.getElementById('chat-input-btn').addEventListener('click', (e) => {
        console.log('here: ', document.getElementById('chat-input').value);
        if (document.getElementById('chat-input').value.trim()) {
            sendMsg(document.getElementById('chat-input').value);

            setTimeout(() => {
                document.getElementById('chat-input').value = '';
            }, 50);
        }
    });

    //Chat textarea
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.which === 13 && e.target.value.trim()) {
            e.preventDefault();

            sendMsg(e.target.value);

            setTimeout(() => {
                e.target.value = '';
            }, 50);
        }
    });
    //When user clicks the 'Share screen' button
    document.getElementById('share-screen').addEventListener('click', (e) => {
        e.preventDefault();

        if (screen && screen.getVideoTracks().length && screen.getVideoTracks()[0].readyState != 'ended') {
            stopSharingScreen();
        } else {
            shareScreen();
        }
    });

    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        location.reload();
    });
});
