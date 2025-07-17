from flask import Flask, jsonify, request
from backend.characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    BitzyQuantumState
)
from backend.characters.bitzy.ability import ability_superhijack
from backend.characters.neutrinette.quantum_move import (
    quantum_move_neutrinette_q_photon_geyser,
    quantum_move_neutrinette_glitch_claw,
    quantum_move_neutrinette_entangle,
    quantum_move_neutrinette_switcheroo,
    NeutrinetteQuantumState
)
from backend.characters.neutrinette.ability import ability_quantum_afterburn
from backend.characters.resona.quantum_move import (
    quantum_move_resona_q_metronome,
    quantum_move_resona_wave_crash,
    quantum_move_resona_metal_noise,
    quantum_move_resona_shift_gear,
    ResonaQuantumState
)
from backend.characters.resona.ability import ability_quantum_waveform
from backend.routes import game_api
from backend.Game_Engine import start_game, process_move

app = Flask(__name__)
app.register_blueprint(game_api)

# Global quantum states for demo purposes
bitzy_state = BitzyQuantumState()
neutrinette_state = NeutrinetteQuantumState()


@app.route("/start")
def start():
    # Get 'character' param; default to "bitzy" lowercase
    character_param = request.args.get("character", "bitzy").lower()

    # Normalize to proper internal names matching start_game expected strings
    if character_param == "bitzy":
        character = "Bitzy"
    elif character_param == "neutrinette":
        character = "Neutrinette"
    else:
        character = "Bitzy"  # default fallback

    print(f"[DEBUG] Starting game with character: {character}")

    # Call game engine start_game with correct character
    result = start_game(character)
    return jsonify(result)


@app.route("/move", methods=["POST"])
def move():
    move_data = request.json
    move = move_data.get("move")
    result = process_move(move)  # inside here, it should look at game_state["character"]
    return jsonify(result)


@app.route("/api/neutrinette/q-photon-geyser", methods=["GET"])
def run_neutrinette_q_photon_geyser():
    result = quantum_move_neutrinette_q_photon_geyser(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/glitch-claw", methods=["GET"])
def run_glitch_claw():
    result = quantum_move_neutrinette_glitch_claw(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/switcheroo", methods=["GET"])
def run_switcheroo():
    result = quantum_move_neutrinette_switcheroo(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/entangle", methods=["GET"])
def run_neutrinette_entangle():
    result = quantum_move_neutrinette_entangle(neutrinette_state)
    return jsonify(result)



# Bitzy's quantum move endpoints
@app.route("/api/bitzy/q-thunder", methods=["GET"])
def run_bitzy_q_thunder():
    result = quantum_move_bitzy_q_thunder(bitzy_state)
    return jsonify(result)

@app.route("/api/bitzy/shock", methods=["GET"])
def run_bitzy_shock():
    result = quantum_move_bitzy_shock(bitzy_state)
    return jsonify(result)

@app.route("/api/bitzy/dualize", methods=["GET"])
def run_bitzy_dualize():
    result = quantum_move_bitzy_dualize(bitzy_state)
    return jsonify(result)

@app.route("/api/bitzy/bit-flip", methods=["GET"])
def run_bitzy_bit_flip():
    result = quantum_move_bitzy_bit_flip(bitzy_state)
    return jsonify(result)

@app.route("/api/bitzy/superhijack", methods=["GET"])
def run_bitzy_superhijack():
    result = ability_superhijack(bitzy_state)
    return jsonify(result)

# State query endpoint
@app.route("/api/bitzy/state", methods=["GET"])
def get_bitzy_state():
    return jsonify({
        "qubit_state": bitzy_state.qubit_state,
        "attack_stat": bitzy_state.attack_stat,
        "defense": bitzy_state.defense
    })


# Legacy endpoint for backward compatibility
@app.route("/api/bitzy", methods=["GET"])
def run_bitzy_legacy():
    result = quantum_move_bitzy_q_thunder(bitzy_state)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
