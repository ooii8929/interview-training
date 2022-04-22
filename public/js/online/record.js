AWS.config.region = 'ap-northeast-1'; // 1. Enter your region

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:29cd3671-0681-41ef-b6ff-b9447252b554', // 2. Enter your identity pool
});

AWS.config.credentials.get(function (err) {
    if (err) alert(err);
    console.log(AWS.config.credentials);
});

var bucketName = 'interview-appworks';

var bucket = new AWS.S3({
    params: {
        Bucket: bucketName,
    },
});

(function () {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match,
        search = window.location.search;
    while ((match = r.exec(search.substring(1)))) {
        params[d(match[1])] = d(match[2]);

        if (d(match[2]) === 'true' || d(match[2]) === 'false') {
            params[d(match[1])] = d(match[2]) === 'true' ? true : false;
        }
    }

    window.params = params;
})();

function addStreamStopListener(stream, callback) {
    stream.addEventListener(
        'ended',
        function () {
            callback();
            callback = function () {};
        },
        false
    );
    stream.addEventListener(
        'inactive',
        function () {
            callback();
            callback = function () {};
        },
        false
    );
    stream.getTracks().forEach(function (track) {
        track.addEventListener(
            'ended',
            function () {
                callback();
                callback = function () {};
            },
            false
        );
        track.addEventListener(
            'inactive',
            function () {
                callback();
                callback = function () {};
            },
            false
        );
    });
}

var video = document.createElement('video');
video.controls = false;
var mediaElement = getHTMLMediaElement(video, {
    title: 'Recording status: inactive',
    buttons: ['full-screen' /*, 'take-snapshot'*/],
    showOnMouseEnter: false,
    width: 360,
    onTakeSnapshot: function () {
        var canvas = document.createElement('canvas');
        canvas.width = mediaElement.clientWidth;
        canvas.height = mediaElement.clientHeight;

        var context = canvas.getContext('2d');
        context.drawImage(recordingPlayer, 0, 0, canvas.width, canvas.height);

        window.open(canvas.toDataURL('image/png'));
    },
});
document.getElementById('recording-player').appendChild(mediaElement);

var div = document.createElement('section');
mediaElement.media.parentNode.appendChild(div);
mediaElement.media.muted = false;
mediaElement.media.autoplay = true;
mediaElement.media.playsinline = true;
div.appendChild(mediaElement.media);

var recordingPlayer = mediaElement.media;

var mimeType = 'video/webm';
var fileExtension = 'webm';
var type = 'video';
var recorderType;
var defaultWidth;
var defaultHeight;

var btnStartRecording = document.querySelector('#btn-start-recording');

window.onbeforeunload = function () {
    btnStartRecording.disabled = false;
};

