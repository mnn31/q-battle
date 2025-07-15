import random

#Store game data like hp, moves, turn, and also same for enemy 
game_state = {}

def start_game():
    global game_state
    game_state = {
        "player": {
            "hp": 100,
            "moves": ["Tackle", "Heal"]
        },
        "enemy": {
            "hp": 100
        },
        "turn": "player",
        "log": []
    }
    return {
        "message": "Game started",
        "state": game_state
    }

def process_move(move):
    global game_state

    if game_state["turn"] != "player":
        return {"error": "It's not your turn."}

    if move not in game_state["player"]["moves"]:
        return {"error": f"Invalid move: {move}"}

    log = game_state["log"]

    #Choose which move to use
    if move == "Tackle":
        dmg = random.randint(10, 20)
        game_state["enemy"]["hp"] -= dmg
        log.append(f"Player used Tackle and did {dmg} damage!")
    elif move == "Heal":
        heal = random.randint(5, 15)
        game_state["player"]["hp"] = min(100, game_state["player"]["hp"] + heal)
        log.append(f"Player used Heal and recovered {heal} HP!")

    #Check if enemy is dead
    if game_state["enemy"]["hp"] <= 0:
        log.append("Enemy fainted! You win!")
        return {"state": game_state}

    #Enemy's turn
    game_state["turn"] = "enemy"
    enemy_attack()

    return {"state": game_state}

def enemy_attack():
    global game_state
    log = game_state["log"]

    dmg = random.randint(8, 18)
    game_state["player"]["hp"] -= dmg
    log.append(f"Enemy attacks and deals {dmg} damage!")

    if game_state["player"]["hp"] <= 0:
        log.append("You fainted! Game over.")
    else:
        game_state["turn"] = "player"

def get_game_state():
    return game_state
