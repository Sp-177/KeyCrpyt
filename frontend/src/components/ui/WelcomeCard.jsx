import React from "react";

const WelcomeCard = ({ isDark, user }) => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)] px-4 relative z-10">
      <div
        className={`max-w-2xl w-full ${
          isDark
            ? "bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-gray-900/90 text-white"
            : "bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/70 text-gray-800"
        } backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-12 text-center relative group hover:scale-[1.02] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        <div className="relative z-10">
          <h1
            className={`text-5xl font-light ${
              isDark
                ? "bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300"
                : "bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600"
            } bg-clip-text text-transparent mb-8 tracking-wide leading-tight`}
          >
            Welcome to <span className="font-semibold">KeyCrypt</span>
          </h1>
          <p
            className={`${
              isDark ? "text-slate-300" : "text-slate-600"
            } text-xl font-light leading-relaxed mb-6`}
          >
            Your secure digital vault awaits
          </p>
          <div
            className={`inline-flex items-center gap-3 ${
              isDark
                ? "bg-white/5 border border-white/10 text-white"
                : "bg-gradient-to-r from-teal-100/80 to-cyan-100/70 border border-teal-200/50 text-slate-700"
            } backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm`}
          >
            <div
              className={`w-2 h-2 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-400 to-teal-400"
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              } rounded-full animate-pulse`}
            />
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
