import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ActivityInfoModal({ isDark, onClose }) {
  const [activityList, setActivityList] = useState([
    {
      device: 'Chrome on Windows',
      location: 'Raipur, India',
      timestamp: '2025-08-05 10:45 AM',
      confirmed: null,
    },
    {
      device: 'Safari on iPhone',
      location: 'Mumbai, India',
      timestamp: '2025-08-04 8:22 PM',
      confirmed: null,
    },
    {
      device: 'Edge on Windows',
      location: 'Nagpur, India',
      timestamp: '2025-08-02 6:10 PM',
      confirmed: null,
    },
  ]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = (index, response) => {
    const updated = [...activityList];
    updated[index].confirmed = response;
    setActivityList(updated);
    toast.success(`Marked as '${response ? "Yes" : "No"}'`);
  };

  return (
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
              <div className={`w-12 h-12 rounded-2xl p-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/60 to-gray-900/50 border border-cyan-400/30'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500'
              }`}>
                <Globe className={`w-6 h-6 ${isDark ? 'text-cyan-300' : 'text-white'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  isDark 
                    ? 'bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent' 
                    : 'text-gray-900'
                }`}>
                  Recent Activity
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last sign-in activity
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

          {/* Activity List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {activityList.map((entry, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-4 border shadow-sm transition-all duration-300 space-y-2 ${
                  isDark
                    ? 'bg-black/20 border-white/10 text-gray-100 hover:bg-black/30'
                    : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{entry.device}</div>
                  <div className="text-sm font-mono text-right">{entry.timestamp}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={isDark ? 'text-cyan-300' : 'text-teal-600'}>
                    {entry.location}
                  </span>
                  {entry.confirmed === null ? (
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => handleConfirm(index, true)}
                        className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                          isDark
                            ? 'bg-green-500/10 text-green-300 hover:bg-green-500/20'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleConfirm(index, false)}
                        className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                          isDark
                            ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      entry.confirmed
                        ? (isDark ? 'bg-green-500/10 text-green-300' : 'bg-green-100 text-green-700')
                        : (isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-100 text-red-700')
                    }`}>
                      Marked: {entry.confirmed ? 'Yes' : 'No'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles */}
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
  );
}
