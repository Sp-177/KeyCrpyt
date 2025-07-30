import React, { useState } from 'react';
import { Plus, Globe, User, Key, Sparkles, X, Lightbulb, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AddPasswordModal({ isDark, onClose, onAdd }) {
  const [formData, setFormData] = useState({ site: '', username: '', password: '' });
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);

  const handleSubmit = () => {
    if (!formData.site || !formData.username || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    onAdd(formData);
    setFormData({ site: '', username: '', password: '' });
    setKeywords([]);
    setKeywordInput('');
    
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && trimmed.length <= 20 && keywords.length < 5) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    } else if (keywords.length >= 5) {
      toast.error('Maximum 5 keywords allowed');
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const clearKeywords = () => {
    setKeywords([]);
    toast.success('Cleared all keywords');
  };

  const suggestPassword = () => {
    let suggestion = '';
    if (keywords.length === 0) {
      suggestion = Math.random().toString(36).slice(2, 8) + '@' + Math.random().toString(36).slice(2, 6).toUpperCase() + '#';
    } else {
      const base = keywords.join('-').slice(0, 20);
      suggestion = `${base}-${Math.random().toString(36).slice(2, 5)}*`;
    }
    setFormData({ ...formData, password: suggestion });
    toast.success('Suggested password inserted');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>
      <div className={`relative z-20 w-full max-w-lg rounded-3xl shadow-2xl border transform transition-all duration-300 overflow-hidden ${
        isDark 
          ? 'bg-black/40 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]' 
          : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900'
      }`}>
        <div className="relative z-30 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl p-2 flex items-center justify-center ${
                isDark 
                  ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-cyan-400/30' 
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500'
              }`}>
                <Plus className={`w-6 h-6 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
              </div>
              <h3 className={`text-xl font-bold ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent' 
                  : 'text-gray-900'
              }`}>
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
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                placeholder="Website (e.g. github.com)"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                  isDark 
                    ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30`}
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
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30`}
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
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30`}
              />
              <button
                onClick={suggestPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-200"
                title="Suggest strong password"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>

            <div className="relative space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
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
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                />
                <button onClick={addKeyword} className="text-yellow-400 hover:scale-110">
                  <PlusCircle className="w-6 h-6" />
                </button>
                <button onClick={clearKeywords} title="Clear all" className="text-rose-400 hover:scale-110">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {keywords.length > 0 && (
                <div className={`max-h-24 overflow-y-auto rounded-xl p-2 text-sm flex flex-wrap gap-2 ${
                  isDark 
                    ? 'bg-black/30 border border-white/10 text-white' 
                    : 'bg-gray-100 border border-gray-200 text-gray-900'
                }`}>
                  {keywords.map((word, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs flex items-center gap-2">
                      {word}
                      <button onClick={() => removeKeyword(index)} className="text-black/70 hover:text-black">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-2xl font-medium ${
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
