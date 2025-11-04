/**
 * Extracts ML-ready numeric features from a password.
 * Designed to be data-driven — no hardcoded weak patterns.
 */
export function extractPasswordFeatures(password, userData = {}) {
  const lower = password.toLowerCase();

  // Character-level features
  const length = password.length;
  const uniqueChars = new Set(password).size;
  const upperRatio = (password.match(/[A-Z]/g) || []).length / length;
  const lowerRatio = (password.match(/[a-z]/g) || []).length / length;
  const digitRatio = (password.match(/[0-9]/g) || []).length / length;
  const symbolRatio = (password.match(/[^a-zA-Z0-9]/g) || []).length / length;

  // Shannon entropy
  const entropy = calculateEntropy(password);

  // Character transition diversity (bigram distribution)
  const transitionDiversity = calcTransitionDiversity(password);

  // Similarity to user data (if any)
  const similarityToUser = calcSimilarityToUser(password, userData);

  // Stable numeric hash-based vectorization
  const hashedVector = numericHashVector(password);

  return {
    length,
    uniqueChars,
    upperRatio,
    lowerRatio,
    digitRatio,
    symbolRatio,
    entropy,
    transitionDiversity,
    similarityToUser,
    ...hashedVector, // spread hashed numeric vector features
  };
}

/** Shannon entropy */
function calculateEntropy(str) {
  const freq = {};
  for (let ch of str) freq[ch] = (freq[ch] || 0) + 1;
  const probs = Object.values(freq).map((v) => v / str.length);
  return -probs.reduce((sum, p) => sum + p * Math.log2(p), 0);
}

/** Character transition diversity */
function calcTransitionDiversity(password) {
  if (password.length < 2) return 0;
  const transitions = new Set();
  for (let i = 0; i < password.length - 1; i++) {
    transitions.add(password[i] + password[i + 1]);
  }
  return transitions.size / (password.length - 1);
}

/** Similarity to user-provided info (like name, email, username) */
function calcSimilarityToUser(password, userData) {
  const { name = '', email = '', username = '' } = userData;
  const combined = `${name}${email}${username}`.toLowerCase();
  if (!combined) return 0;
  const matchCount = [...password.toLowerCase()].filter((ch) => combined.includes(ch)).length;
  return matchCount / password.length;
}

/**
 * Browser-safe numeric hash vectorization.
 * Creates deterministic numeric features without Node crypto.
 */
function numericHashVector(password, dims = 8) {
  const vec = {};
  for (let i = 0; i < dims; i++) {
    let hash = 0;
    const seed = password + i;
    for (let j = 0; j < seed.length; j++) {
      hash = (hash << 5) - hash + seed.charCodeAt(j);
      hash |= 0; // Convert to 32-bit integer
    }
    // Normalize between 0 and 1
    vec[`h${i}`] = Math.abs(hash % 10000) / 10000;
  }
  return vec;
}
