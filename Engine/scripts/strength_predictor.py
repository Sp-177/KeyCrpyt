"""
============================================================
🔐 KeyCrypt — Password Strength Predictor (POST Version)
Author: Shubham Patel (NIT Raipur)
============================================================

✅ Loads user-specific or base model from Firebase Storage
✅ Accepts password features from frontend (POST /predict-strength/{user_id})
✅ Returns strength category + confidence instantly
============================================================
"""

import io
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Path, Body
from firebase_admin import credentials, storage, initialize_app

# ============================================================
# 🔹 Firebase Initialization
# ============================================================
cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred, {
    "storageBucket": "keycrpyt.firebasestorage.app"
})
bucket = storage.bucket()

# ============================================================
# 🔹 FastAPI App Setup
# ============================================================
app = FastAPI(
    title="KeyCrypt AI — Password Strength Predictor (POST)",
    description="Predicts password strength using user or base model stored in Firebase Storage.",
    version="1.0.0"
)

# ============================================================
# 🔹 Load Model (User or Base)
# ============================================================
def load_model_for_user(user_id: str):
    user_model_path = f"models/users/user_{user_id}_model.pkl"
    base_model_path = "models/base/password_strength_base.pkl"
    temp_path = "temp_model.pkl"

    blob = bucket.blob(user_model_path)
    if blob.exists():
        print(f"📦 Using personalized model for user: {user_id}")
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "user"
    else:
        print("⚙️ No user model found — using base model.")
        blob = bucket.blob(base_model_path)
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "base"

# ============================================================
# 🔹 POST Endpoint — Predict Password Strength
# ============================================================
@app.post("/predict-strength/{user_id}")
def predict_strength(
    user_id: str = Path(..., description="Firebase user ID"),
    features: dict = Body(..., description="Password feature dictionary from frontend")
):
    """
    Example:
    POST /predict-strength/<user_id>

    Body JSON:
    {
        "length": 12,
        "uniqueChars": 8,
        "upperRatio": 0.1,
        "lowerRatio": 0.5,
        "digitRatio": 0.3,
        "symbolRatio": 0.1,
        "entropy": 3.4,
        "transitionDiversity": 0.8,
        "similarityToUser": 0.0,
        "charClassCount": 3,
        "h0": 0.2,
        "h1": 0.3,
        "h2": 0.5,
        "h3": 0.7,
        "h4": 0.1,
        "h5": 0.6,
        "h6": 0.3,
        "h7": 0.4
    }
    """
    try:
        # Load model
        model_data, model_type = load_model_for_user(user_id)
        model = model_data["model"]
        scaler = model_data["scaler"]
        features_list = model_data["features"]

        # Prepare DataFrame for prediction
        df = pd.DataFrame([features]).reindex(columns=features_list, fill_value=0)
        scaled = scaler.transform(df)

        # Predict
        pred = int(model.predict(scaled)[0])
        prob = model.predict_proba(scaled)[0]

        label_map = {0: "Weak", 1: "Medium", 2: "Strong"}

        return {
            "user_id": user_id,
            "predicted_label": label_map.get(pred, "Unknown"),
            "confidence": {
                "weak": round(float(prob[0]), 3),
                "medium": round(float(prob[1]), 3),
                "strong": round(float(prob[2]), 3)
            },
            "model_used": model_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 🚀 Run Command
# ============================================================
# uvicorn fastapi_strength_predictor_post:app --reload
