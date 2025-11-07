"""
============================================================
🌐 KeyCrypt Unified FastAPI Backend
Author: Shubham Patel (NIT Raipur)
============================================================
✅ Combines:
   - Password Strength Predictor (scripts/strength_predictor.py)
   - Model Retraining API (server/train_user_model_api.py)
   - Smart Password Generator (scripts/password_generator_api.py)
✅ Applies CORS globally (once)
✅ Single unified FastAPI server
============================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔹 Import sub-apps (modular FastAPI apps)
from scripts.strength_predictor import app as predictor_app
from server.train_user_model import app as retrain_app
from scripts.password_generator import app as generator_app

# ============================================================
# 🔹 Main FastAPI App
# ============================================================
app = FastAPI(
    title="KeyCrypt AI — Unified API",
    description="Unified backend for password strength prediction, model retraining, and password generation.",
    version="1.0.0"
)

# ============================================================
# 🌐 Global CORS Configuration
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Replace with frontend origin for production, e.g., ["https://keycrypt.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 🔀 Mount Sub-APIs
# ============================================================
app.mount("/strength", predictor_app)   # Strength prediction
app.mount("/retrain", retrain_app)      # Model retraining
app.mount("/generate", generator_app)   # GRU-based password generation

# ============================================================
# 🚀 Run Server
# ============================================================
if __name__ == "__main__":
    import uvicorn
    print("🌐 Starting KeyCrypt Unified API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