btnStartRecording.onclick = function (event) {
    //   按下 start 後 id 為 timer 的 DIV 內容可以開始倒數到到 0。
    var timer = document.querySelector('#timer');
    var number = 30;
    setInterval(function () {
        number--;
        if (number <= 0) number = 0;
        timer.innerText = number + 0;
    }, 1000);
    if (document.getElementById('success-send')) {
        document.getElementById('success-send').remove();
    }
    var button = btnStartRecording;

    if (button.innerHTML === 'Stop Recording') {
        btnPauseRecording.style.display = 'none';
        button.disabled = true;
        button.disableStateWaiting = true;
        setTimeout(function () {
            button.disabled = false;
            button.disableStateWaiting = false;
        }, 2000);

        button.innerHTML = 'Start Recording';

        function stopStream() {
            if (button.stream && button.stream.stop) {
                button.stream.stop();
                button.stream = null;
            }

            if (button.stream instanceof Array) {
                button.stream.forEach(function (stream) {
                    stream.stop();
                });
                button.stream = null;
            }

            videoBitsPerSecond = null;
            var html = 'Recording status: stopped';
            html += '<br>Size: ' + bytesToSize(button.recordRTC.getBlob().size);
            recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = html;
        }

        if (button.recordRTC) {
            if (button.recordRTC.length) {
                button.recordRTC[0].stopRecording(function (url) {
                    if (!button.recordRTC[1]) {
                        button.recordingEndedCallback(url);
                        stopStream();

                        saveToDiskOrOpenNewTab(button.recordRTC[0]);
                        return;
                    }

                    button.recordRTC[1].stopRecording(function (url) {
                        button.recordingEndedCallback(url);
                        stopStream();
                    });
                });
            } else {
                button.recordRTC.stopRecording(function (url) {
                    if (button.blobs && button.blobs.length) {
                        var blob = new File(button.blobs, getFileName(fileExtension), {
                            type: mimeType,
                        });

                        button.recordRTC.getBlob = function () {
                            return blob;
                        };

                        url = URL.createObjectURL(blob);
                    }

                    button.recordingEndedCallback(url);
                    saveToDiskOrOpenNewTab(button.recordRTC);
                    stopStream();
                });
            }
        }

        return;
    }

    if (!event) return;

    button.disabled = true;

    var commonConfig = {
        onMediaCaptured: function (stream) {
            button.stream = stream;
            if (button.mediaCapturedCallback) {
                button.mediaCapturedCallback();
            }

            button.innerHTML = 'Stop Recording';
            button.disabled = false;
        },
        onMediaStopped: function () {
            button.innerHTML = 'Start Recording';

            if (!button.disableStateWaiting) {
                button.disabled = false;
            }
        },
        onMediaCapturingFailed: function (error) {
            console.error('onMediaCapturingFailed:', error);

            if (error.toString().indexOf('no audio or video tracks available') !== -1) {
                alert('RecordRTC failed to start because there are no audio or video tracks available.');
            }

            if (error.name === 'PermissionDeniedError' && DetectRTC.browser.name === 'Firefox') {
                alert('Firefox requires version >= 52. Firefox also requires HTTPs.');
            }

            commonConfig.onMediaStopped();
        },
    };

    mimeType = 'video/webm';
    fileExtension = 'webm';
    recorderType = null;
    type = 'video';

    captureAudioPlusVideo(commonConfig);

    button.mediaCapturedCallback = function () {
        if (typeof MediaRecorder === 'undefined') {
            // opera or chrome etc.
            button.recordRTC = [];

            if (!params.bufferSize) {
                // it fixes audio issues whilst recording 720p
                params.bufferSize = 16384;
            }

            var options = {
                type: 'audio', // hard-code to set "audio"
                leftChannel: params.leftChannel || false,
                disableLogs: params.disableLogs || false,
                video: recordingPlayer,
            };

            if (params.sampleRate) {
                options.sampleRate = parseInt(params.sampleRate);
            }

            if (params.bufferSize) {
                options.bufferSize = parseInt(params.bufferSize);
            }

            if (params.frameInterval) {
                options.frameInterval = parseInt(params.frameInterval);
            }

            if (recorderType) {
                options.recorderType = recorderType;
            }

            if (videoBitsPerSecond) {
                options.videoBitsPerSecond = videoBitsPerSecond;
            }

            options.ignoreMutedMedia = false;
            var audioRecorder = RecordRTC(button.stream, options);

            options.type = type;
            var videoRecorder = RecordRTC(button.stream, options);

            // to sync audio/video playbacks in browser!
            videoRecorder.initRecorder(function () {
                audioRecorder.initRecorder(function () {
                    audioRecorder.startRecording();
                    videoRecorder.startRecording();
                    btnPauseRecording.style.display = '';
                });
            });

            button.recordRTC.push(audioRecorder, videoRecorder);

            button.recordingEndedCallback = function () {
                var audio = new Audio();
                audio.src = audioRecorder.toURL();
                audio.controls = true;
                audio.autoplay = true;

                recordingPlayer.parentNode.appendChild(document.createElement('hr'));
                recordingPlayer.parentNode.appendChild(audio);

                if (audio.paused) audio.play();
            };
            return;
        }

        var options = {
            type: type,
            mimeType: mimeType,
            disableLogs: params.disableLogs || false,
            getNativeBlob: false, // enable it for longer recordings
            video: recordingPlayer,
        };

        if (recorderType) {
            options.recorderType = recorderType;

            if (recorderType == WhammyRecorder || recorderType == GifRecorder || recorderType == WebAssemblyRecorder) {
                options.canvas = options.video = {
                    width: defaultWidth || 320,
                    height: defaultHeight || 240,
                };
            }
        }

        if (videoBitsPerSecond) {
            options.videoBitsPerSecond = videoBitsPerSecond;
        }

        if (timeSlice && typeof MediaRecorder !== 'undefined') {
            options.timeSlice = timeSlice;
            button.blobs = [];
            options.ondataavailable = function (blob) {
                button.blobs.push(blob);
            };
        }

        options.ignoreMutedMedia = false;
        button.recordRTC = RecordRTC(button.stream, options);

        button.recordingEndedCallback = function (url) {
            setVideoURL(url);
        };

        button.recordRTC.startRecording();
        btnPauseRecording.style.display = '';
        recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = '<img src="https://www.webrtc-experiment.com/images/progress.gif">';
    };
};

