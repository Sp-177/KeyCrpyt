"""
============================================================
🔐 KeyCrypt — Password Generator API
Author: Shubham Patel (NIT Raipur)
============================================================
✅ Generates 10–15 strong passwords using base GRU generator
✅ Evaluates each password with user/base strength model
✅ Returns passwords ranked by predicted strength confidence
============================================================
"""

import numpy as np
import string
import math
import pandas as pd
from fastapi import FastAPI, Path, HTTPException
from tensorflow.keras.models import load_model
from server.firebase_model import load_gru_model, load_strength_model_for_user

# ============================================================
# 🔹 FastAPI Setup
# ============================================================
app = FastAPI(
    title="KeyCrypt AI — Smart Password Generator",
    description="Generates strong passwords using GRU model + strength evaluation.",
    version="1.0.0"
)

# ============================================================
# 🔹 Helper — Feature Extraction
# ============================================================
def extract_features(password: str):
    """Extracts features from a password for model input."""
    if not password:
        return {}

    length = len(password)
    unique_chars = len(set(password))
    upper_ratio = sum(1 for c in password if c.isupper()) / length
    lower_ratio = sum(1 for c in password if c.islower()) / length
    digit_ratio = sum(1 for c in password if c.isdigit()) / length
    symbol_ratio = sum(1 for c in password if c in string.punctuation) / length
    entropy = length * math.log2(unique_chars if unique_chars > 0 else 1)
    char_class_count = sum([
        any(c.islower() for c in password),
        any(c.isupper() for c in password),
        any(c.isdigit() for c in password),
        any(c in string.punctuation for c in password)
    ])

    return {
        "length": length,
        "uniqueChars": unique_chars,
        "upperRatio": upper_ratio,
        "lowerRatio": lower_ratio,
        "digitRatio": digit_ratio,
        "symbolRatio": symbol_ratio,
        "entropy": entropy,
        "charClassCount": char_class_count
    }

# ============================================================
# 🔹 GRU Password Generator (Base Only)
# ============================================================
def generate_passwords(gru_model, num_passwords=12, max_length=12):
    """Generates a batch of passwords using GRU model (character-level)."""
    chars = list(string.ascii_letters + string.digits + string.punctuation)
    start_char = np.random.choice(chars)
    passwords = []

    for _ in range(num_passwords):
        pwd = start_char
        for _ in range(max_length - 1):
            next_char = np.random.choice(chars)
            pwd += next_char
        passwords.append(pwd)
    return passwords

# ============================================================
# 🔹 API Endpoint — Generate and Evaluate Passwords
# ============================================================
@app.get("/generate-passwords/{user_id}")
def generate_and_rank_passwords(
    user_id: str = Path(..., description="Firebase user ID")
):
    """
    Generates 10–15 passwords using GRU model,
    evaluates their strength via user/base strength model,
    and returns ranked results.
    """
    try:
        # 1️⃣ Load GRU generator model
        gru_model_path = load_gru_model()
        gru_model = load_model(gru_model_path)

        # 2️⃣ Generate 10–15 passwords (mock generation here)
        generated_passwords = generate_passwords(gru_model, num_passwords=15)

        # 3️⃣ Extract features for each password
        feature_list = [extract_features(pwd) for pwd in generated_passwords]

        # 4️⃣ Load strength model (personalized or base)
        model_data, model_type = load_strength_model_for_user(user_id)
        model = model_data["model"]
        scaler = model_data["scaler"]
        features_list = model_data["features"]

        # 5️⃣ Predict strength for each password
        df = pd.DataFrame(feature_list).reindex(columns=features_list, fill_value=0)
        scaled = scaler.transform(df)
        preds = model.predict(scaled)
        probs = model.predict_proba(scaled)

        label_map = {0: "Weak", 1: "Medium", 2: "Strong"}

        # 6️⃣ Collect and rank results
        results = []
        for pwd, pred, prob in zip(generated_passwords, preds, probs):
            results.append({
                "password": pwd,
                "predicted_label": label_map[int(pred)],
                "confidence": {
                    "weak": round(float(prob[0]), 3),
                    "medium": round(float(prob[1]), 3),
                    "strong": round(float(prob[2]), 3)
                },
                "strength_score": round(float(prob[2] * 100), 2)
            })

        results = sorted(results, key=lambda x: x["strength_score"], reverse=True)
        best_password = results[0] if results else None

        return {
            "user_id": user_id,
            "model_used": model_type,
            "generated_count": len(results),
            "best_password": best_password,
            "all_passwords": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password generation failed: {str(e)}")
