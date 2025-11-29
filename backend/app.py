from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request

### Data

messages = [
  ]

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.get("/messages")
def get_messages():
    data = messages
    return jsonify(data)

@app.post("/messages")
def send_messages():

    new_message = request.json
    new_message['id'] = len(messages) + 1
    messages.append(new_message)
    return jsonify(new_message), 201

@app.post("/campaign")
def create_campaign():
    return "<p>campaign</p>"

@app.get("/campaign")
def join_campaign():
    return "<p>Hello, World!</p>"

@app.get("/character-sheets")
def get_character_sheets():
    return "<p>character-sheets</p>"
    

@app.post("/character-sheets")
def create_character_sheet():
    return "<p>Hello, World!</p>"
