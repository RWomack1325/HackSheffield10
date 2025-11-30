import os
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Existing App Imports ---
from database import db
from models import Campaign, Character, Message

# --- New Agent Imports ---
from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService

# Import your custom agent (Make sure these files are in the same directory)
from dungeon_master_agent.agent import dungeon_master_agent
# We will use the direct agent runner functions rather than the loop from main.py
from utils import add_user_query_to_history, call_agent_async

load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. Configuration & Constants
# ==========================================

# Standard Sync connection for Flask-SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Async connection for the Agent (Required by ADK)
AGENT_DB_URL = "postgresql+asyncpg://postgres:mysecretpassword@localhost:5432/postgres"
APP_NAME = "DnD_Campaign_Manager"

# Initialize Flask DB
db.init_app(app)

with app.app_context():
    db.create_all()

    characters = Character.query.all()

    char_json = [{
            "id": c.id,
            "name": c.name,
            "characterClass": c.character_class,
            "race": c.race,
            "level": c.level,
            "hp": c.hp,
            "backstory": c.backstory
        } for c in characters]


# ==========================================
# 2. Agent State Definition
# ==========================================
# This tracks the DM's "brain" state. 
# Ideally, you would populate 'active_participants' dynamically from your Character DB.



initial_state = {
    "user_name": "DnD Campaign",
    "world_bio": [],
    "interaction_history": [],
    "campaign_name": "HackshefFantasy",
    "current_location": "tavern",
    "location_features": {"tavern":["blue","full of goblins"],
                          "forest":["green","full of "]   },
    "combat_data": {},
    "player_name": {},
    "player_name": {}, # Keep this as a general tracker
    "current_player_name": "", # Initialize the new key
    "current_player_skills": {}, # Initialize the new key
    "active_participants": char_json,
    "lore_manifest_data": [],
    "topic_of_interest": [],
    "current_initiative_order": [],
    "active_actor_name": [],
    "target_name": [],
    "action_description": []
}

print("Initial Agent State Defined.")
print(initial_state)

# ==========================================
# 3. Helper: Agent Interaction Logic
# ==========================================

initial_state["active_participants"] = char_json

async def get_dm_response(user_id, campaign_code, user_text):
    """
    Connects to the ADK, runs the agent, and returns the response text.
    We use 'campaign_code' as the unique Session ID so all players share one DM state.
    """
    # Initialize the Agent Service
    session_service = DatabaseSessionService(db_url=AGENT_DB_URL)
    
    # 1. Find or Create the Session for this Campaign
    existing_sessions = await session_service.list_sessions(
        app_name=APP_NAME,
        user_id=campaign_code, # Binding session to Campaign Code, not specific User
    )

    if existing_sessions and len(existing_sessions.sessions) > 0:
        session_id = existing_sessions.sessions[0].id
    else:
        # Create new session if it doesn't exist
        new_session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=campaign_code,
            state=initial_state,
        )
        session_id = new_session.id

    # 2. Setup Runner
    runner = Runner(
        agent=dungeon_master_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    # 3. Add User Query to Agent History
    await add_user_query_to_history(
        session_service, APP_NAME, campaign_code, session_id, user_text
    )

    # 4. Run the Agent
    # call_agent_async usually processes and updates state. 
    # We need to extract the text response. 
    res  = await call_agent_async(runner, campaign_code, session_id, user_text)

    print("DM Agent Response:", res)

    # 5. Fetch the updated state to get the DM's reply
    updated_session = await session_service.get_session(
        app_name=APP_NAME, user_id=campaign_code, session_id=session_id
    )

    print("Updated Session State Retrieved.")
    
    # Look at the last interaction in history to find the DM's response
    # (Adjust logic depending on exactly how 'interaction_history' is structured in your Utils)

    # print("before get")
    # history = updated_session.state.get("interaction_history", [])
    # print("after get")

    # if history:
    #     return history[-1] # Assuming the last item is the DM's response
    if res:
        return res
    return "The Dungeon Master remains silent."


# ==========================================
# 4. Routes
# ==========================================

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


# ---- Message Routes (INTEGRATED) ----

@app.get("/messages")
def get_messages():
    # Standard Sync DB call
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
async def send_message():
    """
    Async route handler:
    1. Saves User message to SQL DB.
    2. Awaits AI Agent response.
    3. Saves AI response to SQL DB.
    """
    data = request.json
    
    # 1. Save User Message
    user_msg = Message(
        text=data["text"],
        sender_id=data["sender_id"],
        character_id=data.get("character_id"),
        campaign_code=data.get("campaign_code")
    )
    db.session.add(user_msg)
    db.session.commit() # Commit immediately so the user sees their own message

    character_speaking = Character.query.filter_by(id=data.get("character_id")).first()

    custom_message = f"{character_speaking.name} is current_player_name: {data['text']}"

    # 2. Trigger the Dungeon Master Agent
    # We only trigger the DM if the message wasn't sent by the DM itself to avoid loops
    if data["sender_id"] != "DM_AI":
        try:
            # This calls the Google ADK asynchronously
            dm_response_text = await get_dm_response(
                user_id=data["sender_id"],
                campaign_code=data.get("campaign_code"), 
                user_text=custom_message
            )
            
            # 3. Save DM Response to SQL DB
            ai_msg = Message(
                text=dm_response_text,
                sender_id="DM_AI", # Specific ID for the bot
                character_id=None,
                campaign_code=data.get("campaign_code")
            )
            db.session.add(ai_msg)
            db.session.commit()
            
            # Return both (or just the user's, the frontend usually polls for the AI response)
            return jsonify({
                "sender_id": "DM_AI",
                "text": dm_response_text,                
            }), 201
            
        except Exception as e:
            print(f"Error calling DM Agent: {e}")
            return jsonify({"error": "Failed to get DM response", "details": str(e)}), 500

    return jsonify({"id": user_msg.id, **data}), 201


if __name__ == "__main__":
    # Running in debug mode with async support
    app.run(debug=True, host="0.0.0.0", port=5000)