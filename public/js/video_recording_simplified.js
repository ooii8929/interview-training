var video = document.querySelector("video");
var constraints = { video: true, audio: true };
var recorder;

function startRecording() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleUserMedia)
    .catch(handleUserMediaError);
}

function stopRecordingCallback() {
  video.src = video.srcObject = null;
  video.src = URL.createObjectURL(recorder.getBlob());
  // 下載
  createDownloadFile();
  recorder.stream.stop();
  recorder.destroy();
  recorder = null;
}

function createDownloadFile() {
  var link = document.getElementById("download");
  link.download = "file.webm";
  link.href = URL.createObjectURL(recorder.getBlob());
  link.click();
}

function handleUserMedia(stream) {
  video.srcObject = stream;

  // recording
  recorder = RecordRTC(stream, {
    type: "video",
  });
  recorder.startRecording();
}

function handleUserMediaError(error) {
  alert("Unable to capture your camera. Please check console logs.");
  console.log(error);
}

document.getElementById("btn-start-recording").onclick = function () {
  startRecording();
};

document.getElementById("btn-stop-recording").onclick = function () {
  this.disabled = true;
  recorder.stopRecording(stopRecordingCallback);
};
