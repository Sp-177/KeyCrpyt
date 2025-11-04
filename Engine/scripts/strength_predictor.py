from firebase_admin import storage, credentials, initialize_app

cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred, {"storageBucket": "keycrypt-app.appspot.com"})
bucket = storage.bucket()

blob = bucket.blob("models/base/password_strength_base.pkl")
blob.upload_from_filename("password_strength_base.pkl")

print("✅ Base model uploaded to Firebase Storage.")
