import React, { useState } from 'react';
import { X, Info, Edit3, Globe, User, Key, Sparkles, Lightbulb, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ActivityInfoModal from './ActivityInfoModal';

export default function EditPasswordModal({ isDark, entry, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('edit');
  const [form, setForm] = useState({ ...entry });
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState(entry.keywords);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.site?.trim() || !form.username?.trim() || !form.password?.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    onUpdate({
      ...form,
      site: form.site.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
      keywords: keywords
    });
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (!trimmed) {
      toast.error('Please enter a keyword');
      return;
    }
    if (trimmed.length > 20) {
      toast.error('Keyword must be 20 characters or less');
      return;
    }
    if (keywords.length >= 5) {
      toast.error('Maximum 5 keywords allowed');
      return;
    }
    if (keywords.includes(trimmed)) {
      toast.error('Keyword already exists');
      return;
    }
    setKeywords(prev => [...prev, trimmed]);
    setKeywordInput('');
    toast.success('Keyword added');
  };

  const removeKeyword = (index) => {
    if (index >= 0 && index < keywords.length) {
      setKeywords(prev => prev.filter((_, i) => i !== index));
      toast.success('Keyword removed');
    }
  };

  const clearKeywords = () => {
    if (keywords.length === 0) {
      toast.error('No keywords to clear');
      return;
    }
    setKeywords([]);
    toast.success('All keywords cleared');
  };

  const suggestPassword = () => {
    let suggestion = '';
    if (keywords.length === 0) {
      // Generate random secure password
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const symbols = '@#$%&*!?';
      
      suggestion = 
        chars.charAt(Math.floor(Math.random() * chars.length)) +
        upperChars.charAt(Math.floor(Math.random() * upperChars.length)) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        symbols.charAt(Math.floor(Math.random() * symbols.length)) +
        Math.random().toString(36).slice(2, 8) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        symbols.charAt(Math.floor(Math.random() * symbols.length));
    } else {
      // Use keywords to generate password
      const base = keywords.join('').slice(0, 15);
      const randomNum = Math.floor(Math.random() * 999) + 1;
      const symbols = '@#$%&*!?';
      const symbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
      suggestion = `${base}${randomNum}${symbol}`;
    }
    
    setForm(prev => ({ ...prev, password: suggestion }));
    toast.success('Password suggestion applied');
  };

  const getFavicon = (site) => {
    if (!site) return '';
    const domain = site.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInfoTabClick = () => {
    setShowActivityModal(true);
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
        
        {/* Modal */}
        <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden animate-modal-in ${
          isDark 
            ? 'bg-black/40 backdrop-blur-3xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]' 
            : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900'
        }`}>
          <div className="p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Site Icon */}
                <div className={`w-12 h-12 rounded-2xl p-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border border-cyan-400/30'
                    : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                }`}>
                  <img 
                    src={getFavicon(entry.site)} 
                    alt=""
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Globe className={`w-5 h-5 hidden ${isDark ? 'text-cyan-300' : 'text-white'}`} />
                </div>
                
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDark 
                      ? 'bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent' 
                      : 'text-gray-900'
                  }`}>
                    Edit Password
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {entry.site}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400 hover:border hover:border-red-400/30 hover:scale-110 hover:rotate-90' 
                    : 'hover:bg-red-100 text-gray-600 hover:text-red-600 hover:border hover:border-red-200 hover:scale-110 hover:rotate-90'
                }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'edit'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105'
                    : isDark 
                      ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:scale-105' 
                      : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50 hover:scale-105'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleInfoTabClick}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:scale-105' 
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50 hover:scale-105'
                }`}
              >
                <Info className="w-4 h-4" />
                Info
              </button>
            </div>

            {/* Content - Only Edit Form */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Website Field */}
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 z-10" />
                  <input
                    type="text"
                    name="site"
                    value={form.site}
                    onChange={handleChange}
                    placeholder="Website (e.g. github.com)"
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                      isDark
                        ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:bg-black/30 hover:bg-black/25'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white hover:bg-gray-100'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50`}
                  />
                </div>

                {/* Username Field */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 z-10" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username or Email"
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                      isDark
                        ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:bg-black/30 hover:bg-black/25'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white hover:bg-gray-100'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50`}
                  />
                </div>

                {/* Password Field with Suggestion */}
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 z-10" />
                  <input
                    type="text"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full pl-12 pr-12 py-3 rounded-2xl border font-mono transition-all duration-300 ${
                      isDark
                        ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:bg-black/30 hover:bg-black/25'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white hover:bg-gray-100'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50`}
                  />
                  <button
                    type="button"
                    onClick={suggestPassword}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all duration-300 ${
                      isDark
                        ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10'
                        : 'text-teal-500 hover:text-teal-600 hover:bg-teal-50'
                    } hover:scale-110`}
                    title="Suggest strong password"
                  >
                    <Lightbulb className="w-5 h-5" />
                  </button>
                </div>

                {/* Keywords Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                      maxLength={20}
                      placeholder="Enter keyword & press enter"
                      className={`flex-1 pl-4 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                        isDark 
                          ? 'bg-black/20 backdrop-blur-xl border-white/10 text-white placeholder-gray-400 focus:bg-black/30 hover:bg-black/25' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white hover:bg-gray-100'
                      } focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400/50`}
                    />
                    <button 
                      type="button"
                      onClick={addKeyword} 
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isDark
                          ? 'text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300'
                          : 'text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600'
                      } hover:scale-110`}
                      title="Add keyword"
                    >
                      <PlusCircle className="w-6 h-6" />
                    </button>
                    <button 
                      type="button"
                      onClick={clearKeywords} 
                      title="Clear all keywords" 
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isDark
                          ? 'text-rose-400 hover:bg-rose-400/10 hover:text-rose-300'
                          : 'text-rose-500 hover:bg-rose-50 hover:text-rose-600'
                      } hover:scale-110`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {keywords.length > 0 && (
                    <div className={`max-h-24 overflow-y-auto rounded-xl p-3 border transition-all duration-300 ${
                      isDark 
                        ? 'bg-black/30 border-white/10' 
                        : 'bg-gray-100 border-gray-200'
                    }`}>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((word, index) => (
                          <span 
                            key={`${word}-${index}`}
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                          >
                            {word}
                            <button 
                              type="button"
                              onClick={() => removeKeyword(index)} 
                              className="text-black/70 hover:text-black hover:scale-110 transition-all duration-200 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/10"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300'
                    } hover:scale-105 active:scale-95`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:from-teal-400 hover:to-cyan-400 hover:scale-105 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modal-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          .animate-modal-in {
            animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? 'rgba(20, 184, 166, 0.5)' : 'rgba(20, 184, 166, 0.6)'};
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(20, 184, 166, 0.7)' : 'rgba(20, 184, 166, 0.8)'};
          }
        `}</style>
      </div>

      {/* Separate ActivityInfoModal */}
      {showActivityModal && (
        <ActivityInfoModal 
          isDark={isDark} 
          onClose={() => setShowActivityModal(false)}
        />
      )}
    </>
  );
}