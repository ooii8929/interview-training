// get room and user infomation
const room = getUrlQuery(location.href);

// definaiton
var pc = [];
let socket = io('/stream');
var socketId = '';
var myStream = '';
var mydisplayStream = '';
var screen = '';
var recordedStream = [];
var mediaRecorder = '';
const id2content = {};

// 1. set current user stream and display
getAndSetUserStream();

// 2. use socket send data to singling server and connect to another user
socket.on('connect', () => {
    //set socketId
    socketId = socket.io.engine.id;
    console.log(socketId, 'is our socket id');
    socket.emit('subscribe', {
        room: room,
        socketId: socketId,
    });

    socket.on('new user', (data) => {
        console.log('new user come', data.socketId);
        socket.emit('newUserStart', { to: data.socketId, sender: socketId });
        pc.push(data.socketId);
        init(true, data.socketId);
    });

    socket.on('newUserStart', (data) => {
        pc.push(data.sender);
        init(false, data.sender);
    });

    socket.on('ice candidates', async (data) => {
        data.candidate ? await pc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';
    });

    socket.on('sdp', async (data) => {
        if (data.description.type === 'offer') {
            data.description ? await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';

            getUserFullMedia()
                .then(async (stream) => {
                    if (!document.getElementById('local').srcObject) {
                        setLocalStream(stream);
                    }

                    //save my stream
                    myStream = stream;

                    stream.getTracks().forEach((track) => {
                        pc[data.sender].addTrack(track, stream);
                    });

                    let answer = await pc[data.sender].createAnswer();

                    await pc[data.sender].setLocalDescription(answer);

                    socket.emit('sdp', {
                        description: pc[data.sender].localDescription,
                        to: data.sender,
                        sender: socketId,
                    });
                })
                .catch((e) => {
                    console.error(e);
                });
        } else if (data.description.type === 'answer') {
            await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
        }
    });

    socket.on('chat', (data) => {
        addChat(data, 'remote');
    });
});

function getUrlQuery(url = '') {
    let queryStrings = decodeURIComponent(url).split('?');

    queryStrings = String(queryStrings[1]).replace('room=', '');
    return queryStrings;
}

function userMediaAvailable() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

// set user media
function getUserFullMedia() {
    if (userMediaAvailable()) {
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            },
        });
    } else {
        throw new Error('User media not available');
    }
}

function setLocalStream(stream, mirrorMode = true) {
    const localVidElem = document.getElementById('local');

    localVidElem.srcObject = stream;
    mirrorMode ? localVidElem.classList.add('mirror-mode') : localVidElem.classList.remove('mirror-mode');
}

//Get user video by default
function getAndSetUserStream() {
    getUserFullMedia()
        .then((stream) => {
            //save my stream
            myStream = stream;

            // display in local
            setLocalStream(stream);
            console.log('myStream', myStream);
        })
        .catch((e) => {
            console.error(`stream error: ${e}`);
        });
}

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

