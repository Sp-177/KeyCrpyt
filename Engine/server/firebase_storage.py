import firebase_admin
from firebase_admin import credentials, firestore, storage

# ============================================================
# 🔹 Firebase Initialization
# ============================================================

def initialize_firebase():
    """Initialize Firebase app if not already initialized."""
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred, {
            "storageBucket": "keycrpyt.firebasestorage.app"  # your bucket
        })
    db = firestore.client()
    bucket = storage.bucket()
    return db, bucket
