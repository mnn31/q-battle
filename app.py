from flask import Flask, jsonify
from characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    ability_superhijack,
    BitzyQuantumState
)
from characters.bitzy.classical_move import classical_move_bitzy

app = Flask(__name__)

# Global quantum state for demo purposes
bitzy_state = BitzyQuantumState()

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

# Bitzy's classical move endpoint
@app.route("/api/bitzy/classical", methods=["GET"])
def run_bitzy_classical():
    result = classical_move_bitzy()
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
