document.write('<script src="./utils/utils.js"></script>');

window.addEventListener('load', () => {
    let time = document.querySelector('#meeting-time').value;
    function generateUrl() {
        if (time) {
            console.log(time);
            //create room link
            let roomLink = `${location.origin}?room=${time}_${utils.generateRandomString()}`;
            console.log(roomLink);
            // //show message with link to room
            // document.querySelector('#room-created').innerHTML = `Room successfully created. Click <a href='${roomLink}'>here</a> to enter room.
            // Share the room link with your partners.`;

            // //empty the values
            // document.querySelector('#room-name').value = '';
            // document.querySelector('#your-name').value = '';
        } else {
            document.querySelector('#err-msg').innerText = 'All fields are required';
        }
    }
    console.log('location.origin');
    console.log(location.origin);
});
