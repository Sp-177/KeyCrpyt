"""
============================================================
🌐 KeyCrypt Unified FastAPI Backend (Safe Import Version)
Author: Shubham Patel (NIT Raipur)
============================================================
✔ Loads 3 sub-APIs (predictor / retrain / generator)
✔ If any sub-API is missing → print message & continue
✔ Global CORS
✔ Unified backend running on port 5000
============================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import importlib


# ============================================================
# 🔧 Safe Import Function
# ============================================================
def safe_import(module_path: str, app_name: str):
    try:
        module = importlib.import_module(module_path)
        sub_app = getattr(module, "app")
        print(f"✅ Loaded sub-API: {app_name} ({module_path})")
        return sub_app
    except Exception as e:
        print(f"⚠️ Could NOT load {app_name} ({module_path}) → {e}")
        return None


# ============================================================
# 🌐 Main FastAPI App
# ============================================================
app = FastAPI(
    title="KeyCrypt AI — Unified API",
    description="Unified backend for strength prediction, model retraining and smart password generation.",
    version="1.0.0"
)


# ============================================================
# 🌐 Global CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # Replace with frontend domain for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 🔀 SAFE MOUNT: Sub-APIs
# ============================================================
sub_apis = [
    ("/strength", "scripts.strength_predictor", "Strength Predictor API"),
    ("/retrain", "server.train_user_model", "Model Retraining API"),
    ("/generate", "scripts.password_generator", "Password Generator API"),
]

for route, module_path, name in sub_apis:
    sub_app = safe_import(module_path, name)
    if sub_app:
        app.mount(route, sub_app)
        print(f"🔗 Mounted {name} at {route}")
    else:
        print(f"⏭️ Skipped mounting {name} (module missing)")


# ============================================================
# 🚀 Run Server
# ============================================================
if __name__ == "__main__":
    import uvicorn
    print("🌐 Starting KeyCrypt Unified API Server on port 5000...")
    uvicorn.run(app, host="localhost", port=8000)
