#Turns files from Game_Engine.py into JSON file to send to front end 
from flask import Blueprint, request, jsonify
from Game_Engine import start_game, process_move, get_game_state

game_api = Blueprint('game_api', __name__)

@game_api.route('/start', methods=['GET'])
def start():
    # Get 'character' param; default to "bitzy" lowercase
    character_param = request.args.get("character", "bitzy").lower()
    print(f"[DEBUG] Routes.py - Received character parameter: '{character_param}'")

    # Normalize to proper internal names matching start_game expected strings
    if character_param == "bitzy":
        character = "Bitzy"
    elif character_param == "neutrinette":
        character = "Neutrinette"
    elif character_param == "resona":
        character = "Resona"
    elif character_param == "higscrozma":
        character = "Higscrozma"
    else:
        character = "Bitzy"  # default fallback

    print(f"[DEBUG] Routes.py - Starting game with character: {character}")
    return jsonify(start_game(character))

@game_api.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    return jsonify(process_move(data.get("move")))

@game_api.route('/state', methods=['GET'])
def state():
    return jsonify(get_game_state())

@game_api.route('/game-state', methods=['GET'])
def game_state():
    return jsonify({"state": get_game_state()})
