#Turns files from Game_Engine.py into JSON file to send to front end 
from flask import Blueprint, request, jsonify, send_from_directory
from Game_Engine import start_game, process_move, get_game_state
import random
import os

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

@game_api.route('/random-background', methods=['GET'])
def random_background():
    """Get a random background from the possible-bg folder"""
    possible_bg_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'possible-bg')
    
    if not os.path.exists(possible_bg_dir):
        return jsonify({"error": "Background directory not found"}), 404
    
    # Get all image files from the directory
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}
    background_files = []
    
    for filename in os.listdir(possible_bg_dir):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            background_files.append(filename)
    
    if not background_files:
        return jsonify({"error": "No background images found"}), 404
    
    # Select a random background
    selected_background = random.choice(background_files)
    print(f"[DEBUG] Routes.py - Selected random background: {selected_background}")
    
    return jsonify({
        "background": selected_background,
        "url": f"/static/backgrounds/{selected_background}"
    })
