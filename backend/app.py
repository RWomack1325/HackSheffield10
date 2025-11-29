from flask import Flask
from flask_cors import CORS
from flask import jsonify
from flask import request

### Data

campaign = {}

messages = []

characters = [
    {
      "id": 1,
      "name": "Aragorn the Ranger",
      "characterClass": "Ranger",
      "race": "Human",
      "level": 8,
      "hp": 65,
      "backstory": "Aragorn, son of Arathorn, is the heir of Isildur and rightful king of Gondor. Raised in Rivendell, he is a skilled tracker and warrior, known for his bravery and leadership in the fight against Sauron."
    },
    {
      "id": 2,
      "name": "Elara Moonwhisper",
      "characterClass": "Wizard",
      "race": "Elf",
      "level": 6,
      "hp": 32,
      "backstory": "Elara hails from the ancient elven city of Lothlórien. A prodigy in the arcane arts, she left her homeland to explore the wider world and uncover lost magical knowledge. Her calm demeanor hides a fierce determination to protect her friends."
    }
]

app = Flask(__name__)
CORS(app)

@app.get("/messages")
def get_messages():
    return jsonify(messages)

@app.post("/messages")
def send_messages():
    new_message = request.json
    new_message['id'] = len(messages) + 1
    messages.append(new_message)
    return jsonify(new_message), 201

@app.get("/campaign")
def join_campaign():

    resCampaginName = request.args.get('campaignName')

    if resCampaginName != campaign.get("campaignName"):
        return jsonify({"error": "Invalid campaign name"}), 400

    return jsonify(campaign)

@app.post("/campaign")
def create_campaign():
    new_campaign = request.json
    campaign["campaignCode"] = new_campaign["campaignCode"]
    campaign["campaignName"] = new_campaign["campaignName"]

    return jsonify(new_campaign), 201

@app.get("/character-sheets")
def get_character_sheets():
    return jsonify(characters)
    
@app.post("/character-sheets")
def create_character_sheet():
    new_character = request.json
    new_character['id'] = len(characters) + 1
    characters.append(new_character)
    return jsonify(new_character), 201
