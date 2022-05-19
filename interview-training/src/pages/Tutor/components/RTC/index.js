import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useContext } from 'react';
import { AppContext } from '../../../../App';
import webSocket from 'socket.io-client';
import { Card, CardContent, Typography } from '@mui/material';
import moment from 'moment';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
let pc;
let localStream;

const Main = () => {
  // btn hover
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [start, setStart] = useState(false);
  // Note appear
  const [noteStart, setNoteStart] = useState(false);
  const [noteHover, setNoteHover] = useState(false);

  let userName = localStorage.getItem('username');
  let userEmail = localStorage.getItem('useremail');
  const [searchParams] = useSearchParams();
  let room = searchParams.get('room');
  const [ws, setWs] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatArray, setChatArray] = useState([]);
  const [audioSourceArray, setAudioSourceArray] = useState([]);
  const [audioSource, setAudioSource] = useState('');
  const [videoSourceArray, setVideoSourceArray] = useState([]);
  const [videoSource, setVideoSource] = useState('');
  const [audioSourceDeviceId, setAudioSourceDeviceId] = useState('');
  const localVideo = useRef('');
  const remoteVideo = useRef('');
  const [isPC, setIsPC] = useState(false);
  const [isHandleOffer, setIsHandleOffer] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  const [shareScreenIsUse, setShareScreenIsUse] = useState(false);
  const [connect, setConnect] = useState(false);

  React.useEffect((e) => {}, [audioSource]);
  React.useEffect((e) => {}, [videoSourceArray]);
  React.useEffect((e) => {}, [audioSourceDeviceId]);
  React.useEffect((e) => {}, [isCandidate]);
  React.useEffect((e) => {}, [connect]);
  React.useEffect((e) => {}, [audioSourceArray]);

  //TODO: 1. first render
  useEffect(() => {
    if (!ws) {
      console.log('1. connect ws');
      console.log('(1.) connect');
      setWs(webSocket(`${process.env.REACT_APP_BASE_URL}`));
    }
  }, []);

  useEffect(() => {
    if (ws) {
      async function getDevice() {
        let deviceArr = await navigator.mediaDevices.enumerateDevices();
        let audioDeviceArr = deviceArr.filter((e) => {
          return e.kind === 'audioinput';
        });

        setAudioSourceArray(audioDeviceArr);
        let videoDeviceArr = deviceArr.filter((e) => {
          return e.kind === 'videoinput';
        });
        console.log(videoDeviceArr);
        setVideoSourceArray(videoDeviceArr);
      }
      getDevice();
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

    ws.on('chat', (data) => {
      console.log('data', data);
      addChat(data, 'remote');
    });

    ws.on('bye', () => {
      console.log('收到 bye');
      hangup();
    });

    ws.on('leaved', () => {
      console.log('收到 leaved');
      pc.oniceconnectionstatechange = function () {
        if (pc.iceConnectionState === 'disconnected') {
          pc.close();
          pc = null;
          remoteVideo.current.display = 'none';
          console.log('Disconnected');
        }
      };
      closeLocalMedia();
    });
  };
  /**
   * close user stream
   */
  function closeLocalMedia() {
    if (localStream && localStream.getTracks()) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    localStream = null;
  }

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

    // if connect fail ,then log
    pc.oniceconnectionstatechange = function () {
      if (pc.iceConnectionState === 'disconnected') {
        pc.close();
        pc = null;
        remoteVideo.current.display = 'none';
        console.log('Disconnected');
      }
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

  useEffect(() => {
    console.log('shareScreenIsUse', shareScreenIsUse);
    if (shareScreenIsUse) {
      async function display() {
        let screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        await screenStream.getTracks().forEach((track) => pc.addTrack(track, screenStream));
      }
      display();
    }
  }, [shareScreenIsUse]);

  useEffect(() => {
    if (videoSource) {
      setAudioSourceDeviceId(videoSource.deviceId);
      console.log(videoSource);
    }
  }, [videoSource]);

  useEffect(() => {
    if (audioSource) {
      setAudioSourceDeviceId(audioSource.deviceId);
      console.log(audioSource);
    }
  }, [audioSource]);

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

  //    <button
  //        type="button"
  //        className="btn btn-dark rounded-0 border-info btn-no-effect"
  //        onClick={() => {
  //            setShareScreenIsUse(!shareScreenIsUse);
  //        }}
  //    >
  //        Share screen
  //    </button>;

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

  const handleSendMessage = (e) => {
    e.preventDefault();
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
  const buttonStyle = ({ hover, focus }) => ({
    color: hover ? 'rgb(18 87 156)' : '#1976d2',
  });

  const stopButtonStyle = ({ hover, focus }) => ({
    color: hover ? 'rgb(133 15 35)' : 'rgb(210 25 56)',
  });

  const noteButtonStyle = ({ noteHover, focus }) => ({
    color: noteHover ? '#1976d2' : 'black',
  });

  const noteStopButtonStyle = ({ noteHover, focus }) => ({
    color: noteHover ? 'rgb(18 87 156)' : '#1976d2',
  });
  function hangup() {
    if (pc) {
      pc.close();
      pc = null;
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <div>
          <video ref={localVideo} autoPlay playsInline className="video-screen localVideo"></video>
        </div>
      </Grid>
      <Grid item xs={7}>
        <video ref={remoteVideo} autoPlay playsInline className="video-screen remoteVideo"></video>
      </Grid>
      <Grid item xs={2}>
        {noteStart ? (
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

              <form className="chat-input" onSubmit={handleSendMessage}>
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
                    <button type="submit" className="btn btn-dark rounded-0 border-info btn-no-effect">
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Grid>

      {start ? (
        <div
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          style={{ position: 'fixed', bottom: 20, left: '50%', fontSize: '70px' }}
          onClick={() => {
            setStart(false);
            if (ws) {
              ws.emit('leaved', room);
            }
            hangup();
          }}
        >
          <StopCircleIcon fontSize="inherit" style={stopButtonStyle({ hover, focus })} />
        </div>
      ) : (
        <div
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          style={{ position: 'fixed', bottom: 20, left: '50%', fontSize: '70px' }}
          onClick={async () => {
            setStart(true);
            localStream = await navigator.mediaDevices.getUserMedia({
              audio: true || { deviceId: audioSource },
              video: true || { deviceId: videoSource },
            });
            localVideo.current.srcObject = localStream;

            setConnect(true);
            ws.emit('join', room);
          }}
        >
          <PlayCircleIcon fontSize="inherit" style={buttonStyle({ hover, focus })} />
        </div>
      )}
      {noteStart ? (
        <div
          onPointerOver={() => setNoteHover(true)}
          onPointerOut={() => setNoteHover(false)}
          style={{ position: 'fixed', bottom: 40, left: '60%', fontSize: '40px' }}
          onClick={() => {
            setNoteStart(false);
          }}
        >
          <SpeakerNotesIcon fontSize="inherit" style={noteStopButtonStyle({ noteHover, focus })} />
        </div>
      ) : (
        <div
          onPointerOver={() => setNoteHover(true)}
          onPointerOut={() => setNoteHover(false)}
          style={{ position: 'fixed', bottom: 40, left: '60%', fontSize: '40px' }}
          onClick={async () => {
            setNoteStart(true);
          }}
        >
          <SpeakerNotesOffIcon fontSize="inherit" style={noteButtonStyle({ noteHover, focus })} />
        </div>
      )}
    </Grid>
  );
};

export default Main;