function captureVideo(config) {
    captureUserMedia(
        { video: true },
        function (videoStream) {
            config.onMediaCaptured(videoStream);

            addStreamStopListener(videoStream, function () {
                config.onMediaStopped();
            });
        },
        function (error) {
            config.onMediaCapturingFailed(error);
        }
    );
}

function captureAudio(config) {
    captureUserMedia(
        { audio: true },
        function (audioStream) {
            config.onMediaCaptured(audioStream);

            addStreamStopListener(audioStream, function () {
                config.onMediaStopped();
            });
        },
        function (error) {
            config.onMediaCapturingFailed(error);
        }
    );
}

function captureAudioPlusVideo(config) {
    captureUserMedia(
        { video: true, audio: true },
        function (audioVideoStream) {
            config.onMediaCaptured(audioVideoStream);

            if (audioVideoStream instanceof Array) {
                audioVideoStream.forEach(function (stream) {
                    addStreamStopListener(stream, function () {
                        config.onMediaStopped();
                    });
                });
                return;
            }

            addStreamStopListener(audioVideoStream, function () {
                config.onMediaStopped();
            });
        },
        function (error) {
            config.onMediaCapturingFailed(error);
        }
    );
}

var MY_DOMAIN = 'webrtc-experiment.com';

function isMyOwnDomain() {
    // replace "webrtc-experiment.com" with your own domain name
    return document.domain.indexOf(MY_DOMAIN) !== -1;
}

function isLocalHost() {
    // "chrome.exe" --enable-usermedia-screen-capturing
    // or firefox => about:config => "media.getusermedia.screensharing.allowed_domains" => add "localhost"
    return document.domain === 'localhost' || document.domain === '127.0.0.1';
}

var videoBitsPerSecond;

// media settings Bitrates
function setVideoBitrates() {
    videoBitsPerSecond = null;
    return;
}

// media settings FrameRates
function getFrameRates(mediaConstraints) {
    if (!mediaConstraints.video) {
        return mediaConstraints;
    }

    return mediaConstraints;
}

// media resolutions

function getVideoResolutions(mediaConstraints) {
    if (!mediaConstraints.video) {
        return mediaConstraints;
    }
    var value = 'default';
    return mediaConstraints;
}

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    if (mediaConstraints.video == true) {
        mediaConstraints.video = {};
    }

    setVideoBitrates();

    mediaConstraints = getVideoResolutions(mediaConstraints);
    mediaConstraints = getFrameRates(mediaConstraints);

    var isBlackBerry = !!/BB10|BlackBerry/i.test(navigator.userAgent || '');
    if (isBlackBerry && !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
        return;
    }

    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(function (stream) {
            successCallback(stream);

            setVideoURL(stream, true);
        })
        .catch(function (error) {
            if (error && (error.name === 'ConstraintNotSatisfiedError' || error.name === 'OverconstrainedError')) {
                alert('Your camera or browser does NOT supports selected resolutions or frame-rates. \n\nPlease select "default" resolutions.');
            } else if (error && error.message) {
                alert(error.message);
            } else {
                alert('Unable to make getUserMedia request. Please check browser console logs.');
            }

            errorCallback(error);
        });
}

