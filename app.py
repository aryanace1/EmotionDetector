from flask import Flask, render_template, request, jsonify

# Custom imports
import ImageProcessor

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/snapImage', methods=['POST'])
def snapImage():

    image_data = request.form.get('imageData')

    response = ImageProcessor.process_image(image_data)

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
