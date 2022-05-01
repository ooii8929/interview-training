// get room and user infomation
const room = getUrlQuery(location.href);

// video 標籤
const localVideo = document.querySelector('video#localVideo');
const remoteVideo = document.querySelector('video#remoteVideo');
const localScreenVideo = document.querySelector('video#localScreenVideo');
const remoteScreenVideo = document.querySelector('video#remoteScreenVideo');

// button 標籤
const startBtn = document.querySelector('button#startBtn');
const leaveBtn = document.querySelector('button#leaveBtn');
const audioBtn = document.querySelector('button#audioBtn');
const VideoBtn = document.querySelector('button#VideoBtn');
const screenVideoBtn = document.querySelector('button#shareScreen');

// 切換設備
const audioInputSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [audioInputSelect, videoSelect];

let localStream;
let localScreenStream;
let peerConn;
let peerScreenConn;
let socket;

// ===================== 連線相關 =====================
/**
 * 連線 socket.io
 */
function connectIO() {
    console.log('socket connect');
    // socket
    socket = io('ws://0.0.0.0:3001');

    socket.on('ready', async (msg) => {
        console.log('get ready');
        // 發送 offer
        console.log('發送 offer ');
        await sendSDP(true);
    });

    socket.on('ice_candidate', async (data) => {
        console.log('收到 ice_candidate');
        const candidate = new RTCIceCandidate({
            sdpMLineIndex: data.label,
            candidate: data.candidate,
        });
        await peerConn.addIceCandidate(candidate);
    });

    socket.on('offer', async (desc) => {
        console.log('收到 offer');
        // 設定對方的配置
        await peerConn.setRemoteDescription(desc);

        // 發送 answer
        await sendSDP(false);
    });

    socket.on('answer', async (desc) => {
        console.log('收到 answer');

        // 設定對方的配置
        await peerConn.setRemoteDescription(desc);
    });

    socket.on('leaved', () => {
        console.log('收到 leaved');
        socket.disconnect();
        closeLocalMedia();
    });

    socket.on('bye', () => {
        console.log('收到 bye');
        hangup();
    });

    socket.emit('join', room);

    socket.on('chat', (data) => {
        addChat(data, 'remote');
    });
}

/**
 * 取得本地串流
 */
async function createStream() {
    try {
        const audioSource = audioInputSelect.value;
        const videoSource = videoSelect.value;
        const constraints = {
            audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            video: { deviceId: videoSource ? { exact: videoSource } : undefined },
        };

        // 取得影音的Stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // 提升作用域
        localStream = stream;

        console.log('stream', stream);

        // 導入<video>
        localVideo.srcObject = stream;
    } catch (err) {
        throw err;
    }
}

async function createScreenStream() {
    try {
        // 取得螢幕的Stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // 提升作用域
        localScreenStream = screenStream;
        console.log('screenStream', screenStream);
        // 導入<video>
        localScreenVideo.srcObject = screenStream;
    } catch (err) {
        throw err;
    }
}

/**
 * 初始化Peer連結
 */
function initPeerConnection() {
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    };
    peerConn = new RTCPeerConnection(configuration);
    console.log('First peerConn', peerConn);
    // 增加本地串流

    localStream.getTracks().forEach((track) => {
        peerConn.addTrack(track, localStream);
    });

    if (localScreenStream) {
        localScreenStream.getTracks().forEach((track) => {
            peerConn.addTrack(track, localScreenStream);
        });
    }

    console.log('Second peerConn', peerConn);

    // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
    peerConn.onicecandidate = (e) => {
        if (e.candidate) {
            console.log('發送 ICE');
            // 發送 ICE
            socket.emit('ice_candidate', room, {
                label: e.candidate.sdpMLineIndex,
                id: e.candidate.sdpMid,
                candidate: e.candidate.candidate,
            });
        }
    };

    // 監聽 ICE 連接狀態
    peerConn.oniceconnectionstatechange = (e) => {
        if (e.target.iceConnectionState === 'disconnected') {
            remoteVideo.srcObject = null;
            remoteScreenVideo.srcObject = null;
        }
    };

    // 監聽是否有流傳入，如果有的話就顯示影像
    console.log('remoteVideo.srcObject', peerConn);
    peerConn.ontrack = function (ev) {
        console.log('ev', ev);
        if (ev.track.kind !== 'video') {
            return;
        }
        if (!remoteVideo.srcObject) {
            console.log('set first');
            remoteVideo.srcObject = new MediaStream([ev.track]);
        } else {
            console.log('set second');
            remoteScreenVideo.srcObject = new MediaStream([ev.track]);
        }
    };
}

/**
 * 處理信令
 * @param {Boolean} isOffer 是 offer 還是 answer
 */
async function sendSDP(isOffer) {
    try {
        if (!peerConn) {
            initPeerConnection();
        }

        // 創建SDP信令
        const localSDP = await peerConn[isOffer ? 'createOffer' : 'createAnswer']({
            offerToReceiveAudio: true, // 是否傳送聲音流給對方
            offerToReceiveVideo: true, // 是否傳送影像流給對方
        });

        // 設定本地SDP信令
        await peerConn.setLocalDescription(localSDP);

        // 寄出SDP信令
        let e = isOffer ? 'offer' : 'answer';
        socket.emit(e, room, peerConn.localDescription);
    } catch (err) {
        throw err;
    }
}

/**
 * 關閉自己的視訊
 */
function closeLocalMedia() {
    if (localStream && localStream.getTracks()) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    localStream = null;
}

