import React, { useState, useEffect } from 'react';
import { Plus, Globe, User, Key, Sparkles, X, Lightbulb, PlusCircle, Trash2 } from 'lucide-react';
import { extractPasswordFeatures } from '../../utils/passwordFeatures';
import { auth } from '../../auth/firebaseConfig';

export default function AddPasswordModal({ isDark, onClose, onAdd, setFeatures }) {
  const [formData, setFormData] = useState({ website: '', username: '', password: '' });
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [strength, setStrength] = useState(null);

  const colorMap = {
    Weak: isDark ? 'text-red-400' : 'text-red-500',
    Medium: isDark ? 'text-yellow-300' : 'text-yellow-500',
    Strong: isDark ? 'text-green-400' : 'text-green-500',
  };

  const bgColorMap = {
    Weak: isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
    Medium: isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200',
    Strong: isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200',
  };

  const showToast = (message, type = 'error') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const handleSubmit = () => {
    if (!formData.website || !formData.username || !formData.password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    onAdd({ ...formData, keywords: keywords });
    setFormData({ website: '', username: '', password: '' });
    setKeywords([]);
    setKeywordInput('');

    if (typeof window.extractPasswordFeatures === 'function') {
      const features = window.extractPasswordFeatures(formData.password);
      setFeatures(features);
    }
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && trimmed.length <= 20 && keywords.length < 5) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    } else if (keywords.length >= 5) {
      showToast('Maximum 5 keywords allowed', 'error');
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const clearKeywords = () => {
    setKeywords([]);
    showToast('Cleared all keywords', 'success');
  };

  const suggestPassword = () => {
    let suggestion = '';
    if (keywords.length === 0) {
      suggestion =
        Math.random().toString(36).slice(2, 8) +
        '@' +
        Math.random().toString(36).slice(2, 6).toUpperCase() +
        '#';
    } else {
      const base = keywords.join('-').slice(0, 20);
      suggestion = `${base}-${Math.random().toString(36).slice(2, 5)}*`;
    }
    setFormData({ ...formData, password: suggestion });
    showToast('Suggested password inserted', 'success');
  };

  useEffect(() => {
    if (!formData.password) {
      setStrength(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      await handleStrengthCheck(formData.password);
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [formData.password]);

  const handleStrengthCheck = async (password) => {
    try {

      const features = extractPasswordFeatures(password);

      // Mock strength check for demo - replace with actual API call
      const response = await fetch(`http://localhost:8000/predict-strength/${auth.currentUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      });

      if (!response.ok) throw new Error('Failed to predict strength');

      const data = await response.json();
      setStrength(data.predicted_label);

      console.log('🔹 Password strength:', data);
    } catch (error) {
      console.error(error);
      showToast('Failed to analyze password strength', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>
      <div
        className={`relative z-20 w-full max-w-lg rounded-3xl shadow-2xl border transform transition-all duration-300 overflow-hidden ${
          isDark
            ? 'bg-black/40 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]'
            : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900'
        }`}
      >
        <div className="relative z-30 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl p-2 flex items-center justify-center ${
                  isDark
                    ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-cyan-400/30'
                    : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                }`}
              >
                <Plus className={`w-6 h-6 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
              </div>
              <h3
                className={`text-xl font-bold ${
                  isDark
                    ? 'bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent'
                    : 'text-gray-900'
                }`}
              >
                Add Password
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
              <input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="Website (e.g. github.com)"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                  isDark
                    ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all`}
              />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username or Email"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                  isDark
                    ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all`}
              />
            </div>

            <div className="relative">
              <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
              <input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-3 rounded-2xl border ${
                  isDark
                    ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all`}
              />
              <button
                onClick={suggestPassword}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-500 hover:text-cyan-600'
                }`}
                title="Suggest strong password"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>

            {strength && (
              <div
                className={`rounded-2xl p-4 border backdrop-blur-xl transition-all duration-500 ${bgColorMap[strength]}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-black/20' : 'bg-white/80'
                    }`}
                  >
                    <span className="text-xl">
                      {strength === 'Weak' && '⚠️'}
                      {strength === 'Medium' && '🟡'}
                      {strength === 'Strong' && '✅'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${colorMap[strength]}`}>
                      {strength === 'Weak' && 'Weak Password'}
                      {strength === 'Medium' && 'Medium Strength'}
                      {strength === 'Strong' && 'Strong Password'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {strength === 'Weak' &&
                        'Consider adding symbols, numbers, or uppercase letters'}
                      {strength === 'Medium' && 'Good, but can be improved with more variety'}
                      {strength === 'Strong' && 'Excellent! Your password is secure'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  maxLength={20}
                  placeholder="Enter keyword & press enter"
                  className={`flex-1 pl-4 pr-12 py-3 rounded-2xl border ${
                    isDark
                      ? 'bg-black/20 border-white/10 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all`}
                />
                <button
                  onClick={addKeyword}
                  className={`transition-all hover:scale-110 ${
                    isDark
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-yellow-500 hover:text-yellow-600'
                  }`}
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={clearKeywords}
                  title="Clear all"
                  className={`transition-all hover:scale-110 ${
                    isDark
                      ? 'text-rose-400 hover:text-rose-300'
                      : 'text-rose-500 hover:text-rose-600'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {keywords.length > 0 && (
                <div
                  className={`max-h-24 overflow-y-auto rounded-2xl p-3 text-sm flex flex-wrap gap-2 ${
                    isDark
                      ? 'bg-black/30 border border-white/10'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  {keywords.map((word, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all hover:scale-105 ${
                        isDark
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          : 'bg-yellow-400 text-black'
                      }`}
                    >
                      {word}
                      <button
                        onClick={() => removeKeyword(index)}
                        className={`hover:scale-125 transition-transform ${
                          isDark
                            ? 'text-yellow-200 hover:text-white'
                            : 'text-black/70 hover:text-black'
                        }`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-2xl font-medium transition-all hover:scale-105 ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              Add Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
