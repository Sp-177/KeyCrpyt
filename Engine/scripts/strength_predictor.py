"""
============================================================
🔐 KeyCrypt — Password Strength Predictor API
Author: Shubham Patel (NIT Raipur)
============================================================
✅ Modular version — No duplicate CORS or FastAPI setup
✅ Only defines sub-routes, to be mounted in main.py
============================================================
"""

import pandas as pd
from fastapi import FastAPI, HTTPException, Path, Body
from server.firebase_model import load_model_for_user

# Define sub-app only (no global CORS here)
app = FastAPI(title="KeyCrypt Strength Predictor API")

@app.post("/predict-strength/{user_id}")
def predict_strength(
    user_id: str = Path(..., description="Firebase user ID"),
    features: dict = Body(..., description="Password feature dictionary from frontend")
):
    """Predict password strength for given user."""
    try:
        model_data, model_type = load_model_for_user(user_id)
        model = model_data["model"]
        scaler = model_data["scaler"]
        features_list = model_data["features"]

        df = pd.DataFrame([features]).reindex(columns=features_list, fill_value=0)
        scaled = scaler.transform(df)
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
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
