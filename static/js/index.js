let video = document.getElementById("videoElement");
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
