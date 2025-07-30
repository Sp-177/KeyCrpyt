import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../auth/firebaseConfig";
import TopBar from "../components/ui/TopBar";
import { useSelector } from "react-redux";
import WelcomeCard from "../components/ui/WelcomeCard";
import FloatingHint from "../components/ui/FloatingHints";
// import PasswordVault from "../components/ui/PasswordVault";
// import Notifications from "../components/ui/Notifications";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [view, setView] = useState("home");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/landing");
    }
  }, [user, loading, navigate]);

  if (loading)
    return <div className="text-center mt-20 text-teal-600">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-rose-500">Error: {error.message}</div>;
  if (!user) return null;

  return (
    <div
      className={`relative min-h-screen pt-24 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white"
          : "bg-gradient-to-br from-emerald-50 via-teal-50/80 to-cyan-50 text-gray-800"
      }`}
    >
      <TopBar onNavigate={setView} />

      {/* Background Waves & Orbs */}
      <div className="absolute inset-0 -z-10">
        {[1, 2, 3].map((layer, i) => {
          const colors = isDark
            ? [
                ["#334155", "#0f172a", "#1e293b"],
                ["#1e3a8a", "#0e7490", "#164e63"],
                ["#0369a1", "#0891b2", "#0f766e"],
              ]
            : [
                ["#a7f3d0", "#67e8f9", "#a5f3fc"],
                ["#6ee7b7", "#7dd3fc", "#bae6fd"],
                ["#5eead4", "#22d3ee", "#67e8f9"],
              ];

          return (
            <div key={layer} className={`absolute inset-0 opacity-${40 - i * 10}`}>
              <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`wave${layer}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors[layer - 1][0]} stopOpacity="0.5" />
                    <stop offset="50%" stopColor={colors[layer - 1][1]} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={colors[layer - 1][2]} stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#wave${layer})`}
                  d={`M0,${400 + 100 * (layer - 1)}L48,${380 + 100 * (layer - 1)}C96,${360 + 100 * (layer - 1)},192,${320 + 100 * (layer - 1)},288,${300 + 100 * (layer - 1)}C384,${280 + 100 * (layer - 1)},480,${280 + 100 * (layer - 1)},576,${300 + 100 * (layer - 1)}C672,${320 + 100 * (layer - 1)},768,${360 + 100 * (layer - 1)},864,${380 + 100 * (layer - 1)}C960,${400 + 100 * (layer - 1)},1056,${400 + 100 * (layer - 1)},1152,${380 + 100 * (layer - 1)}C1248,${360 + 100 * (layer - 1)},1344,${320 + 100 * (layer - 1)},1392,${300 + 100 * (layer - 1)}L1440,${280 + 100 * (layer - 1)}L1440,800L0,800Z`}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    values={`0,0;${10 * layer},${5 * layer};0,0`}
                    dur={`${20 + 5 * layer}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          );
        })}

        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl ${
            isDark
              ? "bg-gradient-radial from-indigo-800/30 via-slate-800/20 to-transparent"
              : "bg-gradient-radial from-emerald-200/30 via-teal-200/20 to-transparent"
          }`}
        />
        <div
          className={`absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl ${
            isDark
              ? "bg-gradient-radial from-purple-700/25 via-gray-700/15 to-transparent"
              : "bg-gradient-radial from-cyan-200/25 via-teal-200/15 to-transparent"
          }`}
        />
        <div
          className={`absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full blur-xl ${
            isDark
              ? "bg-gradient-radial from-cyan-800/20 via-indigo-900/10 to-transparent"
              : "bg-gradient-radial from-teal-300/20 via-emerald-200/10 to-transparent"
          }`}
        />

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(20,184,166,0.3)"
              } 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {view === 'home' && <WelcomeCard isDark={isDark} user={user} />}
      {view === 'passwords' && <PasswordVault isDark={isDark} user={user} />}
      {view === 'notifications' && <Notifications isDark={isDark} user={user} />}

      <FloatingHint isDark={isDark} />
    </div>
  );
};

export default Dashboard;