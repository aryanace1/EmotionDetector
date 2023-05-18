// ? Super Slider
const left = document.getElementById("left-side");
const handleMove = (e) => {
  left.style.width = `${(e.clientX / window.innerWidth) * 100}%`;
};
document.onmousemove = (e) => handleMove(e);
document.ontouchmove = (e) => handleMove(e.touches[0]);

// ? ScrollReveal Effects
ScrollReveal({
  reset: true, // Resets every time the object is scrolled to
  distance: "60px",
  duration: 1250,
  delay: 200,
});
ScrollReveal().reveal(".gradient-list li", {
  delay: 250,
  origin: "left",
  interval: 100,
});

// ? Webcam
let video = document.getElementById("videoElement"); // Video element to display webcam feed.
let canvas = document.createElement("canvas"); // Canvas element to take snapshot.
let stream = null; // Stream object to store the webcam stream.

// Start the webcam when the "Play" button is clicked.
function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (s) {
      stream = s; // Store the stream object to be used later.
      video.srcObject = stream; // Set the video source to the webcam stream.
      video.play(); // Play the video element to display the webcam stream.

      // Set the h4 of class RecordWebcam from Webcam to Webcam 🔴
      let webcamTitle = document.querySelector(".RecordWebcam");
      webcamTitle.innerHTML = "Webcam 🔴";
    })
    .catch(function (err) {
      console.log("Error accessing camera: " + err);
    });
}

// Stop the webcam when the "Stop" button is clicked.
function stopWebcam() {
  if (stream != null) {
    video.pause(); // Pause the video element to stop the webcam stream.
    video.srcObject = null; // Set the video source to null to stop the webcam stream.
    stream.getTracks()[0].stop(); // Stop the webcam stream.
    stream = null; // Set the stream object to null to release the webcam.

    // Set the h4 of class RecordWebcam from Webcam 🔴 to Webcam
    let webcamTitle = document.querySelector(".RecordWebcam");
    webcamTitle.innerHTML = "Webcam";
  }
}

// Take a snapshot when the "Snap" button is clicked.
function takeSnapshot() {
  if (stream != null) {
    canvas.width = video.videoWidth; // Set the canvas width to the webcam video width.
    canvas.height = video.videoHeight; // Set the canvas height to the webcam video height.
    canvas.getContext("2d").drawImage(video, 0, 0); // Draw the webcam video frame to the canvas.
    let imageData = canvas.toDataURL("image/jpeg", 1.0); // Get the canvas image data as a JPEG image.
    sendSnapshot(imageData); // Send the snapshot to the Flask server.
  }
}

// Send the snapshot to the Flask server.
function sendSnapshot(imageData) {
  // Display the loading animation (Data is being sent to the server)
  const loading = document.querySelector(".Spinner");
  loading.style.display = "flex";

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

      // Hide the loading animation (Data has been received)
      loading.style.display = "none";

      // Display the original image
      let image = document.querySelector("#imageDiv img");
      if (image) {
        // If an image already exists, update its source.
        image.src = imageData;
      } else {
        // If no image exists, create a new one.
        image = document.createElement("img");
        image.src = imageData;
        document.getElementById("imageDiv").appendChild(image);
      }

      // Display the predicted image
      let predictedImage = document.querySelector("#predictedImageDiv img");
      if (predictedImage) {
        // If a predicted image already exists, update its source.
        predictedImage.src = "data:image/jpeg;base64," + json.imageData;
      } else {
        // If no predicted image exists, create a new one.
        predictedImage = document.createElement("img");
        predictedImage.src = "data:image/jpeg;base64," + json.imageData;
        document
          .getElementById("predictedImageDiv")
          .appendChild(predictedImage);
      }

      // If no face detected, display a paragraph with message "No face detected".
      if (json.prediction == "no face detected") {
        let p = document.querySelector("#predictedImageDiv p");

        let no_face_text =
          "No face detected. Please show your face in the camera.";

        if (p) {
          // If a paragraph already exists, update its text.
          p.innerHTML = no_face_text;
        } else {
          // If no paragraph exists, create a new one.
          p = document.createElement("p");
          p.innerHTML = no_face_text;
          document.getElementById("predictedImageDiv").appendChild(p);
        }
      } else {
        // If a paragraph exists, remove it.
        let p = document.querySelector("#predictedImageDiv p");
        if (p) {
          p.remove();
        }
      }
    })
    .catch(function (error) {
      console.error("Error sending image to server: " + error);
    });
}
