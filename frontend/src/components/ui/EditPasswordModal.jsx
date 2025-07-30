import React, { useState } from 'react';
import { X, Info, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditPasswordModal({ isDark, entry, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('edit');
  const [form, setForm] = useState({ ...entry });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.site || !form.username || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    onUpdate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className={`w-full max-w-xl rounded-3xl shadow-2xl p-6 relative transition-all duration-300 ${
        isDark ? 'bg-black/80 text-white border border-white/10' : 'bg-white text-gray-900 border border-gray-200'
      }`}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-all hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex space-x-4 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeTab === 'edit'
                ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-teal-100 text-teal-600'
                : isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeTab === 'info'
                ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-teal-100 text-teal-600'
                : isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-teal-600'
            }`}
          >
            <Info className="w-4 h-4" />
            Info
          </button>
        </div>

        {activeTab === 'edit' ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Site</label>
              <input
                type="text"
                name="site"
                value={form.site}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-500'
                } focus:outline-none`}
                placeholder="e.g. github.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-500'
                } focus:outline-none`}
                placeholder="e.g. johndoe123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-black/40 border-white/10 text-white placeholder-gray-400 focus:border-cyan-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-teal-500'
                } focus:outline-none`}
                placeholder="e.g. P@ssw0rd123!"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="text-sm space-y-4 leading-relaxed">
            <p><strong>Site:</strong> {entry.site}</p>
            <p><strong>Username:</strong> {entry.username}</p>
            <p><strong>Password:</strong> {entry.password}</p>
            <p className="text-gray-400 italic">Edit and save the credentials if needed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
