import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../auth/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { setUser, clearUser } from '../../store/authSlice';
import ProfileSidebar from './ProfileSidebar';
import defaultPic from '../../assets/default-avatar.png';
import logo from '../../assets/logo.svg';
import { HiHome, HiKey, HiBell } from 'react-icons/hi';

const TopBar = ({ onNavigate }) => {
  const [firebaseUser] = useAuthState(auth);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  const alertCount = useSelector((state) => state.alert.alertCount); // correctly select from alert slice

useEffect(() => {
  if (firebaseUser) {
    dispatch(
      setUser({
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || defaultPic,
      })
    );
    // console.log('User authenticated:', firebaseUser.photoURL);
  } else {
    dispatch(clearUser());
  }
}, [firebaseUser, dispatch]);

  const user = useSelector((state) => state.auth);


  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <>
      <div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[96%] max-w-6xl h-20 z-40
        bg-black/40 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        border border-white/10 rounded-[2rem] px-8 flex items-center justify-between
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        before:absolute before:inset-0 before:rounded-[2rem]
        before:bg-gradient-to-r before:from-white/5 before:via-transparent before:to-white/10
        before:pointer-events-none"
      >
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl p-2
            flex items-center justify-center shadow-md backdrop-blur-md">
            <img
              src={logo}
              alt="KeyCrypt Logo"
              className="w-full h-full object-contain
                brightness-[1.6] contrast-[1.2] saturate-[1.8]
                drop-shadow-[0_0_4px_rgba(13,255,247,0.3)]"
            />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-teal-300 to-cyan-300
            bg-clip-text text-transparent tracking-wide drop-shadow-sm select-none">
            KeyCrypt
          </h1>
        </div>

        {/* Navigation Icons with Labels */}
        <div className="flex gap-6 items-center relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-teal-300 hover:text-white transition duration-200"
            title="Home"
          >
            <HiHome size={18} />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => onNavigate('passwords')}
            className="flex items-center gap-1 text-teal-300 hover:text-white transition duration-200"
            title="Passwords"
          >
            <HiKey size={18} />
            <span className="text-sm font-medium hidden sm:inline">Vault</span>
          </button>

          <div className="relative">
            <button
              onClick={() => onNavigate('notifications')}
              className="flex items-center gap-1 text-teal-300 hover:text-white transition duration-200"
              title="Notifications"
            >
              <div className="relative">
                <HiBell size={18} />
                {alertCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-gradient-to-tr from-rose-500 via-rose-400 to-rose-600 text-white text-[10px] min-w-[1.2rem] h-[1.2rem] flex items-center justify-center font-bold rounded-full shadow-md animate-pulse ring-2 ring-white/20">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Alerts</span>
            </button>
          </div>

          {user.isAuthenticated && (
            <div
              onClick={toggleSidebar}
              className="w-14 h-14 cursor-pointer bg-gradient-to-br from-slate-800/60 to-gray-900/50
                backdrop-blur-xl border border-cyan-400/30 rounded-full overflow-hidden
                shadow-xl hover:scale-110 hover:shadow-2xl
                hover:ring-4 hover:ring-cyan-400/40
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group"
            >
              <img
                src={ user.photoURL || defaultPic}
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </div>

      <ProfileSidebar isOpen={showSidebar} onClose={toggleSidebar} />
    </>
  );
};

export default TopBar;