function setMediaContainerFormat(arrayOfOptionsSupported) {
    var options = Array.prototype.slice.call(
        // mediaContainerFormat.querySelectorAll("option")
        ['default', 'vp8', 'h264', 'vp9', 'mkv', 'opus', 'ogg', 'pcm', 'gif', 'whammy', 'WebAssembly']
    );

    var localStorageItem;
    if (localStorage.getItem('media-container-format')) {
        localStorageItem = localStorage.getItem('media-container-format');
    }

    var selectedItem;
    options.forEach(function (option) {
        option.disabled = true;

        if (arrayOfOptionsSupported.indexOf(option.value) !== -1) {
            option.disabled = false;

            if (localStorageItem && arrayOfOptionsSupported.indexOf(localStorageItem) != -1) {
                if (option.value != localStorageItem) return;
                option.selected = true;
                selectedItem = option;
                return;
            }

            if (!selectedItem) {
                option.selected = true;
                selectedItem = option;
            }
        }
    });
}

function isMimeTypeSupported(mimeType) {
    if (typeof MediaRecorder === 'undefined') {
        return false;
    }

    if (typeof MediaRecorder.isTypeSupported !== 'function') {
        return true;
    }

    return MediaRecorder.isTypeSupported(mimeType);
}

if (typeof MediaRecorder === 'undefined' && (DetectRTC.browser.name === 'Edge' || DetectRTC.browser.name === 'Safari')) {
    // webp isn't supported in Microsoft Edge
    // neither MediaRecorder API
    // so lets disable both video/screen recording options

    console.warn('Neither MediaRecorder API nor webp is supported in ' + DetectRTC.browser.name + '. You cam merely record audio.');

    setMediaContainerFormat(['pcm']);
}

function stringify(obj) {
    var result = '';
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'function') {
            return;
        }

        if (result.length) {
            result += ',';
        }

        result += key + ': ' + obj[key];
    });

    return result;
}

function mediaRecorderToStringify(mediaRecorder) {
    var result = '';
    result += 'mimeType: ' + mediaRecorder.mimeType;
    result += ', state: ' + mediaRecorder.state;
    result += ', audioBitsPerSecond: ' + mediaRecorder.audioBitsPerSecond;
    result += ', videoBitsPerSecond: ' + mediaRecorder.videoBitsPerSecond;
    if (mediaRecorder.stream) {
        result += ', streamid: ' + mediaRecorder.stream.id;
        result += ', stream-active: ' + mediaRecorder.stream.active;
    }
    return result;
}

function getFailureReport() {
    var info = 'RecordRTC seems failed. \n\n' + stringify(DetectRTC.browser) + '\n\n' + DetectRTC.osName + ' ' + DetectRTC.osVersion + '\n';

    if (typeof recorderType !== 'undefined' && recorderType) {
        info += '\nrecorderType: ' + recorderType.name;
    }

    if (typeof mimeType !== 'undefined') {
        info += '\nmimeType: ' + mimeType;
    }

    Array.prototype.slice.call(document.querySelectorAll('select')).forEach(function (select) {
        info += '\n' + (select.id || select.className) + ': ' + select.value;
    });

    if (btnStartRecording.recordRTC) {
        info += '\n\ninternal-recorder: ' + btnStartRecording.recordRTC.getInternalRecorder().name;

        if (btnStartRecording.recordRTC.getInternalRecorder().getAllStates) {
            info += '\n\nrecorder-states: ' + btnStartRecording.recordRTC.getInternalRecorder().getAllStates();
        }
    }

    if (btnStartRecording.stream) {
        info += '\n\naudio-tracks: ' + getTracks(btnStartRecording.stream, 'audio').length;
        info += '\nvideo-tracks: ' + getTracks(btnStartRecording.stream, 'video').length;
        info += '\nstream-active? ' + !!btnStartRecording.stream.active;

        btnStartRecording.stream.getTracks().forEach(function (track) {
            info +=
                '\n' +
                track.kind +
                '-track-' +
                (track.label || track.id) +
                ': (enabled: ' +
                !!track.enabled +
                ', readyState: ' +
                track.readyState +
                ', muted: ' +
                !!track.muted +
                ')';

            if (track.getConstraints && Object.keys(track.getConstraints()).length) {
                info += '\n' + track.kind + '-track-getConstraints: ' + stringify(track.getConstraints());
            }

            if (track.getSettings && Object.keys(track.getSettings()).length) {
                info += '\n' + track.kind + '-track-getSettings: ' + stringify(track.getSettings());
            }
        });
    }

    if (timeSlice && btnStartRecording.recordRTC) {
        info += '\ntimeSlice: ' + timeSlice;

        if (btnStartRecording.recordRTC.getInternalRecorder().getArrayOfBlobs) {
            var blobSizes = [];
            btnStartRecording.recordRTC
                .getInternalRecorder()
                .getArrayOfBlobs()
                .forEach(function (blob) {
                    blobSizes.push(blob.size);
                });
            info += '\nblobSizes: ' + blobSizes;
        }
    } else if (btnStartRecording.recordRTC && btnStartRecording.recordRTC.getBlob()) {
        info += '\n\nblobSize: ' + bytesToSize(btnStartRecording.recordRTC.getBlob().size);
    }

    if (
        btnStartRecording.recordRTC &&
        btnStartRecording.recordRTC.getInternalRecorder() &&
        btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder &&
        btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder()
    ) {
        info += '\n\ngetInternalRecorder: ' + mediaRecorderToStringify(btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder());
    }

    return info;
}

