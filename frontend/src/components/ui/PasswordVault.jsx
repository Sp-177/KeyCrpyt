import React, { useState, useRef,useEffect } from 'react';
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
import { getCredentials,addCredential,putCredential,deleteCredential} from '../../service/api/credentialService';




export default function PasswordVault({ isDark = true, user }) {
  const [vault, setVault] = useState([]);
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

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };
  
  useEffect(() => {
  async function fetchData() {
    
    try {
      const data = await getCredentials();
      // console.log(data)
      // console.log(user.getIdToken())
      setVault(data);

    } catch (err) {
      console.error("Failed to fetch credentials:", err);
      toast.error("Failed to load credentials");
    }
  }
  fetchData();
}, []);

const handleAdd = async (newEntry) => {
  try {
    if (!newEntry.website || !newEntry.username || !newEntry.password) {
      toast.error("Please fill all fields");
      return;
    }

    await addCredential(newEntry);

    const updated = await getCredentials();
    setVault(updated);

    toast.success("Password added successfully");
    setShowModal(false);
  } catch (err) {
    console.error("Failed to add credential:", err);
    toast.error("Failed to add password");
  }
};

const handleUpdate = async (updatedEntry) => {
  try {
    // here you might also call updateCredential API if needed
    // console.log(updatedEntry)
    await putCredential(updatedEntry);
    const updated = await getCredentials();
    setVault(updated);
    toast.success("Password updated successfully");
    setShowEditModal(false);
    setEditingEntry(null);
  } catch (err) {
    console.error("Failed to update credential:", err);
    toast.error("Failed to update password");
  }
};

const handleDelete = async (id) => {
  try {
    // also call deleteCredential(id) API if you implement it
    await deleteCredential(id);
    const updated = await getCredentials();
    setVault(updated);
    toast.success("Password deleted successfully");
  } catch (err) {
    console.error("Failed to delete credential:", err);
    toast.error("Failed to delete password");
  }
};


const filteredVault = Array.isArray(vault)
  ? vault.filter((entry) => {
      if (!entry || typeof entry !== "object") return false;

      const website = entry.website && typeof entry.website === "string"
        ? entry.website.toLowerCase()
        : "";
      const username = entry.username && typeof entry.username === "string"
        ? entry.username.toLowerCase()
        : "";
      const keywords = Array.isArray(entry.keywords)
        ? entry.keywords.filter((k) => typeof k === "string")
        : [];
      const searchText = (search || "").toLowerCase();

      return (
        website.includes(searchText) ||
        username.includes(searchText) ||
        keywords.some((k) => k.includes(searchText))
      );
    })
  : [];




