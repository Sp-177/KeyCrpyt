"""
============================================================
🔐 KeyCrypt — Personalized Model Trainer (with Base Fallback)
Author: Shubham Patel (NIT Raipur)
============================================================
✅ Trains user-specific Random Forest password model
✅ Uploads to Firebase Storage and updates Firestore
✅ Falls back to base model if user model not found
✅ REST API endpoint: /retrain/<user_id>
============================================================
"""

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from .firebase_model import load_strength_model_for_user, upload_trained_model
from .firebase_dataset import fetch_kaggle_dataset, get_user_features

# ============================================================
# 🔹 FastAPI App
# ============================================================
app = FastAPI(
    title="KeyCrypt — Model Retrainer API",
    description="Retrains personalized password strength models for each user",
    version="1.0.0",
)

# ============================================================
# 🔹 Auto-label Unlabeled User Data
# ============================================================

def auto_label_unlabeled_data(df: pd.DataFrame, model_data: dict):
    if df.empty:
        return df

    unlabeled = df[df["label"].isin([-1, None]) | ~df["label"].notna()]
    if unlabeled.empty:
        return df

    print(f"🧠 Found {len(unlabeled)} unlabeled entries → Predicting labels...")
    model = model_data["model"]
    scaler = model_data["scaler"]
    features = model_data["features"]

    unlabeled = unlabeled.reindex(columns=features, fill_value=0)
    scaled = scaler.transform(unlabeled)
    preds = model.predict(scaled)

    df.loc[unlabeled.index, "label"] = preds
    return df


# ============================================================
# 🔹 Train Personalized Model
# ============================================================

def train_user_model(user_id: str):
    print(f"🚀 Starting personalized model training for → {user_id}")

    # 1️⃣ Load Kaggle + User data
    kaggle_df = fetch_kaggle_dataset()
    user_df = get_user_features(user_id)
    if user_df.empty:
        print("⚠️ No user data found, using Kaggle data only.")
        user_df = pd.DataFrame()

    # 2️⃣ Load user model (fallback to base if not found)
    try:
        model_data, model_type = load_strength_model_for_user(user_id)
        if model_type == "base":
            print("⚙️ Using base model as starting point.")
        else:
            print("📦 Loaded existing personalized model for retraining.")
    except Exception as e:
        print(f"⚠️ Could not load user model, using base model instead. ({e})")
        model_data, model_type = load_strength_model_for_user("base")

    features = model_data["features"]

    # 3️⃣ Auto-label user data
    if not user_df.empty:
        user_df = user_df.reindex(columns=features + ["label"], fill_value=0)
        user_df = auto_label_unlabeled_data(user_df, model_data)
    else:
        user_df = pd.DataFrame(columns=features + ["label"])

    # 4️⃣ Combine & train
    combined_df = pd.concat([kaggle_df, user_df], ignore_index=True).dropna(subset=["label"])
    X, y = combined_df[features], combined_df["label"]

    print(f"🧩 Combined dataset ready → {len(X)} samples")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=300, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))

    print(f"✅ Model trained successfully (accuracy: {acc*100:.2f}%)")

    # 5️⃣ Save + upload
    model_dict = {"model": model, "scaler": scaler, "features": features, "accuracy": acc}
    local_path = f"user_{user_id}_model.pkl"
    joblib.dump(model_dict, local_path)
    upload_trained_model(user_id, model_dict, local_path)

    print(f"✅ Training completed and model uploaded for → {user_id}")
    return {"user_id": user_id, "accuracy": acc, "samples": len(X)}


# ============================================================
# 🌐 FastAPI Endpoint — /retrain/{user_id}
# ============================================================

@app.post("/retrain/{user_id}")
def retrain_with_param(user_id: str = Path(..., description="Firebase user ID")):
    """
    🔁 Trigger retraining for a specific user via URL param.
    Example:
        POST /retrain/user_123
    """
    try:
        print(f"🔔 API retrain request for user_id: {user_id}")
        result = train_user_model(user_id)
        return {
            "status": "success",
            "message": f"Retraining completed for {user_id}",
            "accuracy": result["accuracy"],
            "samples": result["samples"],
        }
    except Exception as e:
        print(f"❌ Retrain API error for {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
