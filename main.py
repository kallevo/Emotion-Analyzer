from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)


@app.route('/getemotion', methods=['GET', 'POST'])
def getemotion():
    texttobescanned = request.json.get('textToBeScanned')
    classifier = pipeline('sentiment-analysis', model="michellejieli/emotion_text_classifier")
    primaryemotion = classifier(texttobescanned)[0]['label']
    return jsonify({'primaryEmotion': primaryemotion})


if __name__ == "__main__":
    app.run()
