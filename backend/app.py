from flask import Flask
from flask import jsonify
from flask import request

### Data

messages = [{
      "id": 1,
      "text": 'Hello! How can I help you today?',
      "sender_id": '2',
    },
    {
      "id": 2,
      "text": 'I need some assistance with my project.',
      "sender_id": '1',
    },
  ]

app = Flask(__name__)

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