async function init(createOffer, partnerName) {
    // Google's public STUN server to get ice servers
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    };
    pc[partnerName] = new RTCPeerConnection(configuration);
    // pc[partnerName + '-share'] = new RTCPeerConnection(configuration);
    // pc[partnerName].onicecandidate = (e) => pc[partnerName + '-share'].addIceCandidate(e.candidate);
    // pc[partnerName + '-share'].onicecandidate = (e) => pc[partnerName].addIceCandidate(e.candidate);
    // console.log('pc', pc);
    // // share screen

    // pc[partnerName + '-share'].ontrack = (e) => {
    //     const track = e.track;
    //     const stream = e.streams[0];
    //     console.log('got track id=' + track.id, track);
    //     console.log('stream id=' + stream.id, stream);
    //     console.log('content', id2content[stream.id]);
    // };

    mydisplayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mydisplayStream.getTracks().forEach((track) => {
        pc[partnerName].addTrack(track, screen); //should trigger negotiationneeded event
    });
    myStream.getTracks().forEach((track) => {
        pc[partnerName].addTrack(track, myStream); //should trigger negotiationneeded event
    });
    // if (screen && screen.getTracks().length) {
    //     screen.getTracks().forEach((track) => {
    //         pc[partnerName].addTrack(track, screen); //should trigger negotiationneeded event
    //     });
    // } else if (myStream) {
    //     myStream.getTracks().forEach((track) => {
    //         pc[partnerName].addTrack(track, myStream); //should trigger negotiationneeded event
    //     });
    // } else {
    //     getUserFullMedia()
    //         .then((stream) => {
    //             //save my stream
    //             myStream = stream;

    //             stream.getTracks().forEach((track) => {
    //                 console.log('pc[partnerName]', pc[partnerName]);
    //                 pc[partnerName].addTrack(track, stream); //should trigger negotiationneeded event
    //             });

    //             setLocalStream(stream);
    //         })
    //         .catch((e) => {
    //             console.error(`stream error: ${e}`);
    //         });
    // }

    //create offer
    if (createOffer) {
        pc[partnerName].onnegotiationneeded = async () => {
            let offer = await pc[partnerName].createOffer();

            await pc[partnerName].setLocalDescription(offer);

            socket.emit('sdp', {
                description: pc[partnerName].localDescription,
                to: partnerName,
                sender: socketId,
            });
        };
    }

    //send ice candidate to partnerNames

    pc[partnerName].onicecandidate = ({ candidate }) => {
        socket.emit('ice candidates', {
            candidate: candidate,
            to: partnerName,
            sender: socketId,
        });
    };

    //add
    pc[partnerName].ontrack = (e) => {
        let str = e.streams[0];
        if (document.getElementById(`${partnerName}-video`)) {
            document.getElementById(`${partnerName}-video`).srcObject = str;
        } else {
            //video elem
            let newVid = document.createElement('video');
            newVid.id = `${partnerName}-video`;
            newVid.srcObject = str;
            newVid.autoplay = true;
            newVid.className = 'remote-video';

            //video controls elements
            let controlDiv = document.createElement('div');
            controlDiv.className = 'remote-video-controls';
            controlDiv.innerHTML = `<i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
                        <i class="fa fa-expand text-white expand-remote-video" title="Expand"></i>`;

            //create a new div for card
            let cardDiv = document.createElement('div');
            cardDiv.className = 'card card-sm';
            cardDiv.id = partnerName;
            cardDiv.appendChild(newVid);
            cardDiv.appendChild(controlDiv);

            //put div in main-section elem
            document.getElementById('videos').appendChild(cardDiv);

            adjustVideoElemSize();
        }
    };

    pc[partnerName].onconnectionstatechange = (d) => {
        switch (pc[partnerName].iceConnectionState) {
            case 'disconnected':
            case 'failed':
                closeVideo(partnerName);
                break;

            case 'closed':
                closeVideo(partnerName);
                break;
        }
    };

    pc[partnerName].onsignalingstatechange = (d) => {
        switch (pc[partnerName].signalingState) {
            case 'closed':
                console.log("Signalling state is 'closed'");
                closeVideo(partnerName);
                break;
        }
    };
}
function closeVideo(elemId) {
    if (document.getElementById(elemId)) {
        document.getElementById(elemId).remove();
        adjustVideoElemSize();
    }
}
function adjustVideoElemSize() {
    let elem = document.getElementsByClassName('card');
    let totalRemoteVideosDesktop = elem.length;
    let newWidth =
        totalRemoteVideosDesktop <= 2
            ? '50%'
            : totalRemoteVideosDesktop == 3
            ? '33.33%'
            : totalRemoteVideosDesktop <= 8
            ? '25%'
            : totalRemoteVideosDesktop <= 15
            ? '20%'
            : totalRemoteVideosDesktop <= 18
            ? '16%'
            : totalRemoteVideosDesktop <= 23
            ? '15%'
            : totalRemoteVideosDesktop <= 32
            ? '12%'
            : '10%';

    for (let i = 0; i < totalRemoteVideosDesktop; i++) {
        elem[i].style.width = newWidth;
    }
}

