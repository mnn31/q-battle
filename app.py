from flask import Flask, jsonify
from characters.bitzy.quantum_move import quantum_move_bitzy
from characters.bitzy.classical_move import classical_move_bitzy, quirk_bitzy
from routes import game_api  
<<<<<<< main
from characters.bitzy.quantum_move import quantum_move_bitzy
from characters.bitzy.classical_move import classical_move_bitzy, quirk_bitzy
from routes import game_api  

app = Flask(__name__)
app.register_blueprint(game_api)
=======
from characters.bitzy.quantum_move import (
    quantum_move_bitzy_q_thunder,
    quantum_move_bitzy_shock,
    quantum_move_bitzy_dualize,
    quantum_move_bitzy_bit_flip,
    BitzyQuantumState
)
from characters.bitzy.ability import ability_superhijack
>>>>>>> main
app = Flask(__name__)
app.register_blueprint(game_api)

app = Flask(__name__)

# Bitzy's endpoints
@app.route("/api/bitzy", methods=["GET"])
def run_bitzy_quantum():
    result = quantum_move_bitzy()
    return jsonify(result)

@app.route("/api/bitzy/classical", methods=["GET"])
def run_bitzy_classical():
    result = classical_move_bitzy()
    return jsonify(result)

@app.route("/api/bitzy/quirk", methods=["GET"])
def run_bitzy_quirk():
    result = quirk_bitzy()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
