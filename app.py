from flask import Flask, render_template, request, jsonify
import base64
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import PIL
import io
import cv2

app = Flask(__name__)

face_cascade = cv2.CascadeClassifier(
    "./static/xml/haarcascade_frontalface_default.xml")


model = load_model("./static/models/emotion_detector_1681572728.3088243.h5")
class_names = {
    0: 'Anger',
    1: 'Disgust',
    2: 'Fear',
    3: 'Happy',
    4: 'Neutral',
    5: 'Sadness',
    6: 'Surprise'
}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/snapImage', methods=['POST'])
def snapImage():

    # Get the image data from the request
    image_data = request.form.get('imageData')

    # Decode the image data
    image_data = base64.b64decode(image_data.split(',')[1])

    # Convert the image data to a numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    # Detect the face in the image
    faces = face_cascade.detectMultiScale(img, 1.3, 5)

    # Crop the image to the face
    for (x, y, w, h) in faces:
        img = img[y:y+h, x:x+w]
        break

    # Resize the image and convert it to an array
    img = cv2.resize(img, (48, 48))
    img_array = img_to_array(img)
    img_array = img_array.reshape(
        (1, img_array.shape[0], img_array.shape[1], 1))

    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)
    predicted_emotion = class_names[predicted_class]

    response = {'prediction': predicted_emotion}

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
