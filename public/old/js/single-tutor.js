const myScreen = document.querySelector('#screenShare');
const myVideo = document.querySelector('#myVideo');
const videoElem = document.getElementById('screenVideo');
const startElem = document.getElementById('start');
const stopElem = document.getElementById('stop');

// 0. Share screen
var displayMediaOptions = {
    video: {
        cursor: 'always',
    },
    audio: false,
};

// Set event listeners for the start and stop buttons
startElem.addEventListener(
    'click',
    function (evt) {
        startCapture();
    },
    false
);

stopElem.addEventListener(
    'click',
    function (evt) {
        stopCapture();
    },
    false
);

async function startCapture() {
    // logElem.innerHTML = "";

    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        // dumpOptionsInfo();
    } catch (err) {
        console.error('Error: ' + err);
    }
}

function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
}

// 1. Connect to signal server
const socket = io('https://wooah.app');
function joinRoom() {
    socket.emit('joinRoom', 'secret room');
}
joinRoom();

const initialBtn = document.querySelector('.initialBtn');

async function initPeerConnection() {
    await createPeerConnection();
    await createMedia();
    await getAudioVideo();
    await addLocalStream();
    await onIceCandidates();
    await onIceconnectionStateChange();
    onAddStream();
}

initialBtn.addEventListener('click', initPeerConnection);

// 1.1. Connect notification
socket.on('roomBroadcast', (message) => {
    console.log('房間廣播 => ', message);
});

// 2. Create PeerConnection
let pc;

async function createPeerConnection() {
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302', // Google's public STUN server
            },
        ],
    };
    pc = await new RTCPeerConnection(configuration);
    console.log(`建立 peer connection`, pc);
}

// 3. Add streams
let localstream;
let screenStream;

// 初始化影像/聲音
async function createMedia() {
    // 儲存本地流到全域
    localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    myVideo.srcObject = localstream;
}

// 取得裝置名稱
function getAudioVideo() {
    const video = localstream.getVideoTracks();
    const audio = localstream.getAudioTracks();

    if (video.length > 0) {
        console.log(`使用影像裝置 => ${video[0].label}`);
    }
    if (audio.length > 0) {
        console.log(`使用聲音裝置 => ${audio[0].label}`);
    }
}

function addLocalStream() {
    pc.addStream(localstream);
    console.log(`建立 stream`, pc.addStream);
}

// 4. create offer(by signal)
const sendOffer = document.querySelector('.sendOffer');

sendOffer.addEventListener('click', () => {
    createSignal(true);
});

let offer;

const signalOption = {
    offerToReceiveAudio: 1, // 是否傳送聲音流給對方
    offerToReceiveVideo: 1, // 是否傳送影像流給對方
};

async function createSignal(isOffer) {
    try {
        if (!pc) {
            console.log('尚未開啟視訊');
            return;
        }
        // 呼叫 peerConnect 內的 createOffer / createAnswer
        offer = await pc[`create${isOffer ? 'Offer' : 'Answer'}`](signalOption);
        console.log('offer');
        console.log(offer);
        // 設定本地流配置
        await pc.setLocalDescription(offer);
        sendSignalingMessage(pc.localDescription, isOffer ? true : false);
    } catch (err) {
        console.log(err);
    }
}

// 5. send offer to signal server
function sendSignalingMessage(desc, offer) {
    const isOffer = offer ? 'offer' : 'answer';
    console.log(`寄出 ${isOffer}`);
    socket.emit('peerconnectSignaling', { desc });
}

// 6. Get candidate

// 監聽 ICE Server
async function onIceCandidates() {
    // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
    pc.onicecandidate = ({ candidate }) => {
        if (!candidate) {
            return;
        }

        console.log('onIceCandidate => ', candidate);
        socket.emit('peerconnectSignaling', { candidate });
    };
}

// 監聽 ICE 連接狀態
function onIceconnectionStateChange() {
    pc.oniceconnectionstatechange = (evt) => {
        console.log('ICE 伺服器狀態變更 => ', evt.target.iceConnectionState);
    };
}

// 7. 監聽是否有流傳入，如果有的話就顯示影像
const remoteVideo = document.querySelector('#remoteVideo');

function onAddStream() {
    pc.onaddstream = (event) => {
        if (!remoteVideo.srcObject && event.stream) {
            remoteVideo.srcObject = event.stream;
            console.log('接收流並顯示於遠端視訊！', event);
        }
    };
}

socket.on('peerconnectSignaling', async ({ desc, candidate }) => {
    // desc 指的是 Offer 與 Answer
    // currentRemoteDescription 代表的是最近一次連線成功的相關訊息
    if (desc && !pc.currentRemoteDescription) {
        console.log('desc => ', desc);

        await pc.setRemoteDescription(new RTCSessionDescription(desc));
        await createSignal(desc.type === 'answer' ? true : false);
    } else if (candidate) {
        // 新增對方 IP 候選位置
        console.log('candidate =>', candidate);
        pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});