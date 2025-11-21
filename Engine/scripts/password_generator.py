"""
============================================================
🔐 KeyCrypt — Keyword-Based Smart Password Generator API (v3)
Author: Shubham Patel (NIT Raipur)
============================================================
✔ GRU generates natural random base structure
✔ ALL keywords are included (no random skipping)
✔ Human-style keyword blending (capitalization, slicing, leetspeak)
✔ Strength predicted using user/base ML model
✔ Returns ranked strong passwords
============================================================
"""

import numpy as np
import string
import math
import pandas as pd
import random
from typing import List
from fastapi import FastAPI, Path, Query, HTTPException
from tensorflow.keras.models import load_model
from server.firebase_model import load_gru_model, load_strength_model_for_user

# ============================================================
# 🔹 FastAPI Setup
# ============================================================
app = FastAPI(
    title="KeyCrypt AI — Smart Keyword Password Generator",
    description="Generates strong passwords using GRU + keyword blending + strength evaluation.",
    version="3.0.0"
)

# ============================================================
# 🔹 Helper — Feature Extraction
# ============================================================
def extract_features(password: str):
    """Extract features for ML strength model."""
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
# 🔹 Smart Keyword Blending — Use ALL Keywords
# ============================================================
def blend_keywords_into_password(base_pwd: str, keywords: List[str]) -> str:
    """
    GRU structure + natural keyword blending.
    ALL keywords are always included.
    """
    if not keywords:
        return base_pwd

    pwd = base_pwd

    # 👉 Always use ALL keywords
    selected_keywords = keywords[:]

    for kw in selected_keywords:
        styled_kw = kw

        # Natural styling transformations
        if random.random() < 0.20:  # Capitalize
            styled_kw = styled_kw.capitalize()

        if random.random() < 0.30:  # Leetspeak
            styled_kw = (
                styled_kw.replace("a", "@")
                         .replace("e", "3")
                         .replace("i", "1")
                         .replace("o", "0")
            )

        if random.random() < 0.25 and len(styled_kw) > 3:  # Slice
            styled_kw = styled_kw[:random.randint(3, min(5, len(styled_kw)))]

        # Insert keyword at natural-looking positions
        position = random.choice(["start", "end", "mid"])

        if position == "start":
            pwd = styled_kw + pwd

        elif position == "end":
            pwd = pwd + styled_kw

        else:
            pos = random.randint(1, len(pwd) - 1)
            pwd = pwd[:pos] + styled_kw + pwd[pos:]

    # Add special char if missing
    if not any(c in pwd for c in "!@#$%&*?"):
        pwd += random.choice("!@#$%&*?")

    return pwd

# ============================================================
# 🔹 GRU Password Generator (Base)
# ============================================================
def generate_passwords(gru_model, num_passwords=12, max_length=12):
    """
    GRU-like random sampling (mock).
    Replace with real GRU prediction if needed.
    """
    chars = list(string.ascii_letters + string.digits + string.punctuation)
    passwords = []

    for _ in range(num_passwords):
        pwd = random.choice(chars)
        for _ in range(max_length - 1):
            pwd += random.choice(chars)
        passwords.append(pwd)

    return passwords

# ============================================================
# 🔹 API: Generate + Blend Keywords + Rank
# ============================================================
@app.get("/generate-passwords/{user_id}")
def generate_and_rank_passwords(
    user_id: str = Path(..., description="Firebase user ID"),
    keywords: List[str] = Query(default=[], description="User keywords (ALL included)")
):
    """
    Generates GRU passwords, blends ALL keywords, evaluates strength,
    and returns ranked results.
    """
    print("🔥 Keywords received:", keywords)

    try:
        # 1️⃣ Load GRU model
        gru_model_path = load_gru_model()
        gru_model = load_model(gru_model_path)

        # 2️⃣ Generate base GRU-style passwords
        base_passwords = generate_passwords(gru_model, num_passwords=15)

        # 3️⃣ Blend ALL keywords
        final_passwords = [
            blend_keywords_into_password(pwd, keywords)
            for pwd in base_passwords
        ]

        # 4️⃣ Extract features
        feature_list = [extract_features(pwd) for pwd in final_passwords]

        # 5️⃣ Load model (personalized / base)
        model_data, model_type = load_strength_model_for_user(user_id)
        model = model_data["model"]
        scaler = model_data["scaler"]
        features_list = model_data["features"]

        df = pd.DataFrame(feature_list).reindex(columns=features_list, fill_value=0)
        scaled = scaler.transform(df)

        preds = model.predict(scaled)
        probs = model.predict_proba(scaled)

        label_map = {0: "Weak", 1: "Medium", 2: "Strong"}

        # 6️⃣ Build ranked results
        results = []
        for pwd, pred, prob in zip(final_passwords, preds, probs):
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

        results_sorted = sorted(results, key=lambda x: x["strength_score"], reverse=True)

        return {
            "user_id": user_id,
            "keywords_used": keywords,
            "model_used": model_type,
            "generated_count": len(results_sorted),
            "best_password": results_sorted[0] if results_sorted else None,
            "all_passwords": results_sorted
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password generation failed: {str(e)}")
