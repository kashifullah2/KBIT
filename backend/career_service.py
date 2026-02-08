import json
from langchain_core.prompts import ChatPromptTemplate
from llm_factory import get_llm
import random

llm = get_llm()

async def start_game(role: str, industry: str):
    """
    Initializes the game state and generates the first scenario.
    """
    # Initialize basic stats
    initial_state = {
        "role": role,
        "industry": industry,
        "day": 1,
        "reputation": 50,  # 0-100
        "stress": 20,      # 0-100
        "history": []
    }
    
    # Generate Day 1 Scenario
    system_prompt = """You are the Game Master for a high-stakes career simulator called 'The 7-Day Challenge'.
    The user is starting a new job as a {role} in the {industry} industry.
    
    Generate the first scenario for Day 1. It should be an introduction to a workplace challenge.
    Examples: A server crash, a difficult client, a PR crisis, a budget cut.
    
    Return ONLY a JSON object with this structure:
    {{
        "scenario": "Description of the situation...",
        "options": ["Option A", "Option B", "Option C"]
    }}
    Make the scenario engaging, professional but slightly dramatic.
    """
    
    try:
        chain = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Generate Day 1 scenario.")
        ]) | llm
        
        result = await chain.ainvoke({"role": role, "industry": industry})
        game_data = parse_json_response(result.content)
        
        initial_state["current_scenario"] = game_data.get("scenario")
        initial_state["options"] = game_data.get("options")
        
        return initial_state
        
    except Exception as e:
        # Fallback if LLM fails
        initial_state["current_scenario"] = "You arrive at the office on your first day, but the internet is down."
        initial_state["options"] = ["Panic", "Try to fix it", "Go for coffee"]
        return initial_state

async def process_turn(state: dict, action: str):
    """
    Evaluates the user's action, updates stats, and moves to the next day/scenario.
    """
    
    system_prompt = """You are the Game Master for 'The 7-Day Challenge'.
    Current State:
    Role: {role}
    Day: {day}
    Reputation: {reputation}
    Stress: {stress}
    
    Current Scenario: {scenario}
    User Action: {action}
    
    Evaluate the consequence of this action.
    1. Did it improve or damage reputation?
    2. Did it increase or decrease stress?
    3. What happens next?
    
    If Day < 7, generate the scenario for Day {next_day}.
    If Day == 7, generate a 'Game Over' or 'Victory' message in the scenario field.
    
    Return ONLY a JSON object:
    {{
        "consequence": "Description of what happened after the action...",
        "reputation_change": integer (e.g. +10, -5),
        "stress_change": integer (e.g. +5, -10),
        "next_scenario": "Description of the next day's challenge (or ending message)...",
        "next_options": ["Option A", "Option B", "Option C"] (Empty if game ended)
    }}
    """
    
    next_day = state["day"] + 1
    
    try:
        chain = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Evaluate action and generate next turn.")
        ]) | llm
        
        result = await chain.ainvoke({
            "role": state["role"],
            "day": state["day"],
            "reputation": state["reputation"],
            "stress": state["stress"],
            "scenario": state["current_scenario"],
            "action": action,
            "next_day": next_day
        })
        
        outcome = parse_json_response(result.content)
        
        # Update State
        new_state = state.copy()
        new_state["day"] = next_day
        new_state["reputation"] = max(0, min(100, state["reputation"] + outcome.get("reputation_change", 0)))
        new_state["stress"] = max(0, min(100, state["stress"] + outcome.get("stress_change", 0)))
        new_state["current_scenario"] = outcome.get("next_scenario")
        new_state["options"] = outcome.get("next_options", [])
        new_state["last_consequence"] = outcome.get("consequence")
        
        # Check Game Over conditions
        if new_state["stress"] >= 100:
            new_state["game_over"] = True
            new_state["ending"] = "Burnout"
            new_state["message"] = "You collapsed from stress! Game Over."
        elif new_state["reputation"] <= 0:
            new_state["game_over"] = True
            new_state["ending"] = "Fired"
            new_state["message"] = "You were fired for incompetence! Game Over."
        elif new_state["day"] > 7:
            new_state["game_over"] = True
            new_state["ending"] = "Victory"
            new_state["message"] = "Congratulations! You survived 7 days."
            
        return new_state

    except Exception as e:
        print(f"Error in process_turn: {e}")
        # Fallback state in case of error
        return {
            "error": "Failed to process turn",
            "day": state["day"],
            "reputation": state["reputation"],
            "stress": state["stress"],
            "current_scenario": "The simulation encountered a glitch. Please try again.",
            "options": ["Retry"]
        }

def parse_json_response(content):
    try:
        # Find the first { and last }
        start = content.find("{")
        end = content.rfind("}") + 1
        if start != -1 and end != -1:
            json_str = content[start:end]
            return json.loads(json_str)
        return {}
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return {}
