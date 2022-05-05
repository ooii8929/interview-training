import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useContext } from 'react';
import ReactDom from 'react-dom';
import { AppContext } from '../../../../App';
import webSocket from 'socket.io-client';
import Moment from 'react-moment';
import { Card, CardContent, Typography } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
let pc;
let localStream;

const Main = () => {
    // const [pc, setPC] = useState('');
    const { Constant } = useContext(AppContext);
    let userName = localStorage.getItem('username');
    let userEmail = localStorage.getItem('useremail');
    const [searchParams] = useSearchParams();
    let room = searchParams.get('room');
    const [ws, setWs] = useState(null);
    const [offer, setOffer] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [chatArray, setChatArray] = useState([]);
    const [audioSourceArray, setAudioSourceArray] = useState([]);
    const [audioSource, setAudioSource] = useState('');
    const [videoSourceArray, setVideoSourceArray] = useState([]);
    const [videoSource, setVideoSource] = useState('');
    // const [localStream, setLocalStream] = useState("");
    const [localScreenStream, setLocalScreenStream] = useState('');
    const [useScreenStream, setUseScreenStream] = useState(false);
    const [initPeerConn, setInitPeerConn] = useState('');

    const localScreenVideo = useRef('');
    const remoteScreenVideo = useRef('');
    const [init, setInit] = useState('');
    const [newPeerConn, setNewPeerConn] = useState('');
    const [device, setDevice] = useState('');
    // const [pc, setPC] = useState('');
    const localVideo = useRef('');
    const remoteVideo = useRef('');
    const hangupButton = useRef('');
    const test = useRef('');
    const [isPC, setIsPC] = useState(false);
    const [isHandleOffer, setIsHandleOffer] = useState(false);
    const [isCandidate, setIsCandidate] = useState(false);

    const [shareScreenIsUse, setShareScreenIsUse] = useState(false);
    const [connect, setConnect] = useState(false);

    //TODO: 1. first render
    useEffect(() => {
        if (!ws) {
            console.log('1. connect ws');
            console.log('(1.) connect');
            setWs(webSocket(`${Constant[1]}`));
        }
    }, []);

    useEffect(() => {
        if (ws) {
            // async function initLocalStream() {
            //     console.log('2. Init Local Stream');
            //     let tmpLocalStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            //     console.log('tmpLocalStream', tmpLocalStream);
            //     localVideo.current.srcObject = tmpLocalStream;
            //     localStream = tmpLocalStream;
            // }
            // initLocalStream();
        }
    }, [ws]);

    useEffect(() => {
        if (localStream) {
            initWebSocket();
        }
        if (!localStream) {
            console.log('not ready yet');
        }
    }, [localStream]);

    const initWebSocket = () => {
        console.log('initWebSocket');
        ws.emit('join', room);
        ws.on('ready', async (msg) => {
            console.log('與對方建立連線');
            if (!pc) {
                makeCall();
            }
        });
        ws.on('offer', async (desc) => {
            console.log('(2.) 收到 offer', desc);
            handleOffer(desc);
        });

        ws.on('answer', async (desc) => {
            console.log('(6.) 收到 answer', desc);
            handleAnswer(desc);
        });

        ws.on('ice_candidate', async (desc) => {
            console.log('(7.) 收到 candidate', desc);
            handleCandidate(desc);
        });
    };

    async function makeCall() {
        await createPeerConnection();

        const offer = await pc.createOffer();
        ws.emit('offer', room, offer);
        await pc.setLocalDescription(offer);
    }

    function createPeerConnection() {
        const configuration = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                },
            ],
        };
        pc = new RTCPeerConnection(configuration);
        pc.onicecandidate = (e) => {
            const message = {
                type: 'candidate',
                candidate: null,
            };
            if (e.candidate) {
                message.candidate = e.candidate.candidate;
                message.sdpMid = e.candidate.sdpMid;
                message.sdpMLineIndex = e.candidate.sdpMLineIndex;
            }
            console.log('ice_candidate', message);
            ws.emit('ice_candidate', room, message);
        };

        console.log('run remoteVideo before', pc);
        pc.ontrack = (e) => {
            console.log('e', e.streams[0]);

            remoteVideo.current.srcObject = e.streams[0];
        };
        console.log('run remoteVideo after', pc);
        console.log('remoteVideo.current.srcObject', remoteVideo.current.srcObject);
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
        setIsPC(true);
    }

    async function handleOffer(offer) {
        console.log('handleOffer', offer);
        if (pc) {
            console.error('existing peerconnection');
            return;
        }
        await createPeerConnection();
        setIsHandleOffer(offer);
    }

    useEffect(
        (e) => {
            async function afterHandleOffer(offer) {
                console.log('pc', pc);
                await pc.setRemoteDescription(offer);

                const answer = await pc.createAnswer();
                ws.emit('answer', room, answer);
                await pc.setLocalDescription(answer);
                console.log('after offer', pc);
            }
            if (isPC) {
                afterHandleOffer(isHandleOffer);
            }
        },
        [isHandleOffer]
    );

    // useEffect(
    //     (e) => {
    //         async function afterCandidate() {
    //             console.log('run remoteVideo before', pc);
    //             pc.ontrack = (e) => {
    //                 console.log('e', e.streams[0]);

    //                 remoteVideo.current.srcObject = e.streams[0];
    //             };
    //             console.log('run remoteVideo after', pc);
    //             console.log('remoteVideo.current.srcObject', remoteVideo.current.srcObject);
    //             localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    //             setIsPC(true);
    //         }
    //         if (isCandidate) {
    //             console.log('run isCandidate');
    //             afterCandidate();
    //         }
    //     },
    //     [isCandidate]
    // );

    async function handleAnswer(answer) {
        if (!pc) {
            console.error('no peerconnection');
            return;
        }
        await pc.setRemoteDescription(answer);
    }

    async function handleCandidate(candidate) {
        if (!pc) {
            console.error('no peerconnection');
            return;
        }
        if (!candidate.candidate) {
            await pc.addIceCandidate(null);
        } else {
            await pc.addIceCandidate(candidate);
            setIsCandidate(candidate);
        }
    }
    /*-------------------------------------*/
    /*---------------Message---------------*/
    /*-------------------------------------*/

    function handleChange(event) {
        setNewMessage(event.target.value);
    }

    const handleSendMessage = () => {
        sendMsg(newMessage);
        setNewMessage('');
    };

    function sendMsg(msg) {
        let data = {
            room: room,
            msg: msg,
            sender: `${userName} (${userEmail})`,
            time: moment().format(),
        };

        //emit chat message
        ws.emit('chat', data);

        // add localchat
        addChat(data, 'local');
    }

    function addChat(data, senderType) {
        let senderName = 'You';
        if (senderType !== 'remote') {
            data.sender = senderName;
        }

        setChatArray((prevState) => {
            return [...prevState, data];
        });
    }

    /*-------------------------------------*/
    /*----------------Utils----------------*/
    /*-------------------------------------*/

    function hangup() {
        if (pc) {
            pc.close();
            pc = null;
        }
    }

    return (
        <div>
            <div>
                <video ref={localVideo} autoPlay playsInline className="video-screen localVideo"></video>
                <video ref={localScreenVideo} autoPlay playsInline className="video-screen"></video>
            </div>
            <video ref={remoteVideo} autoPlay playsInline className="video-screen remoteVideo"></video>
            <video ref={remoteScreenVideo} autoPlay playsInline className="video-screen"></video>
            <div className="select-device">
                <div>
                    <FormControl fullWidth>
                        <InputLabel>切換麥克風:</InputLabel>
                        <Select
                            id="audioSource"
                            value={audioSource}
                            defaultValue={audioSource}
                            onChange={(e) => {
                                setAudioSource(e.target.value);
                            }}
                        >
                            {audioSourceArray
                                ? audioSourceArray.map((e, index) => {
                                      return (
                                          <MenuItem value={e} key={index}>
                                              {e}
                                          </MenuItem>
                                      );
                                  })
                                : null}
                        </Select>
                    </FormControl>
                </div>

                <div className="select-device">
                    <FormControl fullWidth>
                        <InputLabel>切換攝影機:</InputLabel>
                        <Select
                            id="videoSource"
                            value={videoSource}
                            defaultValue={videoSource}
                            onChange={(e) => {
                                console.log('e.target.value', e.target.value);
                                setVideoSource(e.target.value);
                            }}
                        >
                            {videoSourceArray
                                ? videoSourceArray.map((e, index) => {
                                      return (
                                          <MenuItem value={e} key={index}>
                                              {e}
                                          </MenuItem>
                                      );
                                  })
                                : null}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div id="note-container">
                <div className=" chat-col d-print-none  bg-info chat-opened" id="chat-pane" style={{ display: 'block' }}>
                    <div>
                        <div className="chat-title">備忘錄</div>
                    </div>

                    <div id="chat-messages">
                        {chatArray
                            ? chatArray.map((e, index) => {
                                  return (
                                      <Card key={index} className="chat-block">
                                          <CardContent>
                                              <Typography variant="h5">{e.msg}</Typography>
                                              <Typography variant="h5">{e.time}</Typography>
                                              <Typography variant="h5">{e.sender}</Typography>
                                          </CardContent>
                                      </Card>
                                  );
                              })
                            : null}
                    </div>

                    <form className="chat-input">
                        <div className="input-group">
                            <input
                                type="text"
                                id="chat-input"
                                className="form-control rounded-0 chat-box border-info"
                                placeholder="Type here..."
                                value={newMessage}
                                onChange={handleChange}
                            ></input>
                            <div className="input-group-append" id="chat-input-btn">
                                <button type="button" className="btn btn-dark rounded-0 border-info btn-no-effect" onClick={handleSendMessage}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button
                type="button"
                className="btn btn-dark rounded-0 border-info btn-no-effect"
                onClick={() => {
                    setShareScreenIsUse(!shareScreenIsUse);
                }}
            >
                Share screen
            </button>
            <button
                type="button"
                className="btn btn-dark rounded-0 border-info btn-no-effect"
                onClick={async () => {
                    localStream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });
                    localVideo.current.srcObject = localStream;

                    setConnect(true);
                    ws.emit('join', room);
                }}
            >
                Start
            </button>
            <button
                type="button"
                className="btn btn-dark rounded-0 border-info btn-no-effect"
                ref={hangupButton}
                onClick={() => {
                    if (ws) {
                        ws.emit('leave', room);
                    }
                    hangup();
                }}
            >
                Hang up
            </button>
        </div>
    );
};

export default Main;
