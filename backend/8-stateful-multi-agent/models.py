from database import db
from datetime import datetime

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_code = db.Column(db.String(50), unique=True, nullable=False)
    campaign_name = db.Column(db.String(100), nullable=False)

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    character_class = db.Column(db.String(50))
    race = db.Column(db.String(50))
    level = db.Column(db.Integer)
    hp = db.Column(db.Integer)
    backstory = db.Column(db.Text)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    sender_id = db.Column(db.String(50), nullable=False)
    character_id = db.Column(db.Integer, nullable=True)
    campaign_code = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)