function saveToDiskOrOpenNewTab(recordRTC) {
    if (!recordRTC.getBlob().size) {
        var info = getFailureReport();
        console.log('blob', recordRTC.getBlob());
        console.log('recordrtc instance', recordRTC);
        console.log('report', info);

        alert('RecordRTC seems failed. Unexpected issue. You can read the email in your console log. \n\nPlease report using disqus chat below.');
    }

    var fileName = getFileName(fileExtension);

    document.querySelector('#save-to-disk').parentNode.style.display = 'block';
    document.querySelector('#save-to-disk').onclick = async function (e) {
        if (!recordRTC) return alert('No recording found.');

        var file = new File([recordRTC.getBlob()], fileName, {
            type: mimeType,
        });
        var objKey = 'testing/' + file.name;
        var params = {
            Key: objKey,
            ContentType: file.type,
            Body: file,
            ACL: 'public-read',
        };

        var request = await bucket.putObject(params);
        console.log('request', request);
        console.log('request', request.params.Key);
        let questionID = document.getElementById('save-to-disk').getAttribute('data-question-id');
        nowVideo = request.params.Key;
        axios
            .post('/api/1.0/training/video', {
                data: {
                    userID: userID,
                    question_id: questionID,
                    video_answer: request.params.Key,
                },
            })
            .then(function (response) {
                console.log('response', response);
            })
            .catch(function (error) {
                console.log(error);
            });
        let percentage = document.getElementById('save-to-disk');

        request
            .on('httpUploadProgress', function (progress) {
                percentage.innerHTML = parseInt((progress.loaded * 100) / progress.total) + '%';
                console.log('Uploaded :: ' + parseInt((progress.loaded * 100) / progress.total) + '%');
                console.log(progress.loaded + ' of ' + progress.total + ' bytes');
            })
            .send(function (err, data) {
                percentage.parentNode.innerHTML = '<div id="success-send">File has been uploaded successfully.</div>';
                //listObjs();

                console.log(err, data);
            });

        // invokeSaveAsDialog(file, file.name);
    };

    // document.querySelector('#open-new-tab').onclick = function () {
    //     if (!recordRTC) return alert('No recording found.');

    //     var file = new File([recordRTC.getBlob()], fileName, {
    //         type: mimeType,
    //     });

    //     window.open(URL.createObjectURL(file));
    // };

    // upload to PHP server
    // if (isMyOwnDomain()) {
    //     document.querySelector('#upload-to-php').disabled = true;
    //     document.querySelector('#upload-to-php').style.display = 'none';
    // } else {
    //     document.querySelector('#upload-to-php').disabled = false;
    // }

    // document.querySelector('#upload-to-php').onclick = function () {
    //     if (isMyOwnDomain()) {
    //         alert('PHP Upload is not available on this domain.');
    //         return;
    //     }

    //     if (!recordRTC) return alert('No recording found.');
    //     this.disabled = true;

    //     var button = this;
    //     uploadToPHPServer(fileName, recordRTC, function (progress, fileURL) {
    //         if (progress === 'ended') {
    //             button.disabled = false;
    //             button.innerHTML = 'Click to download from server';
    //             button.onclick = function () {
    //                 SaveFileURLToDisk(fileURL, fileName);
    //             };

    //             setVideoURL(fileURL);

    //             var html = 'Uploaded to PHP.<br>Download using below link:<br>';
    //             html += '<a href="' + fileURL + '" download="' + fileName + '" style="color: yellow; display: block; margin-top: 15px;">' + fileName + '</a>';
    //             recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = html;
    //             return;
    //         }
    //         button.innerHTML = progress;
    //         recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = progress;
    //     });
    // };

    // upload to YouTube!
    // document.querySelector('#upload-to-youtube').disabled = false;
    // document.querySelector('#upload-to-youtube').onclick = function () {
    //     if (!recordRTC) return alert('No recording found.');
    //     this.disabled = true;

    //     if (isLocalHost()) {
    //         alert('This feature is NOT available on localhost.');
    //         return;
    //     }

    //     if (isMyOwnDomain() === false) {
    //         var url = 'https://github.com/muaz-khan/RecordRTC/wiki/Upload-to-YouTube';
    //         alert(
    //             'YouTube API key is configured to work only on webrtc-experiment.com. Please create your own YouTube key + oAuth client-id and use it instead.\n\nWiki page: ' + url
    //         );

    //         // check instructions on the wiki page
    //         location.href = url;
    //         return;
    //     }

    // var button = this;
    // uploadToYouTube(fileName, recordRTC, function (percentageComplete, fileURL) {
    //     if (percentageComplete == 'uploaded') {
    //         button.disabled = false;
    //         button.innerHTML = 'Uploaded. However YouTube is still processing.';
    //         button.onclick = function () {
    //             window.open(fileURL);
    //         };
    //         return;
    //     }
    //     if (percentageComplete == 'processed') {
    //         button.disabled = false;
    //         button.innerHTML = 'Uploaded & Processed. Click to open YouTube video.';
    //         button.onclick = function () {
    //             window.open(fileURL);
    //         };

    //         document.querySelector('h1').innerHTML = 'Your video has been uploaded.';
    //         window.scrollTo(0, 0);

    //         alert('Your video has been uploaded.');
    //         return;
    //     }
    //     if (percentageComplete == 'failed') {
    //         button.disabled = false;
    //         button.innerHTML = 'YouTube failed transcoding the video.';
    //         button.onclick = function () {
    //             window.open(fileURL);
    //         };
    //         return;
    //     }
    //     button.innerHTML = percentageComplete + '% uploaded to YouTube.';
    // });
    // };
}

