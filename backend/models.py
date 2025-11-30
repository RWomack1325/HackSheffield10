from datetime import datetime
from database import db

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_code = db.Column(db.String, unique=True)
    campaign_name = db.Column(db.String)

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    character_class = db.Column(db.String)
    race = db.Column(db.String)
    level = db.Column(db.Integer)
    hp = db.Column(db.Integer)
    backstory = db.Column(db.Text)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    sender_id = db.Column(db.String)
    character_id = db.Column(db.String)
    campaign_code = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
