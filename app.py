from flask import Flask, jsonify
from characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    BitzyQuantumState
)
from characters.bitzy.ability import ability_superhijack
from characters.neutrinette.quantum_move import (
    quantum_move_neutrinette_q_photon_geyser,
    quantum_move_neutrinette_glitch_claw,
    quantum_move_neutrinette_entangle,
    quantum_move_neutrinette_switcheroo,
    NeutrinetteQuantumState
)
from characters.neutrinette.ability import ability_quantum_afterburn
from characters.resona.quantum_move import (
    quantum_move_resona_q_metronome,
    quantum_move_resona_wave_crash,
    quantum_move_resona_metal_noise,
    quantum_move_resona_shift_gear,
    ResonaQuantumState
)
from characters.resona.ability import ability_quantum_waveform
from routes import game_api

app = Flask(__name__)
app.register_blueprint(game_api)

# Global quantum states for demo purposes
bitzy_state = BitzyQuantumState()
neutrinette_state = NeutrinetteQuantumState()
resona_state = ResonaQuantumState()

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

# Neutrinette's quantum move endpoints
@app.route("/api/neutrinette/q-photon-geyser", methods=["GET"])
def run_neutrinette_q_photon_geyser():
    result = quantum_move_neutrinette_q_photon_geyser(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/glitch-claw", methods=["GET"])
def run_neutrinette_glitch_claw():
    result = quantum_move_neutrinette_glitch_claw(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/entangle", methods=["GET"])
def run_neutrinette_entangle():
    result = quantum_move_neutrinette_entangle(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/switcheroo", methods=["GET"])
def run_neutrinette_switcheroo():
    result = quantum_move_neutrinette_switcheroo(neutrinette_state)
    return jsonify(result)

@app.route("/api/neutrinette/quantum-afterburn", methods=["GET"])
def run_neutrinette_quantum_afterburn():
    result = ability_quantum_afterburn(neutrinette_state)
    return jsonify(result)

# Resona's quantum move endpoints
@app.route("/api/resona/q-metronome", methods=["GET"])
def run_resona_q_metronome():
    result = quantum_move_resona_q_metronome(resona_state)
    return jsonify(result)

@app.route("/api/resona/wave-crash", methods=["GET"])
def run_resona_wave_crash():
    result = quantum_move_resona_wave_crash(resona_state)
    return jsonify(result)

@app.route("/api/resona/metal-noise", methods=["GET"])
def run_resona_metal_noise():
    result = quantum_move_resona_metal_noise(resona_state)
    return jsonify(result)

@app.route("/api/resona/shift-gear", methods=["GET"])
def run_resona_shift_gear():
    result = quantum_move_resona_shift_gear(resona_state)
    return jsonify(result)

@app.route("/api/resona/quantum-waveform", methods=["GET"])
def run_resona_quantum_waveform():
    result = ability_quantum_waveform(resona_state)
    return jsonify(result)

# State query endpoints
@app.route("/api/neutrinette/state", methods=["GET"])
def get_neutrinette_state():
    return jsonify({
        "qubit_state": neutrinette_state.qubit_state,
        "attack_stat": neutrinette_state.attack_stat,
        "defense": neutrinette_state.defense,
        "is_entangled": neutrinette_state.is_entangled
    })

@app.route("/api/resona/state", methods=["GET"])
def get_resona_state():
    return jsonify({
        "qubit_state": resona_state.qubit_state,
        "attack_stat": resona_state.attack_stat,
        "defense": resona_state.defense,
        "waveform_stacks": resona_state.waveform_stacks
    })

# Legacy endpoint for backward compatibility
@app.route("/api/bitzy", methods=["GET"])
def run_bitzy_legacy():
    result = quantum_move_bitzy_q_thunder(bitzy_state)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
