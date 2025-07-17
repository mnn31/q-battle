#Turns files from Game_Engine.py into JSON file to send to front end 
from flask import Blueprint, request, jsonify
from Game_Engine import start_game, process_move, get_game_state

game_api = Blueprint('game_api', __name__)

@game_api.route('/start', methods=['GET'])
def start():
    return jsonify(start_game())

@game_api.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    return jsonify(process_move(data.get("move")))

@game_api.route('/state', methods=['GET'])
def state():
    return jsonify(get_game_state())