function sendMsg(msg) {
    let data = {
        room: room,
        msg: msg,
        sender: `${username} (${userEmail})`,
    };

    //emit chat message
    socket.emit('chat', data);

    //add localchat
    addChat(data, 'local');
}

function shareScreen() {
    shareScreenConfigure()
        .then((stream) => {
            toggleShareIcons(true);

            //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
            //It will be enabled was user stopped sharing screen
            toggleVideoBtnDisabled(true);

            //save my screen stream
            screen = stream;

            //share the new stream with all partners
            broadcastNewTracks(stream, 'video', false);

            // init

            //When the stop sharing button shown by the browser is clicked
            screen.getVideoTracks()[0].addEventListener('ended', () => {
                stopSharingScreen();
            });
        })
        .catch((e) => {
            console.error(e);
        });
}

function stopSharingScreen() {
    //enable video toggle btn
    toggleVideoBtnDisabled(false);

    return new Promise((res, rej) => {
        screen.getTracks().length ? screen.getTracks().forEach((track) => track.stop()) : '';

        res();
    })
        .then(() => {
            toggleShareIcons(false);
            broadcastNewTracks(myStream, 'video');
        })
        .catch((e) => {
            console.error(e);
        });
}

function shareScreenConfigure() {
    if (userMediaAvailable()) {
        return navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always',
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        });
    } else {
        throw new Error('User media not available');
    }
}

function toggleVideoBtnDisabled(disabled) {
    document.getElementById('toggle-video').disabled = disabled;
}

function toggleShareIcons(share) {
    let shareIconElem = document.querySelector('#share-screen');

    if (share) {
        shareIconElem.setAttribute('title', 'Stop sharing screen');
        shareIconElem.children[0].classList.add('text-primary');
        shareIconElem.children[0].classList.remove('text-white');
    } else {
        shareIconElem.setAttribute('title', 'Share screen');
        shareIconElem.children[0].classList.add('text-white');
        shareIconElem.children[0].classList.remove('text-primary');
    }
}
function broadcastNewTracks(stream, type, mirrorMode = true) {
    setLocalStream(stream, mirrorMode);

    let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

    pc.push('custom-screen');
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    };
    pc['custom-screen'] = new RTCPeerConnection(configuration);
    stream.getTracks().forEach((track) => {
        pc['custom-screen'].addTrack(track, stream);
    });
    console.log(pc);

    init(true, 'custom-screen');

    // for (let p in pc) {
    //     let pName = pc[p];

    //     // if the pc existed
    //     if (typeof pc[pName] == 'object') {
    //         replaceTrack(track, pc[pName]);
    //     }
    // }
}

async function negotiate() {
    await pc[partnerName].setLocalDescription();
    const msids = pc[partnerName].localDescription.sdp
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('a=msid:'));
    console.log('offer msids', msids);
    await pc[partnerName + '-share'].setRemoteDescription(pc[partnerName].localDescription);
    await pc[partnerName + '-share'].setLocalDescription();
    await pc[partnerName].setRemoteDescription(pc[partnerName + '-share'].localDescription);
}
// function replaceTrack(stream, recipientPeer) {
//     let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find((s) => s.track && s.track.kind === stream.kind) : false;

//     sender ? sender.replaceTrack(stream) : '';
// }

document.getElementById('share').addEventListener('click', async () => {
    mydisplayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    console.log('local screen id=' + mydisplayStream.id, mydisplayStream);
    id2content[mydisplayStream.id] = 'screen';
    console.log('pc[socketId]', pc);
    console.log('pc[socketId]', socketId);
    mydisplayStream.getTracks().forEach((t) => pc[socketId].addTrack(t, stream));
    init(false, socketId);
});
