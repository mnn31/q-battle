#!/usr/bin/env python3
"""
Q-Battle: Quantumons - Main Entry Point
A quantum-powered battle game where you fight using quantum abilities!
"""

from backend.app import app

if __name__ == '__main__':
    print("🔮 Q-Battle: Quantumons")
    print("Starting Flask server...")
    print("Access the game at: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='127.0.0.1', port=5000) 