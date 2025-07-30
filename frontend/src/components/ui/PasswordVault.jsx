import React, { useState, useRef } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Search,
  Copy,
  Globe,
  User,
  Key,
  X,
  Info
} from 'lucide-react';
import AddPasswordModal from './AddPasswordModal';
import EditPasswordModal from './EditPasswordModal';
import '../../index.css'
import {toast} from 'react-hot-toast'
const sampleVault = [
  { id: 1, site: 'github.com', username: 'john_doe', password: 'Gh@2024SecurePass!' },
  { id: 2, site: 'gmail.com', username: 'johndoe@gmail.com', password: 'Email$ecur1ty2024' },
  { id: 3, site: 'twitter.com', username: '@johndoe', password: 'Tw1tt3r@Pass2024' },
  { id: 4, site: 'linkedin.com', username: 'john.doe.dev', password: 'L1nk3d!n@2024' },
];

export default function PasswordVault({ isDark = true, user }) {
  const [vault, setVault] = useState(sampleVault);
  const [visibleIds, setVisibleIds] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);


  const toggleVisibility = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    setVault((prev) => prev.filter((entry) => entry.id !== id));
    toast.success('Password deleted successfully');
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedEntry) => {
    setVault(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    toast.success('Password updated successfully');
    setShowEditModal(false);
    setEditingEntry(null);
  };

  const handleCopy = async (text, type = 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleAdd = (newEntry) => {
    if (!newEntry.site || !newEntry.username || !newEntry.password) {
      toast.error('Please fill all fields');
      return;
    }
    setVault([...vault, { ...newEntry, id: Date.now() }]);
    toast.success('Password added successfully');
    setShowModal(false);
  };

  const filteredVault = vault.filter(
    (entry) =>
      entry.site.toLowerCase().includes(search.toLowerCase()) ||
      entry.username.toLowerCase().includes(search.toLowerCase())
  );

  const getFavicon = (site) => {
    const domain = site.replace(/(https?:\/\/)?(www\.)?/, '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="flex justify-center items-start h-full pt-8 pb-8 px-4">
      {/* Notifications - Enhanced with hot toast style */}
      

      {/* Main Vault Container - Properly centered and spaced */}
      <div className="w-full max-w-6xl  mx-auto">
        {/* Vault Box with Proper Spacing */}
        <div className={`rounded-3xl border shadow-2xl p-8 h-[80vh] flex flex-col transition-all duration-300 ${
          isDark 
            ? 'bg-black/40 backdrop-blur-3xl border-white/10 shadow-black/20'
            : 'bg-white/70 backdrop-blur-xl border-gray-200/50 shadow-gray-900/10'
        }`}>

          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 flex-shrink-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-teal-400' : 'text-teal-500'
              }`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search passwords..."
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDark
                    ? 'bg-black/30 border-white/20 text-white placeholder-gray-400 hover:bg-black/40'
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-white/90'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:scale-[1.02]`}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 hover:from-teal-400 hover:to-cyan-400 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Password
            </button>
          </div>

          {/* Vault Entries - Scrollable Container */}
          <div className="flex-1 overflow-y-auto pr-2 pl-2 custom-scrollbar">
            <div className="space-y-6">
            {filteredVault.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border ${
                isDark 
                  ? 'bg-black/20 border-white/10 text-gray-400' 
                  : 'bg-white/60 border-gray-200/50 text-gray-500'
              }`}>
                <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">No passwords found</p>
                <p className="mt-2">Add your first password to get started</p>
              </div>
            ) : (
              filteredVault.map((entry) => (
                <div
                  key={entry.id}
                  className={` group rounded-2xl p-4 border-2 shadow-lg hover:shadow-xl transform hover:scale-[1.0075] transition-all duration-300 ${
                    isDark 
                      ? 'bg-black/50 border-white/10 hover:border-cyan-400/40 hover:bg-black/60'
                      : 'bg-white/70 border-gray-200/50 hover:border-teal-400/60 hover:bg-white/85'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Site Icon */}
                    <div className={`w-16 h-16 rounded-2xl p-3 flex items-center justify-center shadow-lg flex-shrink-0 ${
                      isDark 
                        ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border border-cyan-400/30'
                        : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                    }`}>
                      <img 
                        src={getFavicon(entry.site)} 
                        alt=""
                        className="w-8 h-8"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <Globe className={`w-7 h-7 hidden ${isDark ? 'text-cyan-300' : 'text-white'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Site Name */}
                      <h3 className={`text-2xl font-bold truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {entry.site}
                      </h3>
                      
                      {/* Username Row */}
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span className={`text-base truncate flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {entry.username}
                        </span>
                        <button
                          onClick={() => handleCopy(entry.username, 'Username')}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            isDark 
                              ? 'hover:bg-teal-500/20 hover:text-teal-300 hover:border hover:border-teal-400/30' 
                              : 'hover:bg-teal-100 hover:text-teal-600 hover:border hover:border-teal-200'
                          }`}
                          title="Copy username"
                        >
                          <Copy className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      
                      {/* Password Row */}
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <code className={`text-base font-mono px-3 py-2 rounded-lg flex-1 ${
                          isDark ? 'bg-black/40 text-gray-300' : 'bg-gray-100 text-gray-700'
                        } ${visibleIds.includes(entry.id) ? 'break-all' : ''}`}>
                          {visibleIds.includes(entry.id) ? entry.password : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => handleCopy(entry.password)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            isDark 
                              ? 'hover:bg-teal-500/20 hover:text-teal-300 hover:border hover:border-teal-400/30' 
                              : 'hover:bg-teal-100 hover:text-teal-600 hover:border hover:border-teal-200'
                          }`}
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleVisibility(entry.id)}
                        className={`p-3 rounded-xl transition-all hover:scale-110 ${
                          visibleIds.includes(entry.id)
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-500/30'
                              : 'bg-cyan-100 text-cyan-600 border border-cyan-200 hover:bg-cyan-200'
                            : isDark
                              ? 'hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 hover:border hover:border-cyan-400/30'
                              : 'hover:bg-cyan-100 text-gray-600 hover:text-cyan-600 hover:border hover:border-cyan-200'
                        }`}
                        title={visibleIds.includes(entry.id) ? 'Hide password' : 'Show password'}
                      >
                        {visibleIds.includes(entry.id) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        className={`p-3 rounded-xl transition-all hover:scale-110 ${
                          isDark 
                            ? 'hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 hover:border hover:border-yellow-400/30' 
                            : 'hover:bg-yellow-100 text-gray-600 hover:text-yellow-600 hover:border hover:border-yellow-200'
                        }`}
                        title="Edit password"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className={`p-3 rounded-xl transition-all hover:scale-110 ${
                          isDark
                            ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400 hover:border hover:border-red-400/30'
                            : 'hover:bg-red-100 text-gray-600 hover:text-red-600 hover:border hover:border-red-200'
                        }`}
                        title="Delete password"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
                      </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AddPasswordModal
          isDark={isDark}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {showEditModal && editingEntry && (
        <EditPasswordModal
          isDark={isDark}
          entry={editingEntry}
          onClose={() => {
            setShowEditModal(false);
            setEditingEntry(null);
          }}
          onUpdate={handleUpdate}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-in {
          animation: animate-in 0.5s ease-out;
        }
        .slide-in-from-right-5 {
          animation: animate-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}