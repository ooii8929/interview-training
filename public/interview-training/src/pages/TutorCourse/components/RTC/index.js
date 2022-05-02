import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import ReactDom from "react-dom";
import webSocket from "socket.io-client";
import Moment from "react-moment";
import { Card, CardContent, Typography } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import moment from "moment";

let peerConn;
let peerConn2;
let id2content = {};
let peerScreenConn;
let room = "222";
let devices;
let localStream;

// let ws;

const Main = () => {
  let userName = sessionStorage.getItem("username");
  let userEmail = sessionStorage.getItem("useremail");
  const [ws, setWs] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatArray, setChatArray] = useState([]);
  const [audioSourceArray, setAudioSourceArray] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [videoSourceArray, setVideoSourceArray] = useState([]);
  const [videoSource, setVideoSource] = useState("");
  // const [localStream, setLocalStream] = useState("");
  const [localScreenStream, setLocalScreenStream] = useState("");
  const [useScreenStream, setUseScreenStream] = useState(false);
  const [initPeerConn, setInitPeerConn] = useState("");

  const localScreenVideo = useRef("");

  const remoteScreenVideo = useRef("");
  const [init, setInit] = useState("");
  const [newPeerConn, setNewPeerConn] = useState("");
  const [device, setDevice] = useState("");
  const [pc, setPC] = useState("");
  const localVideo = useRef("");
  const remoteVideo = useRef("");
  const hangupButton = useRef("");

  const [shareScreenIsUse, setShareScreenIsUse] = useState(false);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (ws) {
      initWebSocket();
    }
  }, [connect]);

  //TODO: 1. first render
  useEffect(() => {
    // console.log("Site render");
    // // ws = webSocket("http://localhost:3001");
    if (!ws) {
      console.log("1. connect");
      console.log("(1.) connect");
      setWs(webSocket("http://localhost:3001"));
    }
    createStream();
    // // get device
    // setDevice((device) => true);
    // // createStream
    // createStream();
  }, []);

  useEffect(() => {
    //TODO: 2. get device
    if (!device) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((res) => {
          let videoSourceArray = [];
          let audioSourceArray = [];
          res.forEach((e) => {
            if (e.kind === "audioinput") {
              videoSourceArray.push(e.label);
            } else if (e.kind === "videoinput") {
              audioSourceArray.push(e.label);
            }
          });
          setVideoSourceArray(videoSourceArray);
          setAudioSourceArray(audioSourceArray);
        })
        .catch((err) => {
          console.error("Error happens:", err);
        });
    }
  }, [device]);

  // useEffect(() => {
  //   //TODO: 3. init peer connection
  //   if (localStream) {
  //     initPeerConnection();
  //   }
  // }, [localStream]);

  useEffect(() => {
    //TODO: 4. find ice and send to server
    console.log("peerConn update");
    if (peerConn) {
      initWebSocket();
      // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
      peerConn.onicecandidate = (e) => {
        if (e.candidate && peerConn.remoteDescription) {
          // 發送 ICE
          console.log("(9.) 發送 ice_candidate");
          ws.emit("ice_candidate", room, {
            label: e.candidate.sdpMLineIndex,
            id: e.candidate.sdpMid,
            candidate: e.candidate.candidate,
          });
        }
      };

      // 監聽 ICE 連接狀態
      peerConn.oniceconnectionstatechange = (e) => {
        if (e.target.iceConnectionState === "disconnected") {
          localVideo.current.srcObject = null;
          remoteScreenVideo.current.srcObject = null;
        }
      };

      // 監聽是否有流傳入，如果有的話就顯示影像
      peerConn.ontrack = function (ev) {
        console.log("10. 顯示影像", ev);
        if (ev.track.kind !== "video") {
          return;
        }
        if (!remoteVideo.current.srcObject) {
          console.log("10. 顯示視訊影像");
          remoteVideo.current.srcObject = new MediaStream([ev.track]);
        } else {
          console.log("10. 顯示螢幕分享");
          remoteScreenVideo.current.srcObject = new MediaStream([ev.track]);
        }
      };
    }
  }, [pc]);

  useEffect(() => {
    if (peerConn) {
      //連線成功在 console 中打印訊息
      console.log("success connect!");
    }
  }, [ws]);

  const handleSendMessage = () => {
    sendMsg(newMessage);
    setNewMessage("");
  };

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    ws.on("ready", async (msg) => {
      // 發送 offer
      // await sendSDP(true);
      makeCall();
    });

    ws.emit("join", room);
    ws.on("ice_candidate", async (data) => {
      handleCandidate(data);
    });

    ws.on("answer", async (desc) => {
      handleAnswer(desc);
    });

    ws.on("candidate", async (data) => {
      handleCandidate(data);
    });
    ws.on("leaved", () => {
      console.log("收到 leaved");
      ws.disconnect();
      closeLocalMedia();
    });

    ws.on("bye", () => {
      console.log("收到 bye");
      hangup();
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
      if (localScreenStream) {
        localScreenStream.getTracks().forEach((track) => track.stop());
        localScreenStream = null;
      }
    });

    //
    ws.on("offer", async (desc) => {
      console.log("(2.) 收到 offer", desc);

      handleOffer(desc);
    });

    ws.on("leaved", () => {
      console.log("收到 leaved");
      ws.disconnect();
      closeLocalMedia();
    });

    ws.on("bye", () => {
      console.log("收到 bye");
      hangup();
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
      if (localScreenStream) {
        localScreenStream.getTracks().forEach((track) => track.stop());
        localScreenStream = null;
      }
    });

    ws.on("share", () => {
      console.log("Get share screen need", peerConn);
      peerConn.ontrack = (ev) => {
        console.log("Get share screen peerConn", ev);
        if (!remoteVideo.current.srcObject) {
          console.log("set first");
          remoteVideo.current.srcObject = new MediaStream([ev.track]);
        } else {
          console.log("set second");
          remoteScreenVideo.current.srcObject = new MediaStream([ev.track]);
        }
      };
    });

    ws.on("chat", (data) => {
      console.log("data", data);
      addChat(data, "remote");
    });
  };

  function hangup() {
    if (peerConn) {
      peerConn.close();
      peerConn = null;
    }
  }

  async function makeCall() {
    console.log("makeCall");
    await initPeerConnection();

    const offer = await peerConn.createOffer();
    console.log("offer", offer);
    ws.emit("offer", { sdp: offer.sdp });
    await peerConn.setLocalDescription(offer);
  }

  async function handleOffer(offer) {
    if (peerConn) {
      console.error("existing peerconnection");
      return;
    }
    await initPeerConnection();
    await peerConn.setRemoteDescription(offer);

    const answer = await peerConn.createAnswer();
    ws.emit("answer", { sdp: answer.sdp });
    await peerConn.setLocalDescription(answer);
  }

  async function handleCandidate(candidate) {
    if (!peerConn) {
      console.error("no peerconnection");
      return;
    }
    if (!candidate.candidate) {
      await peerConn.addIceCandidate(null);
    } else {
      await peerConn.addIceCandidate(candidate);
    }
  }
  async function handleAnswer(answer) {
    if (!peerConn) {
      console.error("no peerconnection");
      return;
    }
    await peerConn.setRemoteDescription(answer);
  }

  function closeLocalMedia() {
    if (localStream && localStream.getTracks()) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    // setLocalStream(null);
    localStream = null;
  }

  function addChat(data, senderType) {
    let senderName = "You";
    if (senderType !== "remote") {
      data.sender = senderName;
    }

    setChatArray((prevState) => {
      return [...prevState, data];
    });
  }

  function sendMsg(msg) {
    let data = {
      room: room,
      msg: msg,
      sender: `${userName} (${userEmail})`,
      time: moment().format(),
    };

    //emit chat message
    ws.emit("chat", data);

    // add localchat
    addChat(data, "local");
  }

  function initPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    peerConn = new RTCPeerConnection(configuration);
    peerConn2 = new RTCPeerConnection(configuration);
    console.log("生成 peerConn");
    peerConn.onicecandidate = (e) => {
      const message = {
        type: "candidate",
        candidate: null,
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      console.log("發送 ice_candidate");
      ws.emit("ice_candidate", message);
    };

    peerConn.ontrack = (e) => (remoteVideo.current.srcObject = e.streams[0]);

    localStream
      .getTracks()
      .forEach((track) => peerConn.addTrack(track, localStream));
  }

  function sendScreenPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    peerConn = new RTCPeerConnection(configuration);

    console.log("2. peerConn", peerConn);

    // // 增加本地串流
    // localStream.getTracks().forEach((track) => {
    //   peerConn.addTrack(track, localStream);
    // });

    console.log("3. peerConn add track(local stream)", peerConn);

    setPC(true);
  }

  useEffect(() => {
    if (chatArray.length !== 0) {
      console.log("chatArray effect", chatArray);
    }
  }, [chatArray]);

  useEffect(() => {
    if (videoSourceArray.length !== 0) {
      console.log("videoSourceArray", videoSourceArray);
    }
  }, [videoSourceArray]);

  useEffect(() => {
    if (audioSourceArray.length !== 0) {
      console.log("audioSourceArray", audioSourceArray);
    }
  }, [audioSourceArray]);

  // useEffect(() => {
  //   async function reinit() {
  //     // await createScreenStream();
  //     await initPeerConnection();
  //     await initWebSocket();
  //   }
  //   if (init) {
  //     console.log("run screen stream");
  //     reinit();
  //   }
  // }, [init]);

  function handleChange(event) {
    setNewMessage(event.target.value);
  }

  async function createStream() {
    console.log("1. creat stream");
    // createStream
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localVideo.current.srcObject = localStream;

      setConnect(true);
    } catch (err) {
      throw err;
    }
  }

  useEffect(
    (e) => {
      console.log("[share screen] btn click");
      shareScreenStream(shareScreenIsUse);
    },
    [shareScreenIsUse]
  );

  async function shareScreenStream(shareScreenIsUse) {
    if (shareScreenIsUse) {
      console.log("[share screen] open");
      try {
        // 取得螢幕的Stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        console.log("[share screen] get stream", screenStream);

        // // test
        // id2content[screenStream.id] = "screen";
        // screenStream
        //   .getTracks()
        //   .foreach((t) => peerConn.addTrack(t, screenStream));
        // negotiate();

        // 導入<video>
        localScreenVideo.current.srcObject = screenStream;
        console.log("[share screen] update div");
        // const configuration = {
        //   iceServers: [
        //     {
        //       urls: "stun:stun.l.google.com:19302",
        //     },
        //   ],
        // };

        // peerConn = new RTCPeerConnection(configuration);

        screenStream.getTracks().forEach((track) => {
          peerConn.addTrack(track, screenStream);
        });

        // const constraints = {
        //   video: {
        //     deviceId: videoSource ? { exact: videoSource } : undefined,
        //   },
        //   audio: {
        //     deviceId: audioSource ? { exact: audioSource } : undefined,
        //   },
        // };

        // // 取得影音的Stream
        // const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // // 導入<video>
        // console.log("1. 導入<video>");
        // localVideo.current.srcObject = stream;

        // localStream.getTracks().forEach((track) => {
        //   peerConn.addTrack(track, localStream);
        // });

        // setPC(!pc);

        console.log("[share screen]", peerConn);

        // screenStream.getVideoTracks().forEach((item) => {
        //   item.enabled = true;
        // });

        ws.emit("share", room, { pc: peerConn });

        console.log("[share screen] add to peerconn", peerConn);

        // console.log("[share screen] send", peerConn);
      } catch (err) {
        console.log("[share screen] error", err);
        throw err;
      }
    }
  }

  return (
    <div>
      <div>
        <video
          ref={localVideo}
          autoPlay
          playsInline
          className="video-screen"
        ></video>
        <video
          ref={localScreenVideo}
          autoPlay
          playsInline
          className="video-screen"
        ></video>
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          className="video-screen"
        ></video>
        <video
          ref={remoteScreenVideo}
          autoPlay
          playsInline
          className="video-screen"
        ></video>
      </div>
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
                console.log("e.target.value", e.target.value);
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
      <div className="container">
        <div
          className="col-md-12 chat-col d-print-none mb-2 bg-info chat-opened"
          id="chat-pane"
          style={{ display: "block" }}
        >
          <div className="row">
            <div className="col-12 text-center h2 mb-3">CHAT</div>
          </div>

          <div id="chat-messages">
            {chatArray
              ? chatArray.map((e, index) => {
                  return (
                    <Card key={index}>
                      <CardContent>
                        <Typography variant="h3">{e.msg}</Typography>
                        <Typography variant="h3">{e.time}</Typography>
                        <Typography variant="h3">{e.sender}</Typography>
                      </CardContent>
                    </Card>
                  );
                })
              : null}
          </div>

          <form>
            <div className="input-group mb-3">
              <input
                type="text"
                id="chat-input"
                className="form-control rounded-0 chat-box border-info"
                rows="3"
                placeholder="Type here..."
                value={newMessage}
                onChange={handleChange}
              ></input>
              <div className="input-group-append" id="chat-input-btn">
                <button
                  type="button"
                  className="btn btn-dark rounded-0 border-info btn-no-effect"
                  onClick={handleSendMessage}
                >
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
          ws.emit("join", room);
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
            ws.emit("leave", room);
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
