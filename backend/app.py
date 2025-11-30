from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from models import Campaign, Character, Message

app = Flask(__name__)
CORS(app)

# -------- PostgreSQL connection --------
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5433/dnd"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()
# ---------------------------------------


# ---- Campaign Routes ----

@app.post("/campaign")
def create_campaign():
    data = request.json
    campaign = Campaign(
        campaign_code=data["campaignCode"],
        campaign_name=data["campaignName"]
    )
    db.session.add(campaign)
    db.session.commit()
    return jsonify(data), 201


@app.get("/campaign")
def join_campaign():
    campaign_name = request.args.get("campaignName")
    campaign = Campaign.query.filter_by(campaign_name=campaign_name).first()

    if campaign is None:
        return jsonify({"error": "Invalid campaign name"}), 400

    return jsonify({
        "campaignName": campaign.campaign_name,
        "campaignCode": campaign.campaign_code
    })

# ---- Character Routes ----

@app.get("/character-sheets")
def get_characters():
    characters = Character.query.all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "characterClass": c.character_class,
        "race": c.race,
        "level": c.level,
        "hp": c.hp,
        "backstory": c.backstory
    } for c in characters])


@app.post("/character-sheets")
def create_character():
    data = request.json
    c = Character(
        name=data["name"],
        character_class=data["characterClass"],
        race=data["race"],
        level=data["level"],
        hp=data["hp"],
        backstory=data["backstory"]
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({"id": c.id, **data}), 201


# ---- Message Routes ----

@app.get("/messages")
def get_messages():
    msgs = Message.query.order_by(Message.id.asc()).all()
    return jsonify([{
        "id": m.id,
        "text": m.text,
        "sender_id": m.sender_id,
        "character_id": m.character_id,
        "campaign_code": m.campaign_code,
        "timestamp": m.timestamp.isoformat()
    } for m in msgs])


@app.post("/messages")
def send_message():
    data = request.json
    msg = Message(
        text=data["text"],
        sender_id=data["sender_id"],
        character_id=data.get("character_id"),
        campaign_code=data.get("campaign_code")
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"id": msg.id, **data}), 201


if __name__ == "__main__":
    app.run(debug=True)
