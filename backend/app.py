from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request

### Data

messages = []

characters = [
    {
      "id": 1,
      "name": "Aragorn the Ranger 21312312321",
      "characterClass": "Ranger",
      "race": "Human",
      "level": 8,
      "hp": 65,
    },
    {
      "id": 2,
      "name": "Elara Moonwhisper",
      "characterClass": "Wizard",
      "race": "Elf",
      "level": 6,
      "hp": 32,
    }
]

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.get("/messages")
def get_messages():
    return jsonify(messages)

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
    return jsonify(characters)
    

@app.post("/character-sheets")
def create_character_sheet():
    new_character = request.json
    new_character['id'] = len(characters) + 1
    characters.append(new_character)
    return jsonify(new_character), 201
