import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../auth/firebaseConfig";  // <-- Make sure you import auth
import TopBar from "../components/ui/TopBar";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/landing");
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error.message}</div>;
  if (!user) return null;

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 bg-gradient-to-br from-teal-100 via-cyan-100 to-emerald-100">
      <TopBar />

      {/* Ocean Wave Animation */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#a7f3d0"
            fillOpacity="0.5"
            d="M0,128L40,122.7C80,117,160,107,240,101.3C320,96,400,96,480,117.3C560,139,640,181,720,202.7C800,224,880,224,960,202.7C1040,181,1120,139,1200,117.3C1280,96,1360,96,1400,96L1440,96L1440,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,128L40,122.7C80,117,160,107,240,101.3C320,96,400,96,480,117.3C560,139,640,181,720,202.7C800,224,880,224,960,202.7C1040,181,1120,139,1200,117.3C1280,96,1360,96,1400,96L1440,96L1440,320L0,320Z;
                M0,96L60,90.7C120,85,240,75,360,90.7C480,107,600,149,720,165.3C840,181,960,171,1080,160C1200,149,1320,139,1380,133.3L1440,128L1440,320L0,320Z;
                M0,128L40,122.7C80,117,160,107,240,101.3C320,96,400,96,480,117.3C560,139,640,181,720,202.7C800,224,880,224,960,202.7C1040,181,1120,139,1200,117.3C1280,96,1360,96,1400,96L1440,96L1440,320L0,320Z"
            />
          </path>
        </svg>
      </div>

      {/* Welcome Card */}
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] px-4">
        <div className="max-w-xl w-full bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/25 via-white/10 to-transparent pointer-events-none" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-wide drop-shadow-md">
            Welcome to <span className="text-teal-700">KeyCrypt</span>
          </h1>
          <p className="text-gray-700 text-lg drop-shadow-sm">
            You're logged in as <span className="font-semibold text-gray-900">{user.email}</span>
          </p>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-teal-200 via-cyan-200 to-green-200 opacity-0 group-hover:opacity-50 transition-opacity blur-md rounded-3xl z-[-1]" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
