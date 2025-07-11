from flask import Flask, jsonify
from move_hadamard import quantum_move_hadamard

app = Flask(__name__)

@app.route("/api/hadamard", methods=["GET"])
def run_move():
    result = quantum_move_hadamard()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
