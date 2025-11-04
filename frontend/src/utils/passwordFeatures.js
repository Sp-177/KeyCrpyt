export function extractPasswordFeatures(password, userData = {}) {
  const lower = password.toLowerCase();
  const length = password.length || 1;

  const uniqueChars = new Set(password).size;
  const upperRatio = (password.match(/[A-Z]/g) || []).length / length;
  const lowerRatio = (password.match(/[a-z]/g) || []).length / length;
  const digitRatio = (password.match(/[0-9]/g) || []).length / length;
  const symbolRatio = (password.match(/[^a-zA-Z0-9]/g) || []).length / length;

  const entropy = calculateEntropy(password);
  const transitionDiversity = calcTransitionDiversity(password);
  const similarityToUser = calcSimilarityToUser(password, userData);
  const charClassCount = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^a-zA-Z0-9]/].reduce(
    (count, regex) => count + (regex.test(password) ? 1 : 0),
    0
  );
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
    charClassCount,
    label: -1,
    ...hashedVector,
  };
}

function calculateEntropy(str) {
  if (!str.length) return 0;
  const freq = {};
  for (let ch of str) freq[ch] = (freq[ch] || 0) + 1;
  const probs = Object.values(freq).map((v) => v / str.length);
  return -probs.reduce((sum, p) => sum + p * Math.log2(p), 0);
}

function calcTransitionDiversity(password) {
  if (password.length <= 1) return 0;
  const transitions = new Set();
  for (let i = 0; i < password.length - 1; i++) {
    transitions.add(password[i] + password[i + 1]);
  }
  return transitions.size / (password.length - 1);
}

function calcSimilarityToUser(password, userData) {
  const { name = '', email = '', username = '' } = userData;
  const combined = `${name}${email}${username}`.toLowerCase();
  if (!combined) return 0;
  const matchCount = [...password.toLowerCase()].filter((ch) => combined.includes(ch)).length;
  return matchCount / password.length;
}

function numericHashVector(password, dims = 8) {
  const vec = {};
  for (let i = 0; i < dims; i++) {
    let hash = 0;
    const seed = password + i;
    for (let j = 0; j < seed.length; j++) {
      hash = (hash << 5) - hash + seed.charCodeAt(j);
      hash |= 0;
    }
    vec[`h${i}`] = Math.abs(hash % 10000) / 10000;
  }
  return vec;
}
