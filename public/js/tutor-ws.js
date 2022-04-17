socket.on('connect', () => {
    //set socketId
    socketId = socket.io.engine.id;
    document.getElementById('randomNumber').innerText = randomNumber;

    socket.emit('subscribe', {
        room: room,
        socketId: socketId,
    });

    socket.on('new user', (data) => {
        socket.emit('newUserStart', { to: data.socketId, sender: socketId });
        pc.push(data.socketId);
        init(true, data.socketId);
    });

    socket.on('newUserStart', (data) => {
        pc.push(data.sender);
        init(false, data.sender);
    });

    console.log(pc);

    socket.on('ice candidates', async (data) => {
        data.candidate ? await pc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';
    });

    socket.on('sdp', async (data) => {
        if (data.description.type === 'offer') {
            data.description ? await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';

            h.getUserFullMedia()
                .then(async (stream) => {
                    if (!document.getElementById('local').srcObject) {
                        h.setLocalStream(stream);
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
        h.addChat(data, 'remote');
    });
});
