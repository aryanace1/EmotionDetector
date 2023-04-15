let video = document.getElementById("videoElement");
let canvas = document.createElement("canvas");
let stream = null;

// Start the webcam when the "Play" button is clicked.
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

// Stop the webcam when the "Stop" button is clicked.
function stopWebcam() {
  if (stream != null) {
    video.pause();
    video.srcObject = null;
    stream.getTracks()[0].stop();
    stream = null;
  }
}

// Take a snapshot when the "Snap" button is clicked.
function takeSnapshot() {
  if (stream != null) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    let imageData = canvas.toDataURL("image/jpeg", 1.0);
    sendSnapshot(imageData);
  }
}

// Send the snapshot to the Flask server.
function sendSnapshot(imageData) {
  // Send the form data to the server.
  fetch("/snapImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "imageData=" + encodeURIComponent(imageData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("Prediction: " + json.prediction);
    })
    .catch(function (error) {
      console.error("Error sending image to server: " + error);
    });
}
