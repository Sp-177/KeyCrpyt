"""
============================================================
📘 DATA LOADER — Kaggle Password Strength Dataset Feature Extractor
Author: Shubham Patel (NIT Raipur)
Project: KeyCrypt - Smart Password Manager with AI Insights
============================================================

This script:
✅ Loads Kaggle Password Strength Classifier Dataset
✅ Extracts ML-ready features from each password (JS equivalent)
✅ Keeps labels: 0 (Weak), 1 (Medium), 2 (Strong)
✅ Skips malformed CSV lines safely
✅ Logs skipped rows (if any) for reference
✅ Outputs kaggle_password_features.csv for model training
"""

import os
import math
import pandas as pd
from collections import Counter
from tqdm import tqdm


# ============================================================
# 🔹 Feature Extraction Functions (JS Equivalent)
# ============================================================

def calculate_entropy(s: str) -> float:
    """Calculate Shannon entropy."""
    if not s:
        return 0.0
    freq = Counter(s)
    probs = [v / len(s) for v in freq.values()]
    return -sum(p * math.log2(p) for p in probs)


def calc_transition_diversity(password: str) -> float:
    """Calculate character bigram diversity."""
    if len(password) <= 1:
        return 0.0
    transitions = set()
    for i in range(len(password) - 1):
        transitions.add(password[i] + password[i + 1])
    return len(transitions) / (len(password) - 1)


def numeric_hash_vector(password: str, dims: int = 8) -> dict:
    """Browser-safe numeric hash embedding (replicates JS numericHashVector)."""
    vec = {}
    for i in range(dims):
        hash_val = 0
        seed = password + str(i)
        for ch in seed:
            hash_val = (hash_val << 5) - hash_val + ord(ch)
            hash_val &= 0xFFFFFFFF  # simulate 32-bit overflow
        vec[f"h{i}"] = abs(hash_val % 10000) / 10000
    return vec


def calc_similarity_to_user(password: str, user_data: dict = None) -> float:
    """Compute similarity between password and user data (optional)."""
    if not user_data:
        return 0.0
    name = user_data.get("name", "") or ""
    email = user_data.get("email", "") or ""
    username = user_data.get("username", "") or ""
    combined = (name + email + username).lower()
    if not combined:
        return 0.0
    match_count = sum(1 for ch in password.lower() if ch in combined)
    return match_count / len(password) if password else 0.0


def extract_password_features(password: str, user_data: dict = None, dims: int = 8):
    """Extract ML-ready numeric features from a password."""
    if not isinstance(password, str):
        password = str(password or "")

    length = len(password) or 1

    # Character-level metrics
    unique_chars = len(set(password))
    upper_ratio = len([c for c in password if c.isupper()]) / length
    lower_ratio = len([c for c in password if c.islower()]) / length
    digit_ratio = len([c for c in password if c.isdigit()]) / length
    symbol_ratio = len([c for c in password if not c.isalnum()]) / length

    entropy = calculate_entropy(password)
    transition_diversity = calc_transition_diversity(password)
    similarity_to_user = calc_similarity_to_user(password, user_data)

    char_class_count = sum([
        any(c.isupper() for c in password),
        any(c.islower() for c in password),
        any(c.isdigit() for c in password),
        any(not c.isalnum() for c in password)
    ])

    hashed_vector = numeric_hash_vector(password, dims)

    features = {
        "length": length,
        "uniqueChars": unique_chars,
        "upperRatio": upper_ratio,
        "lowerRatio": lower_ratio,
        "digitRatio": digit_ratio,
        "symbolRatio": symbol_ratio,
        "entropy": entropy,
        "transitionDiversity": transition_diversity,
        "similarityToUser": similarity_to_user,
        "charClassCount": char_class_count,
        "label": -1
    }
    features.update(hashed_vector)
    return features


# ============================================================
# 📦 DATA LOADER WITH AUTO-DETECTION AND LOGGING
# ============================================================

def find_dataset_file(filename="data.csv") -> str:
    """Search recursively for dataset file inside project."""
    for root, _, files in os.walk(os.getcwd()):
        if filename in files:
            return os.path.join(root, filename)
    return None


def load_and_extract(kaggle_path: str = "data.csv", output_path: str = "kaggle_password_features.csv"):
    """
    Loads Kaggle Password Strength dataset and extracts features.
    Args:
        kaggle_path (str): Path to Kaggle dataset CSV file.
        output_path (str): Output CSV file to save extracted features.
    """
    print(f"📂 Searching for {kaggle_path}...")

    # Automatically find dataset if not in current directory
    if not os.path.exists(kaggle_path):
        found_path = find_dataset_file(os.path.basename(kaggle_path))
        if found_path:
            kaggle_path = found_path
            print(f"✅ Found dataset at: {kaggle_path}")
        else:
            raise FileNotFoundError(
                f"❌ Could not find '{kaggle_path}' anywhere under {os.getcwd()}.\n"
                "➡ Please download 'data.csv' from Kaggle and place it in your project folder."
            )

    print("📦 Loading Kaggle dataset from:", kaggle_path)

    # Handle malformed CSV lines safely
    bad_lines_log = "skipped_rows.log"
    if os.path.exists(bad_lines_log):
        os.remove(bad_lines_log)

    try:
        df = pd.read_csv(
            kaggle_path,
            encoding="utf-8",
            engine="python",
            on_bad_lines="warn"  # logs warnings for malformed lines
        )
    except Exception as e:
        raise RuntimeError(f"❌ Failed to load dataset: {e}")

    if "password" not in df.columns or "strength" not in df.columns:
        raise ValueError("Dataset must have columns: 'password' and 'strength'")

    print(f"🔍 Loaded {len(df)} rows. Extracting features...")

    feature_rows = []
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Extracting"):
        try:
            pwd = str(row["password"])
            label = int(row["strength"]) if not pd.isna(row["strength"]) else -1
            features = extract_password_features(pwd)
            features["label"] = label
            feature_rows.append(features)
        except Exception as e:
            with open(bad_lines_log, "a", encoding="utf-8") as logf:
                logf.write(f"⚠️ Skipped password: {row.get('password', 'N/A')} | Reason: {e}\n")

    feature_df = pd.DataFrame(feature_rows)
    feature_df.to_csv(output_path, index=False)
    print(f"✅ Feature extraction complete! Saved {len(feature_df)} rows to {output_path}")

    if os.path.exists(bad_lines_log):
        print(f"⚠️ Some lines were skipped. See details in {bad_lines_log}.")


# ============================================================
# 🚀 ENTRY POINT
# ============================================================

if __name__ == "__main__":
    try:
        load_and_extract("data.csv", "kaggle_password_features.csv")
    except Exception as e:
        print("\n❌ ERROR:", e)
        print("⚠️  Make sure 'data.csv' is downloaded from Kaggle and placed in your project folder.")
