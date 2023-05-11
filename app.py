from flask import Flask, render_template, request, jsonify

# Custom imports
import ImageProcessor

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/snapImage', methods=['POST'])
def snapImage():

    # Get the image data from the request
    image_data = request.form.get('imageData')

    # Process the image
    response = ImageProcessor.process_image(image_data)

    # Return the response
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
