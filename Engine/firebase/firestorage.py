# firebase_config.py

import firebase_admin
from firebase_admin import credentials, firestore, storage

# Path to your service account key
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize app with both Firestore + Storage
firebase_admin.initialize_app(cred, {
    "storageBucket": "keycrpyt.firebasestorage.app"  # replace with your actual bucket name
})

# Initialize Firestore
db = firestore.client()

# Initialize Storage
bucket = storage.bucket()

print("✅ Firebase Firestore connected successfully!")

