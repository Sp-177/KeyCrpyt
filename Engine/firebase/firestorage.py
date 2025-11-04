"""
============================================================
🔐 KeyCrypt — User Model Trainer (Firebase Integrated)
Author: Shubham Patel (NIT Raipur)
============================================================

✅ Loads Kaggle dataset directly from Firebase Storage
✅ Uses user_id (from webapp login)
✅ Predicts unlabeled user data using existing model
✅ Trains a personalized Random Forest model
✅ Uploads model to Firebase Storage + updates Firestore metadata

Firebase Structure:
- password-features/{userId}/userPasswordFeatures/
- models/base/password_strength_base.pkl
- models/users/user_<id>_model.pkl
- user-models/{userId}
- kaggle_password_feature/kaggle_password_feature.csv
============================================================
"""

import os
import io
import joblib
import pandas as pd
from datetime import datetime
from firebase_admin import credentials, firestore, storage, initialize_app
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ============================================================
# 🔹 Firebase Initialization
# ============================================================
cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred, {
    "storageBucket": "keycrpyt.firebasestorage.app"  # your bucket name
})
db = firestore.client()
bucket = storage.bucket()

# ============================================================
# 🔹 Load Model (Base/User)
# ============================================================
def load_model_for_user(user_id: str):
    user_model_path = f"models/users/user_{user_id}_model.pkl"
    base_model_path = "models/base/password_strength_base.pkl"
    temp_path = "temp_model.pkl"

    blob = bucket.blob(user_model_path)
    if blob.exists():
        print(f"📦 Found user model → {user_id}")
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "user"
    else:
        print("⚙️ User model not found, loading base model...")
        blob = bucket.blob(base_model_path)
        blob.download_to_filename(temp_path)
        return joblib.load(temp_path), "base"

# ============================================================
# 🔹 Fetch Kaggle Dataset from Firebase Storage
# ============================================================
def fetch_kaggle_dataset():
    firebase_kaggle_path = "kaggle_password_feature/kaggle_password_feature.csv"
    blob = bucket.blob(firebase_kaggle_path)

    if not blob.exists():
        raise FileNotFoundError("❌ Kaggle dataset not found in Firebase Storage!")

    print(f"📥 Downloading Kaggle dataset from Storage → {firebase_kaggle_path}")
    data = blob.download_as_bytes()
    kaggle_df = pd.read_csv(io.BytesIO(data))

    if "label" not in kaggle_df.columns:
        raise ValueError("⚠️ Kaggle dataset missing 'label' column")

    kaggle_df = kaggle_df[kaggle_df["label"].isin([0, 1, 2])]
    print(f"✅ Kaggle dataset loaded → {len(kaggle_df)} samples")
    return kaggle_df

# ============================================================
# 🔹 Fetch User Password Features
# ============================================================
def get_user_features(user_id: str):
    docs = db.collection("password-features").document(user_id).collection("userPasswordFeatures").stream()
    data = [doc.to_dict() for doc in docs]
    return pd.DataFrame(data) if data else pd.DataFrame()

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
# 🔹 Train and Upload Model
# ============================================================
def train_user_model(user_id: str):
    print(f"🚀 Starting personalized model training for user → {user_id}")

    # Load Kaggle data from Firebase
    kaggle_df = fetch_kaggle_dataset()

    # Load user features
    user_df = get_user_features(user_id)
    if user_df.empty:
        print("⚠️ No user data found, using Kaggle data only.")
        user_df = pd.DataFrame()

    # Load base/user model for auto-labeling
    model_data, model_type = load_model_for_user(user_id)
    features = model_data["features"]

    # Auto-label unlabeled entries
    if not user_df.empty:
        user_df = user_df.reindex(columns=features + ["label"], fill_value=0)
        user_df = auto_label_unlabeled_data(user_df, model_data)
    else:
        user_df = pd.DataFrame(columns=features + ["label"])

    # Combine Kaggle + User data
    combined_df = pd.concat([kaggle_df, user_df], ignore_index=True).dropna(subset=["label"])
    X, y = combined_df[features], combined_df["label"]

    print(f"🧩 Combined dataset ready → {len(X)} samples total")

    # Train Model
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=300, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"✅ Trained personalized model accuracy: {acc*100:.2f}%")

    # Save model locally
    model_data = {"model": model, "scaler": scaler, "features": features}
    local_path = f"user_{user_id}_model.pkl"
    joblib.dump(model_data, local_path)

    # Upload to Firebase Storage
    firebase_model_path = f"models/users/user_{user_id}_model.pkl"
    blob = bucket.blob(firebase_model_path)
    blob.upload_from_filename(local_path)
    print(f"📤 Uploaded personalized model → {firebase_model_path}")



    print("📊 Firestore metadata updated successfully.")
    print(f"✅ Model training completed for user → {user_id}")

# ============================================================
# 🚀 MAIN EXECUTION
# ============================================================
if __name__ == "__main__":
    # In production, user_id will be passed dynamically after login (not via input)

    user_id = input("Enter user_id: ").strip()

    train_user_model(user_id)