function uploadToPHPServer(fileName, recordRTC, callback) {
    var blob = recordRTC instanceof Blob ? recordRTC : recordRTC.getBlob();

    blob = new File([blob], getFileName(fileExtension), {
        type: mimeType,
    });

    // create FormData
    var formData = new FormData();
    formData.append('video-filename', fileName);
    formData.append('video-blob', blob);

    callback('Uploading recorded-file to server.');

    // var upload_url = 'https://your-domain.com/files-uploader/';
    var upload_url = 'RecordRTC-to-PHP/save.php';

    // var upload_directory = upload_url;
    var upload_directory = 'RecordRTC-to-PHP/uploads/';

    makeXMLHttpRequest(upload_url, formData, function (progress) {
        if (progress !== 'upload-ended') {
            callback(progress);
            return;
        }

        callback('ended', upload_directory + fileName);
    });
}

function makeXMLHttpRequest(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText === 'success') {
                callback('upload-ended');
                return;
            }

            document.querySelector('.header').parentNode.style = 'text-align: left; color: red; padding: 5px 10px;';
            document.querySelector('.header').parentNode.innerHTML = request.responseText;
        }
    };

    request.upload.onloadstart = function () {
        callback('Upload started...');
    };

    request.upload.onprogress = function (event) {
        callback('Upload Progress ' + Math.round((event.loaded / event.total) * 100) + '%');
    };

    request.upload.onload = function () {
        callback('progress-about-to-end');
    };

    request.upload.onload = function () {
        callback('Getting File URL..');
    };

    request.upload.onerror = function (error) {
        callback('Failed to upload to server');
    };

    request.upload.onabort = function (error) {
        callback('Upload aborted.');
    };

    request.open('POST', url);
    request.send(data);
}

