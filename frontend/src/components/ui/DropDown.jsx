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

  const handleSelect = async (option) => {
    setSelected(option);

    if (option.name === 'Google') {
      if (signingIn) return; // prevent double click
      setSigningIn(true);
      const toastId = toast.loading('Signing in with Google...');

      try {
        console.log('🔐 Initiating Google sign-in...');
        await signInWithGoogle();
        console.log('✅ Google sign-in successful');
        toast.success('Signed in!', { id: toastId });
        navigate('/dashboard');
      } catch (error) {
        console.error('Google sign-in error:', error);
        toast.error(error.message || 'Google sign-in failed', { id: toastId });
      } finally {
        setSigningIn(false);
      }
    }

    // You can extend this block for other providers later
  };

  return (
    <div className="dropdown dropdown-hover w-full">
      <div
        tabIndex={0}
        role="button"
        className="w-full bg-white text-black py-2 px-4 rounded flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-gray-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <selected.icon size={18} />
          <span className="font-medium">Continue with {selected.name}</span>
        </div>
        <FaChevronDown size={16} />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu p-3 mt-2 shadow-xl rounded-box w-full bg-black text-white transition-all duration-200"
      >
        <div className="grid grid-cols-2 gap-2">
          {socialOptions.map((option, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-2 w-full p-2 border border-white rounded transition-all duration-300 ease-in-out hover:bg-white hover:text-black ${
                  selected.name === option.name ? 'bg-white text-black' : ''
                }`}
                disabled={signingIn && selected.name === option.name}
              >
                <option.icon size={18} />
                <span className="text-sm">{option.name}</span>
              </button>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
