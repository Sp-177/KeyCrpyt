// Fixed DropDown.jsx - Updated to work with Redux and proper error handling
import React, { useState } from 'react';
import {
  FaChevronDown,
  FaGoogle,
  FaMicrosoft,
  FaYahoo,
  FaFacebook,
  FaXTwitter,
  FaApple,
} from 'react-icons/fa6';
import { signInWithGoogle } from '../../auth/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice'; // Fixed import path
import toast from 'react-hot-toast';

const socialOptions = [
  { name: 'Google', icon: FaGoogle },
  { name: 'Microsoft', icon: FaMicrosoft },
  { name: 'Yahoo', icon: FaYahoo },
  { name: 'Facebook', icon: FaFacebook },
  { name: 'Twitter', icon: FaXTwitter },
  { name: 'Apple', icon: FaApple },
];

export default function DropDown() {
  const [selected, setSelected] = useState(socialOptions[0]);
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Added Redux dispatch

  const handleSelect = async (option) => {
    setSelected(option);

    if (option.name === 'Google') {
      if (signingIn) return; // prevent double click
      setSigningIn(true);
      const toastId = toast.loading(' Signing in with Google...');

      try {
        console.log('🔐 Initiating Google sign-in...');
        const result = await signInWithGoogle();
        
        // Dispatch user data to Redux store
        dispatch(setUser({
          email: result.user.email,
          photoURL: result.user.photoURL
        }));
        
        console.log(' Google sign-in successful');
        toast.success(' Signed in with Google!', { id: toastId });
        navigate('/dashboard');
      } catch (error) {
        console.error('Google sign-in error:', error);
        
        // Better error handling for common Google auth errors
        const message = 
          error?.code === 'auth/popup-closed-by-user' 
            ? '❌ Sign-in was cancelled'
            : error?.code === 'auth/popup-blocked'
            ? '🚫 Popup was blocked. Please allow popups and try again.'
            : error?.code === 'auth/network-request-failed'
            ? '🌐 Network error. Please check your connection.'
            : error?.message || '❌ Google sign-in failed';
            
        toast.error(message, { id: toastId });
      } finally {
        setSigningIn(false);
      }
    } else {
      // Show message for other providers (not implemented yet)
      toast('🚧 ' + option.name + ' sign-in coming soon!', {
        icon: '⏳',
        duration: 2000
      });
    }
  };

  return (
    <div className="dropdown dropdown-hover w-full relative">
      <div
        tabIndex={0}
        role="button"
        className={`w-full bg-white text-black py-2 px-4 rounded flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-gray-200 cursor-pointer ${
          signingIn ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={(e) => signingIn && e.preventDefault()} // Prevent clicks when signing in
      >
        <div className="flex items-center gap-2">
          <selected.icon size={18} />
          <span className="font-medium">
            {signingIn && selected.name === 'Google' 
              ? 'Signing in...' 
              : `Continue with ${selected.name}`
            }
          </span>
        </div>
        <FaChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${signingIn ? 'opacity-50' : ''}`}
        />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu p-3 mt-2 shadow-xl rounded-box w-full bg-black text-white transition-all duration-200 z-50"
      >
        <div className="grid grid-cols-2 gap-2">
          {socialOptions.map((option, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-2 w-full p-2 border border-white rounded transition-all duration-300 ease-in-out hover:bg-white hover:text-black ${
                  selected.name === option.name ? 'bg-white text-black' : ''
                } ${
                  signingIn && selected.name === option.name 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                disabled={signingIn && selected.name === option.name}
              >
                <option.icon size={18} />
                <span className="text-sm">
                  {signingIn && selected.name === option.name && option.name === 'Google'
                    ? 'Signing...'
                    : option.name
                  }
                </span>
              </button>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}