function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth();
    var date = d.getUTCDate();
    return 'RecordRTC-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}

function SaveFileURLToDisk(fileUrl, fileName) {
    var hyperlink = document.createElement('a');
    hyperlink.href = fileUrl;
    hyperlink.target = '_blank';
    hyperlink.download = fileName || fileUrl;

    (document.body || document.documentElement).appendChild(hyperlink);
    hyperlink.onclick = function () {
        (document.body || document.documentElement).removeChild(hyperlink);

        // required for Firefox
        window.URL.revokeObjectURL(hyperlink.href);
    };

    var mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    hyperlink.dispatchEvent(mouseEvent);
}

function getURL(arg) {
    var url = arg;

    if (arg instanceof Blob || arg instanceof File) {
        url = URL.createObjectURL(arg);
    }

    if (arg instanceof RecordRTC || arg.getBlob) {
        url = URL.createObjectURL(arg.getBlob());
    }

    if (arg instanceof MediaStream || arg.getTracks) {
        // url = URL.createObjectURL(arg);
    }

    return url;
}

function setVideoURL(arg, forceNonImage) {
    var url = getURL(arg);

    var parentNode = recordingPlayer.parentNode;
    parentNode.removeChild(recordingPlayer);
    parentNode.innerHTML = '';

    var elem = 'video';
    if (type == 'gif' && !forceNonImage) {
        elem = 'img';
    }
    if (type == 'audio') {
        elem = 'audio';
    }

    recordingPlayer = document.createElement(elem);

    if (arg instanceof MediaStream) {
        recordingPlayer.muted = true;
    }

    recordingPlayer.addEventListener(
        'loadedmetadata',
        function () {
            if (navigator.userAgent.toLowerCase().indexOf('android') == -1) return;

            // android
            setTimeout(function () {
                if (typeof recordingPlayer.play === 'function') {
                    recordingPlayer.play();
                }
            }, 2000);
        },
        false
    );

    recordingPlayer.poster = '';

    if (arg instanceof MediaStream) {
        recordingPlayer.srcObject = arg;
    } else {
        recordingPlayer.src = url;
    }

    if (typeof recordingPlayer.play === 'function') {
        recordingPlayer.play();
    }

    recordingPlayer.addEventListener('ended', function () {
        url = getURL(arg);

        if (arg instanceof MediaStream) {
            recordingPlayer.srcObject = arg;
        } else {
            recordingPlayer.src = url;
        }
    });

    parentNode.appendChild(recordingPlayer);
}

var timeSlice = false;

// pause
var btnPauseRecording = document.querySelector('#btn-pause-recording');
btnPauseRecording.onclick = function () {
    if (!btnStartRecording.recordRTC) {
        btnPauseRecording.style.display = 'none';
        return;
    }

    btnPauseRecording.disabled = true;
    if (btnPauseRecording.innerHTML === 'Pause') {
        btnStartRecording.disabled = true;

        btnStartRecording.style.fontSize = '15px';
        btnStartRecording.recordRTC.pauseRecording();
        recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = 'Recording status: paused';
        recordingPlayer.pause();

        btnPauseRecording.style.fontSize = 'inherit';
        setTimeout(function () {
            btnPauseRecording.innerHTML = 'Resume Recording';
            btnPauseRecording.disabled = false;
        }, 2000);
    }

    if (btnPauseRecording.innerHTML === 'Resume Recording') {
        btnStartRecording.disabled = false;

        btnStartRecording.style.fontSize = 'inherit';
        btnStartRecording.recordRTC.resumeRecording();
        recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = '<img src="https://www.webrtc-experiment.com/images/progress.gif">';
        recordingPlayer.play();

        btnPauseRecording.style.fontSize = '15px';
        btnPauseRecording.innerHTML = 'Pause';
        setTimeout(function () {
            btnPauseRecording.disabled = false;
        }, 2000);
    }
};
