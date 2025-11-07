"""
============================================================
🔐 KeyCrypt — Firebase Model Utilities
Author: Shubham Patel (NIT Raipur)
============================================================
✅ Centralized model management via Firebase Storage
✅ Supports:
   - User-specific password strength models
   - Base password strength model
   - Base GRU generator model (text generation)
✅ Auto Firestore metadata updates
============================================================
"""

import os
import joblib
from datetime import datetime
from .firebase_client import initialize_firebase  # global Firebase setup

# Initialize Firestore and Storage once
db, bucket = initialize_firebase()

# ============================================================
# 🔹 Load Model (Base/User)
# ============================================================


# ============================================================
# 🔹 Load Strength Model (Prediction Only)
# ============================================================

def load_strength_model_for_user(user_id: str):
    """
    Loads the password strength prediction model for a user.
    Falls back to base model if not personalized.
    """
    user_strength_path = f"models/users/user_{user_id}_model.pkl"
    base_strength_path = "models/base/password_strength_base.pkl"
    temp_path = "temp_strength_model.pkl"

    blob = bucket.blob(user_strength_path)
    if blob.exists():
        print(f"📦 Loaded personalized strength model for → {user_id}")
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "user"
    else:
        print("⚙️ Personalized strength model not found, using base model...")
        blob = bucket.blob(base_strength_path)
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "base"

# ============================================================
# 🔹 Load GRU Generator Model (Base Only)
# ============================================================

def load_gru_model():
    """
    Loads the base GRU password generator model from Firebase Storage.
    This is a shared model for generating passwords — not user-specific.
    """
    gru_model_path = "models/base/gru_base_rnn.h5"
    temp_path = "temp_gru_model.h5"

    blob = bucket.blob(gru_model_path)
    if not blob.exists():
        raise FileNotFoundError("❌ GRU base model not found in Firebase Storage!")

    print("📦 Loading GRU base password generator model...")
    blob.download_to_filename(temp_path)
    print("✅ GRU model downloaded successfully.")
    return temp_path  # returns path for TensorFlow/Keras to load

# ============================================================
# 🔹 Upload Trained Model to Firebase
# ============================================================

def upload_trained_model(user_id: str, model_data: dict, local_path: str):
    """
    Uploads personalized model to Firebase Storage
    and updates Firestore metadata.
    """
    firebase_model_path = f"models/users/user_{user_id}_model.pkl"
    blob = bucket.blob(firebase_model_path)
    blob.upload_from_filename(local_path)
    print(f"📤 Uploaded personalized model → {firebase_model_path}")

    # Firestore metadata update
    db.collection("user-models").document(user_id).set({
        "updatedAt": datetime.utcnow(),
        "path": firebase_model_path,
        "accuracy": model_data.get("accuracy", None)
    }, merge=True)

    print("📊 Firestore metadata updated successfully.")
