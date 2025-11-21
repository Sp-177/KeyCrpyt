"""
============================================================
🔍 KeyCrypt — Firebase Storage Debugger v3 (Full Version)
Author: Shubham Patel (NIT Raipur)
============================================================
Features:
✔ Loads service account
✔ Uses the CORRECT bucket: keycrpyt.firebasestorage.app
✔ Shows bucket connection logs
✔ Lists ALL files with metadata
✔ Lists files ONLY in /models/
✔ Downloads the base model
✔ Validates model with joblib
============================================================
"""

import os
import json
import joblib
from firebase_admin import credentials, initialize_app, storage
from datetime import datetime

# ============================================================
# 🔹 STEP 1: Load Service Account
# ============================================================
SERVICE_ACCOUNT_PATH = r"D:\CSE\Project\KeyCrpyt\engine\server\serviceAccountKey.json"

print("============================================================")
print("🔐 LOADING SERVICE ACCOUNT")
print("============================================================")

if not os.path.exists(SERVICE_ACCOUNT_PATH):
    raise FileNotFoundError(f"❌ Service account file not found at: {SERVICE_ACCOUNT_PATH}")

with open(SERVICE_ACCOUNT_PATH, "r") as f:
    info = json.load(f)

project_id = info["project_id"]
print(f"✅ Project ID detected: {project_id}")

# ============================================================
# 🔹 STEP 2: Connect to CORRECT bucket
# ============================================================
print("\n============================================================")
print("🔍 CONNECTING TO FIREBASE STORAGE")
print("============================================================")

correct_bucket = "keycrpyt.firebasestorage.app"

try:
    app = initialize_app(
        credentials.Certificate(SERVICE_ACCOUNT_PATH),
        {"storageBucket": correct_bucket}
    )
    bucket = storage.bucket()
    print(f"🎉 SUCCESS → Connected to bucket: {bucket.name}")
except Exception as e:
    print(f"❌ Failed to initialize Firebase Storage: {e}")
    raise SystemExit

# ============================================================
# 🔹 STEP 3: List ALL FILES in storage
# ============================================================
print("\n============================================================")
print("📂 LISTING ALL FILES IN STORAGE")
print("============================================================")

try:
    blobs = list(bucket.list_blobs())
    if not blobs:
        print("⚠ No files found in storage.")
    else:
        for blob in blobs:
            updated = (
                blob.updated.strftime("%Y-%m-%d %H:%M:%S")
                if blob.updated else "Unknown"
            )
            print(f"""
📦 FILE: {blob.name}
   • Size: {blob.size} bytes
   • Type: {blob.content_type}
   • Updated: {updated}
            """)
except Exception as e:
    print(f"❌ Error listing files: {e}")

# ============================================================
# 🔹 STEP 4: List ONLY the models folder
# ============================================================
print("\n============================================================")
print("📁 LISTING FILES UNDER /models/")
print("============================================================")

try:
    models_blobs = list(bucket.list_blobs(prefix="models/"))
    if not models_blobs:
        print("⚠ No files found under /models/")
    else:
        for blob in models_blobs:
            print("📦", blob.name)
except Exception as e:
    print("❌ Failed to list 'models/' files:", e)

# ============================================================
# 🔹 STEP 5: Download the base model
# ============================================================
print("\n============================================================")
print("⬇ DOWNLOADING BASE MODEL")
print("============================================================")

remote_path = "models/base/password_strength_base.pkl"
local_path = "password_strength_base.pkl"

try:
    blob = bucket.blob(remote_path)
    print(f"🔍 Checking existence of: {remote_path}")

    if blob.exists():
        print("✅ File exists → Downloading...")
        blob.download_to_filename(local_path)
        print(f"🎉 DOWNLOAD SUCCESSFUL → Saved as: {local_path}")

        # Validate with joblib
        try:
            model_data = joblib.load(local_path)
            print("\n🔍 Model loaded successfully!")
            print(f"📌 Model keys: {list(model_data.keys())}")
        except Exception as e:
            print(f"⚠ Downloaded but joblib failed to read model: {e}")

    else:
        print(f"❌ File does NOT exist: {remote_path}")
        print("👉 Check Firebase → Storage → models/base/")
except Exception as e:
    print("❌ DOWNLOAD ERROR:", e)

print("\n============================================================")
print("🏁 STORAGE DEBUG COMPLETED")
print("============================================================")
