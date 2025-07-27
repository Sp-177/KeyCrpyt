import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../auth/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { setUser, clearUser } from '../../store/authSlice';
import ProfileSidebar from './ProfileSidebar';
import defaultPic from '../../assets/default-avatar.png';

const TopBar = () => {
  const [firebaseUser] = useAuthState(auth);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (firebaseUser) {
      dispatch(
        setUser({
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
        })
      );
    } else {
      dispatch(clearUser());
    }
  }, [firebaseUser, dispatch]);

  const user = useSelector((state) => state.auth);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[96%] max-w-7xl h-20 z-40 bg-white/20 backdrop-blur-2xl border border-white/30 shadow-lg rounded-3xl px-6 flex items-center justify-between transition-all duration-500 ease-in-out">
        <h1 className="text-xl font-semibold text-teal-800 tracking-wide drop-shadow-sm">KeyCrypt</h1>

        {user.isAuthenticated && (
          <div
            onClick={toggleSidebar}
            className="w-14 h-14 cursor-pointer bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            <img
              src={user.photoURL || defaultPic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <ProfileSidebar isOpen={showSidebar} onClose={toggleSidebar} />
    </>
  );
};

export default TopBar;