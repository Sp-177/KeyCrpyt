import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, sendResetEmail } from '../../auth/firebaseService';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../store/authSlice';
import UploadModal from './UploadModal'; // ✅ New Modal Component

const ProfileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const [showUpload, setShowUpload] = useState(false); // ✅ Popup control

  const handleChangePassword = async () => {
    try {
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

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-20 right-6 z-50 origin-top-right transform transition-all duration-500 ease-in-out ${
          isOpen
            ? 'scale-100 translate-x-0 opacity-100'
            : 'scale-90 translate-x-6 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-72 h-[calc(100vh-6rem)] bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 text-xl text-gray-700 rounded-full bg-white/30 backdrop-blur border border-white/40 shadow-md hover:bg-white/50 hover:text-black transition duration-300 ease-in-out"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="flex flex-col justify-center h-full mt-12 space-y-6">
            <button
              onClick={() => setShowUpload(true)} // ✅ Show Modal
              className="w-full py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-indigo-700 font-medium shadow hover:bg-white/30 hover:scale-105 transition duration-300 ease-in-out"
            >
              Change Profile Picture
            </button>
            <button
              onClick={handleChangePassword}
              className="w-full py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-cyan-700 font-medium shadow hover:bg-white/30 hover:scale-105 transition duration-300 ease-in-out"
            >
              Change Password
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-red-600 font-medium shadow hover:bg-white/30 hover:scale-105 transition duration-300 ease-in-out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal Popup */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
};

export default ProfileSidebar;