// Safe getFavicon
const getFavicon = (website) => {
  if (!website) return "/default-favicon.png"; // fallback icon
  const domain = website.replace(/(https?:\/\/)?(www\.)?/, '');
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
};


  return (
    <div className="flex justify-center items-start h-full pt-8 pb-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Vault Container */}
        <div className={`rounded-3xl border-2 shadow-2xl p-8 h-[80vh] flex flex-col transition-all duration-300 ${
          isDark 
            ? 'bg-black/40 backdrop-blur-3xl border-white/20 shadow-black/30'
            : 'bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-gray-900/15'
        }`}>

          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 flex-shrink-0">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-md group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                isDark ? 'text-teal-400 group-hover:text-teal-300' : 'text-teal-500 group-hover:text-teal-600'
              }`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search passwords..."
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-black/30 border-white/20 text-white placeholder-gray-400 hover:bg-black/40 focus:bg-black/50 hover:border-white/30'
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-white/90 focus:bg-white hover:border-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:scale-[1.01] shadow-lg hover:shadow-xl`}
              />
            </div>

            {/* Enhanced Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 hover:from-teal-400 hover:to-cyan-400 border border-white/20"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              Add Password
            </button>
          </div>

          {/* Vault Entries - Enhanced Scrollable Container */}
          <div className="flex-1 overflow-y-auto pr-2 pl-2 custom-scrollbar">
            <div className="space-y-5">
            {filteredVault.length === 0 ? (
              <div
  className={`text-center py-20 px-6 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.015] shadow-md ${
    isDark
      ? 'bg-black/25 border-white/15 text-gray-400 hover:bg-black/30 backdrop-blur-xl'
      : 'bg-white/60 border-gray-200/60 text-gray-500 hover:bg-white/70 backdrop-blur-xl'
  }`}
>
  <div
    className={`w-24 h-24 mx-auto mb-6 rounded-3xl p-5 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
      isDark
        ? 'bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-300/30 shadow-indigo-500/20 shadow-xl'
        : 'bg-gradient-to-br from-sky-400 to-indigo-500 border border-white/30 shadow-lg'
    }`}
  >
    <Lock className={`w-12 h-12 animate-pulse ${isDark ? 'text-cyan-300' : 'text-white'}`} />
  </div>
  <p className="text-2xl font-semibold tracking-wide mb-2">No passwords found</p>
  <p className="text-base text-opacity-90">
    Add your first password to get started
  </p>
</div>
            ) : (
              filteredVault.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`group rounded-2xl p-5 border-2 shadow-lg hover:shadow-xl transform hover:scale-[1.005] transition-all duration-300 ${
                    isDark 
                      ? 'bg-black/50 border-white/15 hover:border-cyan-400/50 hover:bg-black/60'
                      : 'bg-white/70 border-gray-200/60 hover:border-teal-400/70 hover:bg-white/85'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideInUp 0.4s ease-out forwards'
                  }}
                >
                  <div className="flex items-center gap-6">
                    {/* Enhanced website Icon */}
                    <div className={`w-16 h-16 rounded-2xl p-3 flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
                      isDark 
                        ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border-2 border-cyan-400/30 group-hover:border-cyan-400/50'
                        : 'bg-gradient-to-br from-teal-500 to-cyan-500 border-2 border-white/30 group-hover:border-white/50'
                    }`}>
                      <img 
                        src={getFavicon(entry.website)} 
                        alt=""
                        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <Globe className={`w-7 h-7 hidden transition-transform duration-300 group-hover:scale-110 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* website Name */}
                      <h3 className={`text-2xl font-bold truncate transition-colors duration-300 ${
                        isDark ? 'text-white group-hover:text-cyan-300' : 'text-gray-900 group-hover:text-teal-600'
                      }`}>
                        {entry.website}
                      </h3>
                      
                      {/* Username Row */}
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-teal-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className={`text-base truncate flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {entry.username}
                        </span>
                        <button
                          onClick={() => handleCopy(entry.username, 'Username')}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isDark 
                              ? 'hover:bg-teal-500/20 hover:text-teal-300 hover:border hover:border-teal-400/30' 
                              : 'hover:bg-teal-100 hover:text-teal-600 hover:border hover:border-teal-200'
                          }`}
                          title="Copy username"
                        >
                          <Copy className="w-4 h-4 text-teal-400 transition-transform duration-300 hover:scale-110" />
                        </button>
                      </div>
                      
                      {/* Password Row */}
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-teal-400 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <code className={`text-base font-mono px-3 py-2.5 rounded-lg flex-1 transition-all duration-300 ${
                          isDark ? 'bg-black/40 text-gray-300 hover:bg-black/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${visibleIds.includes(entry.id) ? 'break-all' : ''}`}>
                          {visibleIds.includes(entry.id) ? entry.password : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => handleCopy(entry.password)}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                            isDark 
                              ? 'hover:bg-teal-500/20 hover:text-teal-300 hover:border hover:border-teal-400/30' 
                              : 'hover:bg-teal-100 hover:text-teal-600 hover:border hover:border-teal-200'
                          }`}
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4 text-teal-400 transition-transform duration-300 hover:scale-110" />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleVisibility(entry.id)}
                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                          visibleIds.includes(entry.id)
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50'
                              : 'bg-cyan-100 text-cyan-600 border-2 border-cyan-200 hover:bg-cyan-200 hover:border-cyan-300'
                            : isDark
                              ? 'hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 hover:border-2 hover:border-cyan-400/30'
                              : 'hover:bg-cyan-100 text-gray-600 hover:text-cyan-600 hover:border-2 hover:border-cyan-200'
                        }`}
                        title={visibleIds.includes(entry.id) ? 'Hide password' : 'Show password'}
                      >
                        {visibleIds.includes(entry.id) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isDark 
                            ? 'hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 hover:border-2 hover:border-yellow-400/30' 
                            : 'hover:bg-yellow-100 text-gray-600 hover:text-yellow-600 hover:border-2 hover:border-yellow-200'
                        }`}
                        title="Edit password"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isDark
                            ? 'hover:bg-red-500/20 text-gray-300 hover:text-red-400 hover:border-2 hover:border-red-400/30'
                            : 'hover:bg-red-100 text-gray-600 hover:text-red-600 hover:border-2 hover:border-red-200'
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

      {/* Enhanced Custom Scrollbar Styles */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          border-radius: 12px;
          margin: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'linear-gradient(to bottom, rgba(20, 184, 166, 0.6), rgba(6, 182, 212, 0.6))' : 'linear-gradient(to bottom, rgba(20, 184, 166, 0.7), rgba(6, 182, 212, 0.7))'};
          border-radius: 12px;
          border: 2px solid ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'linear-gradient(to bottom, rgba(20, 184, 166, 0.8), rgba(6, 182, 212, 0.8))' : 'linear-gradient(to bottom, rgba(20, 184, 166, 0.9), rgba(6, 182, 212, 0.9))'};
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}