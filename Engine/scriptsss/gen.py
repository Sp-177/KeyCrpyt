# ==========================================================
# 🔐 SIMPLE PASSWORD GENERATOR — GRU (TensorFlow / Keras)
# Author: Shubham Patel (NIT Raipur)
# ==========================================================
# Description:
# Minimal version: generates passwords containing ALL given
# keywords, combined with GRU randomness — no casing rules,
# no CLI, no symbols — pure functional version.
# ==========================================================

import tensorflow as tf
import numpy as np
import json
import random
import os


# ==========================================================
# 🧠 Load Model and Vocabulary
# ==========================================================
def load_model_and_vocab(model_path=r"D:\CSE\Project\KeyCrpyt\engine\scripts\gru_base_rnn.h5",
                         vocab_path=r"D:\CSE\Project\KeyCrpyt\engine\scripts\Vocab.json"):
    """Load trained GRU model and vocabulary."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"❌ Model not found: {model_path}")
    if not os.path.exists(vocab_path):
        raise FileNotFoundError(f"❌ Vocab not found: {vocab_path}")

    with open(vocab_path, "r", encoding="utf-8") as f:
        vocab = json.load(f)

    char_to_idx = vocab
    idx_to_char = {i: ch for ch, i in vocab.items()}

    model = tf.keras.models.load_model(model_path)
    print(f"✅ Model loaded from: {model_path}")
    return model, char_to_idx, idx_to_char


# ==========================================================
# 🔢 GRU Random Filler Generator
# ==========================================================
def gru_generate(model, char_to_idx, idx_to_char, seed="", gen_len=4, temperature=0.8):
    """Generate short random GRU filler text."""
    if not seed:
        seed = random.choice(list(char_to_idx.keys()))
    seq = [char_to_idx.get(ch, 0) for ch in seed]
    input_eval = np.array([seq])
    generated = seed

    for _ in range(gen_len):
        preds = model.predict(input_eval, verbose=0)
        if preds.ndim == 3:
            preds = preds[0, -1]
        elif preds.ndim == 2:
            preds = preds[0]
        preds = np.maximum(preds, 1e-8)
        preds = np.log(preds) / temperature
        exp_preds = np.exp(preds)
        preds = exp_preds / np.sum(exp_preds)
        next_idx = np.random.choice(range(len(preds)), p=preds)
        next_char = idx_to_char.get(next_idx, "")
        if next_char == "" or next_char == "\n":
            break
        generated += next_char
        seq.append(next_idx)
        input_eval = np.array([seq])

    return generated


# ==========================================================
# 💡 Generate Passwords (All Keywords Contained)
# ==========================================================
def generate_passwords(keywords, num_passwords=5, max_length=20, temperature=0.8):
    """Generate simple passwords that contain all keywords."""
    model, char_to_idx, idx_to_char = load_model_and_vocab()

    all_passwords = []
    for _ in range(num_passwords):
        # Random fillers between keywords
        parts = []
        for i, kw in enumerate(keywords):
            parts.append(gru_generate(model, char_to_idx, idx_to_char,
                                      seed=random.choice(list(char_to_idx.keys())),
                                      gen_len=random.randint(1, 3),
                                      temperature=temperature))
            parts.append(kw)
            if i < len(keywords) - 1:
                parts.append(gru_generate(model, char_to_idx, idx_to_char,
                                          seed=random.choice(list(char_to_idx.keys())),
                                          gen_len=random.randint(1, 2),
                                          temperature=temperature))
        # Combine and trim
        password = "".join(parts)[:max_length]
        all_passwords.append(password)

    return all_passwords


# ==========================================================
# 🧪 Example Usage (for direct testing)
# ==========================================================
if __name__ == "__main__":
    keywords = ["shubham", "nandini", "1772003","patel"]
    passwords = generate_passwords(keywords, num_passwords=5, max_length=20, temperature=0.8)

    print("\n🔑 Generated Passwords:")
    print("=========================================================")
    for i, pw in enumerate(passwords, 1):
        print(f"{i:02d}. {pw}")
    print("=========================================================")
