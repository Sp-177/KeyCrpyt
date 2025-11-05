import React from 'react';

export default function Loading({ message = 'Loading KeyCrypt...', isDark = true }) {

  return (
    <div className={`w-full h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'} relative overflow-hidden`}>
      {/* Animated orb background */}
      <div className={`absolute w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse-slow z-0 ${
        isDark
          ? 'bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600'
          : 'bg-gradient-to-tr from-cyan-200 via-teal-100 to-blue-300'
      }`} style={{ top: '30%', left: '35%' }} />

      {/* Glassmorphic center card */}
      <div className={`z-10 px-8 py-6 rounded-2xl backdrop-blur-xl border shadow-lg animate-fade-in
        ${isDark
          ? 'bg-white/5 border-white/10 text-white shadow-cyan-500/10'
          : 'bg-white/80 border-gray-300 text-gray-900 shadow-md'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <span className={`loading loading-bars loading-lg ${isDark ? 'text-cyan-300' : 'text-teal-600'}`} />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
