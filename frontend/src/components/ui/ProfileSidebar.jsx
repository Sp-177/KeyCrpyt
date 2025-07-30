import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, sendResetEmail } from '../../auth/firebaseService';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../store/authSlice';
import { setTheme } from '../../store/themeSlice'; // ✅ import setTheme
import UploadModal from './UploadModal';
import defaultPic from '../../assets/default-avatar.png';
import { saveTheme } from '../../utils/themePreference';

// Icons
import { LogOut, Moon, KeyRound, Pencil, X } from 'lucide-react';

const ProfileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const photoURL = useSelector((state) => state.auth.photoURL);
  const theme = useSelector((state) => state.theme.theme);
  const [showUpload, setShowUpload] = useState(false);

  const handleChangePassword = async () => {
    try {
      // console.log(email)
      await sendResetEmail(email);
      toast.success('📧 Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email.');
      console.error(error);
    }
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      dispatch(clearUser());
      toast.success('Signed out successfully.');
      navigate('/landing');
    } catch (error) {
      toast.error('Error signing out.');
      console.error(error);
    }
    onClose();
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme({ theme: newTheme }));
    try {
      saveTheme(newTheme);
      toast(`🌓 Theme changed to ${newTheme}`);
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-20 right-6 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top-right ${
          isOpen
            ? 'scale-100 opacity-100 translate-x-0'
            : 'scale-95 opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="w-80 h-[calc(100vh-6rem)]
          bg-black/40 backdrop-blur-3xl 
          shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
          border border-white/10 rounded-[2rem] 
          p-8 relative flex flex-col justify-between
          before:absolute before:inset-0 before:rounded-[2rem] 
          before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/10 
          before:pointer-events-none before:opacity-20"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 text-gray-200 rounded-2xl 
              bg-white/5 backdrop-blur-md border border-white/20 shadow-md 
              hover:bg-white/10 hover:scale-105 hover:rotate-90 
              transition-all duration-300 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Top Section - Polaroid */}
          <div className="mt-8 flex flex-col items-center">
            <div className="relative group">
              <div className="bg-gradient-to-b from-slate-100/90 to-slate-50/80 backdrop-blur-sm 
                p-5 pb-10 rounded-2xl shadow-xl 
                transform hover:rotate-1 hover:scale-[1.02] 
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                border border-white/20">
                <div className="relative w-44 h-44 rounded-xl border-4 border-white/20 
                  shadow-inner overflow-hidden bg-slate-100/50">
                  <img
                    src={photoURL || defaultPic}
                    alt="Profile"
                    className="w-full h-full object-cover transition-all duration-300 
                      group-hover:scale-105"
                  />
                  <button
                    onClick={() => setShowUpload(true)}
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-teal-500 to-cyan-500 
                      hover:from-teal-600 hover:to-cyan-600 text-white 
                      rounded-full p-2.5 shadow-lg transition-all duration-300 
                      hover:scale-110 border-2 border-white/90
                      opacity-0 group-hover:opacity-100 hover:shadow-xl"
                    title="Change Profile Picture"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-600 text-sm italic font-light tracking-wide">
                    My Profile
                  </p>
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 
                w-16 h-7 bg-gradient-to-b from-slate-100/80 to-slate-200/60 
                backdrop-blur-sm rounded-lg shadow-sm border border-slate-300/40 
                rotate-2 opacity-90"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 mt-8 px-1">
            <button
              onClick={handleToggleTheme}
              className="flex items-center gap-4 py-4 px-5 rounded-2xl 
                bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium 
                shadow-md hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg 
                transition-all duration-300"
            >
              <Moon size={18} className="text-purple-300" />
              <span>Toggle Theme</span>
            </button>

            <button
              onClick={handleChangePassword}
              className="flex items-center gap-4 py-4 px-5 rounded-2xl 
                bg-white/5 backdrop-blur-md border border-blue-500/30 text-white font-medium 
                shadow-md hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg 
                transition-all duration-300"
            >
              <KeyRound size={18} className="text-blue-300" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-3 py-4 px-5 w-full rounded-2xl 
                bg-white/5 backdrop-blur-md border border-red-500/30 text-white font-medium 
                shadow-md hover:bg-white/10 hover:text-red-300 hover:scale-[1.02] hover:shadow-lg 
                transition-all duration-300"
            >
              <LogOut size={18} className="text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
};

export default ProfileSidebar;
