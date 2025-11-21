"""
============================================================
🔥 KeyCrypt — Firebase Client Initialization (Fixed)
Author: Shubham Patel (NIT Raipur)
============================================================
✔ Initializes Firebase Admin SDK (Firestore + Storage)
✔ Prevents duplicate initialization
✔ Loads credentials and correct bucket
============================================================
"""

import os
import firebase_admin
from firebase_admin import credentials, firestore, storage

# ============================================================
# 🔹 Firebase Initialization Function
# ============================================================

def initialize_firebase():
    """
    Initializes Firebase Admin SDK (only once).
    Returns:
        db: Firestore client
        bucket: Firebase Storage bucket
    """

    if not firebase_admin._apps:
        # Path to service account JSON
        service_account_path = os.getenv(
            "FIREBASE_SERVICE_ACCOUNT",
            r"D:\CSE\Project\KeyCrpyt\engine\server\serviceAccountKey.json"
        )

        if not os.path.exists(service_account_path):
            raise FileNotFoundError(
                f"❌ Firebase service account file not found: {service_account_path}"
            )

        cred = credentials.Certificate(service_account_path)

        # Correct Firebase Storage bucket
        bucket_name = "keycrpyt.firebasestorage.app"

        firebase_admin.initialize_app(cred, {
            "storageBucket": bucket_name
        })

        print(f"✅ Firebase initialized successfully with bucket: {bucket_name}")

    else:
        print("ℹ️ Firebase already initialized — skipping re-initialization.")

    # Create Firestore and Storage clients
    db = firestore.client()
    bucket = storage.bucket()

    return db, bucket
