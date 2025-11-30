from datetime import datetime
from google.genai import types

# ANSI color codes for terminal output
class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    # Foreground colors
    BLACK = "\033[30m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    # Background colors
    BG_BLUE = "\033[44m"
    BG_RED = "\033[41m"
    BG_GREEN = "\033[42m"

async def update_interaction_history(session_service, app_name, user_id, session_id, entry):
    """Add an entry to the interaction history in state."""
    try:
        session = await session_service.get_session(
            app_name=app_name, user_id=user_id, session_id=session_id
        )
        interaction_history = session.state.get("interaction_history", [])
        
        if "timestamp" not in entry:
            entry["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        interaction_history.append(entry)
        
        updated_state = session.state.copy()
        updated_state["interaction_history"] = interaction_history

        await session_service.create_session(
            app_name=app_name,
            user_id=user_id,
            session_id=session_id,
            state=updated_state,
        )
    except Exception as e:
        print(f"Error updating interaction history: {e}")

async def add_user_query_to_history(session_service, app_name, user_id, session_id, query):
    await update_interaction_history(
        session_service, app_name, user_id, session_id,
        {"action": "user_query", "query": query},
    )

async def add_agent_response_to_history(session_service, app_name, user_id, session_id, agent_name, response):
    await update_interaction_history(
        session_service, app_name, user_id, session_id,
        {"action": "agent_response", "agent": agent_name, "response": response},
    )

async def display_state(session_service, app_name, user_id, session_id, label="Current State"):
    """(Kept your existing display logic, shortened for brevity)"""
    # You can keep your original display_state function exactly as it was.
    # It is good for debugging.
    pass 

# ======================================================
#  UPDATED LOGIC STARTS HERE
# ======================================================

import re

async def call_agent_async(runner, user_id, session_id, query):
    """
    Call the agent, filtering out JSON/Code blocks but capturing narrative text
    from ANY agent (Manager or Sub-Agent).
    """
    # 1. Prepare Request
    content = types.Content(role="user", parts=[types.Part(text=query)])
    
    print(f"\n{Colors.BG_GREEN}{Colors.BLACK}{Colors.BOLD}--- User: {query} ---{Colors.RESET}")

    # 2. Initialize accumulators
    accumulated_text_parts = []
    
    # We capture the last agent name to know who 'spoke' the final text
    final_author = "dungeon_master" 

    try:
        # 3. Run the Agent Loop
        async for event in runner.run_async(
            user_id=user_id, session_id=session_id, new_message=content
        ):
            if event.author:
                final_author = event.author

            if event.content and event.content.parts:
                for part in event.content.parts:
                    # Check if the part is text
                    if hasattr(part, "text") and part.text:
                        text_chunk = part.text.strip()
                        
                        if not text_chunk:
                            continue

                        # --- INTELLIGENT FILTERING ---
                        # 1. Is it a JSON block? (Starts with ```json or just { )
                        is_json = text_chunk.startswith("```json") or text_chunk.startswith("{")
                        
                        # 2. Is it a generic code block?
                        is_code = text_chunk.startswith("```")
                        
                        if is_json:
                            # Log it for debug, but DO NOT add to narrative
                            print(f"{Colors.YELLOW}   [Hidden Data Block: JSON]{Colors.RESET}")
                            print(f"{Colors.YELLOW}   {event.content}{Colors.RESET}")

                            
                        elif is_code and len(text_chunk) < 50:
                             # Small code blocks might be dice rolls, hide them or log them
                            print(f"{Colors.YELLOW}   [Hidden Code Block]{Colors.RESET}")
                        else:
                            # It is likely Narrative Text -> KEEP IT
                            accumulated_text_parts.append(text_chunk)

    except Exception as e:
        print(f"{Colors.BG_RED}{Colors.WHITE}ERROR during agent run: {e}{Colors.RESET}")
        return None

    # 4. Combine all narrative parts into one final string
    full_response_text = " ".join(accumulated_text_parts).strip()

    # 5. Clean up any leftover markdown artifacts if necessary
    # (Sometimes models leave a trailing ```)
    full_response_text = full_response_text.replace("```", "").strip()

    # 6. Print the FINAL output
    if full_response_text:
        print(f"\n{Colors.BG_BLUE}{Colors.WHITE}{Colors.BOLD}╔══ DM RESPONSE ══════════════════════════════════════════════{Colors.RESET}")
        print(f"{Colors.CYAN}{full_response_text}{Colors.RESET}")
        print(f"{Colors.BG_BLUE}{Colors.WHITE}{Colors.BOLD}╚══════════════════════════════════════════════════════════════{Colors.RESET}\n")

        # 7. Save to History
        await add_agent_response_to_history(
            runner.session_service,
            runner.app_name,
            user_id,
            session_id,
            final_author,
            full_response_text,
        )
    else:
        print(f"\n{Colors.YELLOW}[Agent performed actions but produced no narrative]{Colors.RESET}\n")

    return full_response_text