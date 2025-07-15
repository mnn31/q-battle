import random

def classical_move_bitzy():
    """Bitzy's classical move: Shadow Step"""
    return {"damage": 15, "move": "Shadow Step"}

def quirk_bitzy():
    """Bitzy's unique quirk: Mood Swing"""
    mood_effects = [
        "Bitzy is feeling confident! +5 damage",
        "Bitzy seems distracted... -5 damage", 
        "Bitzy is in a mysterious mood...",
        "Bitzy's quantum nature is unstable!"
    ]
    return {"quirk": random.choice(mood_effects), "mood_swing": random.randint(-5, 5)} 