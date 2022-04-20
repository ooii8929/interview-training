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

function addChat(data, senderType) {
    let chatMsgDiv = document.querySelector('#chat-messages');
    let contentAlign = 'justify-content-end';
    let senderName = 'You';
    let msgBg = 'bg-white';

    if (senderType === 'remote') {
        contentAlign = 'justify-content-start';
        senderName = data.sender;
        msgBg = '';
    }

    let infoDiv = document.createElement('div');
    infoDiv.className = 'sender-info';
    infoDiv.innerText = `${senderName} - ${moment().format('Do MMMM, YYYY h:mm a')}`;

    let colDiv = document.createElement('div');
    colDiv.className = `col-10 card chat-card msg ${msgBg}`;
    colDiv.innerHTML = data.msg;
    let rowDiv = document.createElement('div');
    rowDiv.className = `row ${contentAlign} mb-2`;

    colDiv.appendChild(infoDiv);
    rowDiv.appendChild(colDiv);

    chatMsgDiv.appendChild(rowDiv);

    /**
     * Move focus to the newly added message but only if:
     * 1. Page has focus
     * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
     */
    if (this.pageHasFocus) {
        rowDiv.scrollIntoView();
    }
}

function sendMsg(msg) {
    let data = {
        room: room,
        msg: msg,
        sender: `${userName} (${userEmail})`,
    };

    //emit chat message
    socket.emit('chat', data);

    //add localchat
    addChat(data, 'local');
}