// close screen share
function closeScreenMedia() {
    if (localScreenStream && localScreenStream.getTracks()) {
        localScreenStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    localScreenStream = null;
}

/**
 * 掛掉電話
 */
function hangup() {
    if (peerConn) {
        peerConn.close();
        peerConn = null;
    }
}

/**
 * 初始化
 */
async function init() {
    await createStream();
    await createScreenStream();
    initPeerConnection();
    connectIO();
    startBtn.disabled = true;
    leaveBtn.disabled = false;
}

async function initScreen() {
    await createStream();
    await createScreenStream();
    initPeerConnection();
    connectIO();
    startBtn.disabled = true;
    leaveBtn.disabled = false;
}

// ===================== 切換設備 =====================
/**
 * 將讀取到的設備加入到 select 標籤中
 * @param {*} deviceInfos
 */
function gotDevices(deviceInfos) {
    const values = selectors.map((select) => select.value);
    selectors.forEach((select) => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
            audioInputSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        } else {
            // console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex];
        }
    });
}

/**
 * 讀取設備
 */
navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .catch((err) => {
        console.error('Error happens:', err);
    });

/**
 * 切換設備
 * @param {*} isAudio
 * @returns
 */
async function switchDevice(isAudio) {
    if (!peerConn) return;
    const audioSource = audioInputSelect.value;
    const videoSource = videoSelect.value;
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    let track = stream[isAudio ? 'getAudioTracks' : 'getVideoTracks']()[0];
    let sender = peerConn.getSenders().find(function (s) {
        return s.track.kind == track.kind;
    });
    console.log('found sender:', sender);
    sender.replaceTrack(track);

    localStream = stream;
    localVideo.srcObject = stream;
}

// ===================== 關閉鏡頭或麥克風 =====================
// local串流開關狀態
let streamOutput = { audio: true, video: true };

// screen串流開關狀態
let screenStreamOutput = { video: true };

/**
 *  設定按鈕文字
 */
function setBtnText() {
    console.log('before streamOutput', streamOutput);
    audioBtn.textContent = streamOutput.audio ? '關閉麥克風' : '開啟麥克風';
    VideoBtn.textContent = streamOutput.video ? '關閉鏡頭' : '開啟鏡頭';
    console.log('after streamOutput', streamOutput);
}

function setScreenBtnText() {
    screenVideoBtn.textContent = screenStreamOutput.video ? '關閉screen' : '開啟screen';
}

/**
 * 更新本地串流輸出狀態
 */
function setSelfStream() {
    localStream.getAudioTracks().forEach((item) => {
        item.enabled = streamOutput.audio;
    });

    localStream.getVideoTracks().forEach((item) => {
        item.enabled = streamOutput.video;
    });
    console.log('after disable localStream', localStream);
}

function setSelfScreenStream() {
    localScreenStream.getVideoTracks().forEach((item) => {
        item.enabled = screenStreamOutput.video;
    });
}

/**
 * 設定本地串流開關狀態
 * @param  {Object} e
 */
function handleStreamOutput(e) {
    const { name } = e.target;
    streamOutput = {
        ...streamOutput,
        [name]: !streamOutput[name],
    };
    setBtnText();
    setSelfStream();
}

function handleScreenStreamOutput(e) {
    const { name } = e.target;
    console.log('click disable screen', name);
    screenStreamOutput = {
        ...screenStreamOutput,
        [name]: !screenStreamOutput[name],
    };
    console.log('!!!', screenStreamOutput);
    setScreenBtnText();
    setSelfScreenStream();
}

// ===================== 監聽事件 =====================
/**
 * 進入頁面
 */
window.addEventListener('load', (event) => {
    init();
});
/**
 * 監聽按鈕點擊
 */
audioBtn.onclick = handleStreamOutput;
VideoBtn.onclick = handleStreamOutput;
screenVideoBtn.onclick = handleScreenStreamOutput;

startBtn.onclick = init;

leaveBtn.onclick = () => {
    if (socket) {
        socket.emit('leave', room);
    }
    hangup();
    startBtn.disabled = false;
    leaveBtn.disabled = true;
};

/**
 * 監聽 select 改變狀態
 */
audioInputSelect.onchange = () => {
    switchDevice(true);
};
videoSelect.onchange = () => {
    switchDevice(false);
};

document.querySelector('#logout').addEventListener('click', () => {
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('username');
    location.reload();
});

function getUrlQuery(url = '') {
    let queryStrings = decodeURIComponent(url).split('?');
    queryStrings = String(queryStrings[1]).replace('room=', '');
    return queryStrings;
}

// // control share screen
// document.getElementById('shareScreen').addEventListener('click', (e) => {
//     e.preventDefault();

//     if (localScreenStream && localScreenStream.getVideoTracks().length && localScreenStream.getVideoTracks()[0].readyState != 'ended') {
//         console.log('stop');
//         stopSharingScreen();
//     } else {
//         console.log('share now');
//         createScreenStream();
//     }
// });

// // stop share screen
// function stopSharingScreen() {
//     return new Promise((res, rej) => {
//         console.log('localScreenStream', localScreenStream);
//         localScreenStream.getTracks().length ? localScreenStream.getTracks().forEach((track) => track.stop()) : '';
//         console.log('localScreenStream', localScreenStream);
//         res();
//     })
//         .then(() => {
//             // broadcastNewTracks(myStream, 'video');
//         })
//         .catch((e) => {
//             console.error(e);
//         });
// }
