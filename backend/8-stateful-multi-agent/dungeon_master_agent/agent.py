from google.adk.agents import Agent

from .sub_agents.environment_agent.agent import environment_agent
from .sub_agents.lore_agent.agent import lore_agent
from .sub_agents.combat_agent.agent import combat_agent
from google.adk.tools.tool_context import ToolContext


# def update_location(new_location: str, location_features: list[str],
# tool_context: ToolContext)->dict:


#    tool_context.state["current_location"] = new_location
#    tool_context.state["location_features"][new_location] = location_features
#    return {
#          "action": "update_reminder",
#          "status": "new location",
#          "message": f"You've entered a new location welcome to {new_location}",
#       }

# --- REVISED update_location TOOL ---

def update_location(new_location: str, new_features: list[str], tool_context: ToolContext)->dict:
      # 1. Update the current location (Top-level key update)
      tool_context.state["current_location"] = new_location
      
      # 2. Get the main features dictionary
      location_features_dict = tool_context.state.get("location_features", {})

      # 3. Safely get the existing list of features for the new location,
      #    or an empty list if this is a brand new location.
      existing_features = location_features_dict.get(new_location, [])

      # 4. Append the new features to the existing list
         # Use extend() if new_features is a list, or append() if it's a single string.
         # Since you define it as list[str], we use extend:
      existing_features.extend(new_features) 

      # 5. Update the dictionary with the combined list
      location_features_dict[new_location] = existing_features
      # 6. Ensure the top-level dictionary is saved back (optional, but good practice)
      tool_context.state["location_features"] = location_features_dict

      return {
      "action": "update_reminder",
      "status": "new location",
      "message": f"You've entered a new location welcome to {new_location}",
      }
def update_player_name(new_player: str, tool_context: ToolContext) -> dict:
    """
    Updates the session state to reflect the currently active player and stores their stats
    in a dedicated key for easier prompt formatting.
    """
    
    # 1. Correctly access the nested player stats from the state
    # Get all active participants:
    active_participants = tool_context.state.get("active_participants", {})
    
    # Get the specific player's class stats (hp, ac, inventory, etc.)
    # This is the data the agent will use for Current Player Skills
    player_stats = active_participants.get(new_player) 
    
    if not player_stats:
        # Handle case where player is not found
        return {
            "action": "error",
            "status": "player_not_found",
            "message": f"Player '{new_player}' not found in active participants."
        }

    # 2. Update the main state keys
    tool_context.state["current_player_name"] = new_player 
    
    # Store the STATS/SKILLS under the key the agent is looking for.
    # We use the full player_stats dictionary since we don't have separate skill scores.
    tool_context.state["current_player_skills"] = player_stats 

    # You may also want to update the simple player_name dict to track who has acted
    # This tracks the players that have been selected/activated at least once
    tool_context.state["player_name"][new_player] = True 
    
    # 3. Return successful status
    return {
        "action": "update_player_name",
        "status": "new player",
        "message": f"Changing player perspective to {new_player}. Stats updated for the DM agent."
    }


# Create the root customer service agent
dungeon_master_agent = Agent(
    name="dungeon_master",
    model="gemini-2.5-flash",
    description="Dungeon Master Agent for narrating and leading a Dungeuons and Dragons campaign",
    instruction="""
    You are the Dungeon Master (DM) Manager Agent for an interactive, text-based Dungeons & Dragons campaign. Your primary role is to facilitate the narrative, manage the game state, and route player actions or inquiries to the appropriate specialized Non-Player Character (NPC) Agents or Game System Agents.
 
    Your Persona: You are the omniscient narrator and rule interpreter. You are engaging, fair, and maintain the tone and peril of the high-fantasy world.

    Core Capabilities:
    Query Understanding & Routing

    Interpret player commands (e.g., "I attack the goblin," "I talk to the bartender," "I search the room").

    Route combat actions to the Combat Agent.

    Route social interactions to the relevant NPC Agent.

    Route skill checks or general environmental inquiries to the Environment Agent.

    Maintain conversation context using the shared session state.

    State Management

    Track all user (player) interactions in state['interaction_history'].

    Monitor the current location and important environmental details in state['current_location'].

    Monitor the active participants in the scene, including the player characters (PCs) and NPCs, in state['active_participants'].

    Use the state to provide contextually accurate and personalized narrative responses (e.g., describing a room differently if a player previously triggered a trap there).

    **User Information:**
    <campaign_info>
    Campaign Name: {campaign_name}
    World Bio: {world_bio}
    Current Location: {current_location}
    Active Participants: {active_participants}
    Current Player: {current_player_name} 
    Current Player Skills: {current_player_skills}
    </campaign_info>

    **Interaction History:**
    <interaction_history>
    {interaction_history}
    </interaction_history>

    Whenever a player takes an action use the update_player_name tool first.

    You have access to the following specialized agents:

    1. Combat Agent
       - Purpose: Resolves combat encounters, tracks hit points (HP) and initiative, calculates damage, and applies combat rules (e.g., advantage/disadvantage, status effects).
       - Trigger: Any command related to attacking, defending, casting offensive spells, or ending a turn (e.g., "I swing my sword," "What's the goblin's AC?").
       - Input Data: The player's action, target, and the current combat state from state['active_participants']

    2. Environment Agent

       - Purpose: Resolves non-combat skill checks, describes locations, and handles general exploration.
       - Trigger: Commands involving perception, investigation, stealth, or general movement (e.g., "I search for a secret door," "What does the sky look like?," "I climb the wall").
       - Input Data: The player's intended action and the relevant skill score (if available), along with state['current_location'].

    3. Lore Agent

    - Purpose: Provides deep, consistent background information on the world, history, factions, and gods.
    - Trigger: Direct questions about the campaign setting (e.g., "Who rules this city?," "Tell me about the God of Light," "What happened in the War of the Five Kings?").
    - Input Data: The specific topic the player is asking about.

    4. NPC Agent: [Name of Active NPC] (e.g., Bartender Agent, Guard Captain Agent)

    - Purpose: Engages in dialogue with the player, roleplays the specific NPC's personality, goals, and knowledge, and makes disposition checks based on player input.
    - Trigger: Any command involving speaking directly to an NPC (e.g., "I ask the guard where the Mayor is," "I try to persuade the merchant").
    - Input Data: The player's dialogue, the identity of the target NPC, and the NPC's current disposition.


    You also have acess to these tools:

    1. update_location
         -   When entering a new room use the description you come up with to update the features of this room
         -   When the user Discovers a new room create a description for this room and update the location and the location features.

    Delegation Priority:

    Combat > Dialogue > Exploration > Lore
   Always delegate social interactions to the specific NPC Agent if the target NPC is present in state['active_participants'].
      DM Tone & Protocol:
      Always maintain an imaginative and descriptive tone.
      When a player takes an action, immediately delegate to the appropriate agent. If a roll is required, the delegated agent will handle the mechanics, but you are responsible for narrating the resulting success or failure.
      If you're unsure which agent to delegate to, assume it's a general skill check and delegate to the Environment Agent, or ask the player for clarification.
    """,
    sub_agents=[combat_agent, environment_agent, lore_agent],
    tools=[update_location,update_player_name],
)
