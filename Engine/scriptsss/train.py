"""
============================================================
🔐 KeyCrypt — GRU Base Model Trainer
Author: Shubham Patel (NIT Raipur)
============================================================

✅ Loads preprocessed dataset: kaggle_strong_passwords.csv
✅ Loads vocab.json to get vocab size
✅ Builds character-level GRU model
✅ Trains model on strong password patterns
✅ Saves model as gru_base_rnn.h5 for generation
============================================================
"""

import os
import json
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

# ============================================================
# 🔹 CONFIGURATION
# ============================================================

SEQ_LEN = 24
BASE_DIR = r"D:\CSE\Project\KeyCrpyt\engine\scripts"  # ✅ consistent path

# Preprocessed dataset + vocab + model save path
DATA_PATH = os.path.join(BASE_DIR, "kaggle_strong_passwords.csv")
VOCAB_PATH = os.path.join(BASE_DIR, "vocab.json")
MODEL_PATH = os.path.join(BASE_DIR, "gru_base_rnn.h5")

os.makedirs(BASE_DIR, exist_ok=True)

# ============================================================
# 🔹 LOAD DATA
# ============================================================

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"❌ {DATA_PATH} not found! Run preprocessing script first.")
print("📂 Loading dataset...")
df = pd.read_csv(DATA_PATH)

if "password" not in df.columns or "strength" not in df.columns:
    raise ValueError("❌ Dataset must contain 'password' and 'strength' columns")

# Filter only strong passwords (label == 2)
df_strong = df[df["strength"] == 2].dropna(subset=["password"])
passwords = df_strong["password"].astype(str).tolist()

print(f"✅ Loaded {len(passwords)} strong passwords")

# ============================================================
# 🔹 LOAD VOCABULARY
# ============================================================
print("📂 Loading vocabulary...")
if not os.path.exists(VOCAB_PATH) or os.path.getsize(VOCAB_PATH) == 0:
    raise FileNotFoundError(
        f"❌ vocab.json not found or is empty at {VOCAB_PATH}. "
        "Please run preprocess_strong_dataset.py first."
    )

try:
    with open(VOCAB_PATH, "r", encoding="utf-8") as f:
        vocab = json.load(f)
except json.JSONDecodeError:
    raise ValueError(
        f"⚠️ vocab.json at {VOCAB_PATH} is corrupted or invalid. "
        "Delete it and regenerate using preprocess_strong_dataset.py."
    )

vocab_size = len(vocab) + 1  # +1 for padding
char_to_idx = {char: idx for char, idx in vocab.items()}
print(f"🔤 Vocabulary size = {vocab_size}")

# ============================================================
# 🔹 PREPARE TRAINING DATA
# ============================================================

print("🔄 Preparing training sequences...")

def create_sequences(passwords, char_to_idx, seq_len):
    """
    Create input-output pairs for training.
    For each password, we create sliding windows of length seq_len
    and predict the next character.
    """
    X = []
    y = []

    for password in passwords:
        # Convert password to indices
        indices = [char_to_idx.get(char, 0) for char in password]

        # Create sequences
        for i in range(len(indices) - seq_len):
            sequence = indices[i:i + seq_len]
            target = indices[i + seq_len]
            X.append(sequence)
            y.append(target)

    return np.array(X), np.array(y)

# Generate training data
X, y = create_sequences(passwords, char_to_idx, SEQ_LEN)

print(f"✅ Created {len(X)} training sequences")
print(f"📊 X shape: {X.shape}, y shape: {y.shape}")

# ============================================================
# 🔹 BUILD GRU MODEL
# ============================================================

print("🧠 Building GRU model...")

model = Sequential([
    Embedding(input_dim=vocab_size, output_dim=128, input_length=SEQ_LEN),
    GRU(256, return_sequences=True),
    Dropout(0.3),
    GRU(256),
    Dropout(0.3),
    Dense(vocab_size, activation="softmax")
])

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ============================================================
# 🔹 CALLBACKS
# ============================================================

checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor="val_loss",
    save_best_only=True,
    verbose=1
)

lr_reducer = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.5,
    patience=3,
    verbose=1,
    min_lr=1e-6
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=7,
    restore_best_weights=True,
    verbose=1
)

# ============================================================
# 🔹 TRAIN MODEL
# ============================================================

print("🚀 Training GRU model on strong passwords...")
print(f"⏱️  This may take a while depending on dataset size...")

history = model.fit(
    X, y,
    validation_split=0.1,
    batch_size=256,
    epochs=50,
    callbacks=[checkpoint, lr_reducer, early_stop],
    verbose=1
)

print("✅ Training completed successfully!")

# ============================================================
# 🔹 SAVE FINAL MODEL & TRAINING HISTORY
# ============================================================

model.save(MODEL_PATH)
print(f"💾 Model saved → {MODEL_PATH}")

# Save training history
history_path = os.path.join(BASE_DIR, "training_history.json")
history_dict = {
    "loss": [float(x) for x in history.history["loss"]],
    "accuracy": [float(x) for x in history.history["accuracy"]],
    "val_loss": [float(x) for x in history.history["val_loss"]],
    "val_accuracy": [float(x) for x in history.history["val_accuracy"]]
}

with open(history_path, "w") as f:
    json.dump(history_dict, f, indent=2)

print(f"📊 Training history saved → {history_path}")

# ============================================================
# 🔹 TRAINING SUMMARY
# ============================================================

print("\n" + "="*60)
print("📈 TRAINING SUMMARY")
print("="*60)
print(f"Final Training Loss:     {history.history['loss'][-1]:.4f}")
print(f"Final Training Accuracy: {history.history['accuracy'][-1]:.4f}")
print(f"Final Val Loss:          {history.history['val_loss'][-1]:.4f}")
print(f"Final Val Accuracy:      {history.history['val_accuracy'][-1]:.4f}")
print(f"Total Epochs Trained:    {len(history.history['loss'])}")
print("="*60)
print("\n✨ Model is ready for password generation!")
