from flask import Flask, render_template, request
import os

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':

        # Retrieve the image file from the POST request
        f = request.files['image']

        # Save the image file to disk
        filename = 'snapshot.jpg'
        f.save(filename)

        # Process the image file as desired

        return render_template("index.html")

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
