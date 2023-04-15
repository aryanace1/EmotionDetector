let video = document.getElementById("videoElement");
let canvas = document.createElement("canvas");
let stream = null;

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (s) {
      stream = s;
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("Error accessing camera: " + err);
    });
}

function stopWebcam() {
  if (stream != null) {
    video.pause();
    video.srcObject = null;
    stream.getTracks()[0].stop();
    stream = null;
  }
}

function takeSnapshot() {
  if (stream != null) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(sendSnapshot, "image/jpeg");
  }
}

function sendSnapshot(blob) {
  let formData = new FormData();
  formData.append("image", blob, "snapshot.jpg");
  fetch("/", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      console.log("Image sent to server.");
    })
    .catch(function (error) {
      console.error("Error sending image to server: " + error);
    });
}
