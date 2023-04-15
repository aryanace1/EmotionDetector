from flask import Flask, render_template, request, jsonify
import base64
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import PIL
import io

app = Flask(__name__)

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
    img = PIL.Image.open(io.BytesIO(image_data)).convert('L')

    # Resize the image and convert it to an array
    img = img.resize((48, 48))
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
