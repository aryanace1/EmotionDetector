from flask import Flask, render_template, request
# import os
import base64
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import PIL
import io

app = Flask(__name__)


def getPrediction(img):
    model = load_model(
        "./static/models/emotion_detector_1681572728.3088243.h5")

    # Convert the PIL Image to a numpy array
    img_array = img_to_array(img.convert('L'))
    img_array = img_array.reshape(
        (1, img_array.shape[0], img_array.shape[1], 1))  # Add channel dimension
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)
    class_names = {
        0: 'Anger',
        1: 'Disgust',
        2: 'Fear',
        3: 'Happy',
        4: 'Neutral',
        5: 'Sadness',
        6: 'Surprise'
    }
    predicted_emotion = class_names[predicted_class]

    return predicted_emotion


@app.route('/', methods=['GET', 'POST'])
def index():

    page = "index.html"

    if request.method == 'POST':

        # Retrieve the image file from the POST request
        f = request.files['image']

        # Load the image
        try:
            img = PIL.Image.open(io.BytesIO(f.read()))
        except PIL.UnidentifiedImageError:
            return render_template(page, error="Invalid Image")
        except Exception:
            return render_template(page, error="Unknown Error")

        # Get prediction
        prediction = getPrediction(img)

        # Convert the PIL Image to a base64 string for display
        buff = io.BytesIO()
        img.save(buff, format='PNG')
        img_str = base64.b64encode(buff.getvalue()).decode('utf-8')

        # Create result dictionary with prediction and base64 image string
        result = {
            "prediction": prediction,
            "image": img_str
        }

        return render_template(page, result=result)

    return render_template(page)


if __name__ == "__main__":
    app.run(debug=True)
