import io
import pandas as pd
from .firebase_client import initialize_firebase

db, bucket = initialize_firebase()

# ============================================================
# 🔹 Fetch Kaggle Dataset from Firebase Storage
# ============================================================

def fetch_kaggle_dataset():
    firebase_kaggle_path = "kaggle_password_feature/kaggle_password_feature.csv"
    blob = bucket.blob(firebase_kaggle_path)

    if not blob.exists():
        raise FileNotFoundError("❌ Kaggle dataset not found in Firebase Storage!")

    print(f"📥 Downloading Kaggle dataset → {firebase_kaggle_path}")
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
