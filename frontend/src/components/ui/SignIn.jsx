// Fixed SignIn.jsx - Only fixing dispatch and error handling
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DropDown from './DropDown';
import { loginWithEmailPassword } from '../../auth/firebaseService';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../store/authSlice'; // Fixed import path

export default function SignIn({ setMethod }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('🔐 Signing in...');

    try {
      const userCred = await loginWithEmailPassword(data.email, data.password);
      dispatch(setEmail(userCred.user.email)); // Fixed to dispatch user email from userCred
      toast.success('🎉 Login successful!', { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      // Added more specific error handling for newer Firebase auth errors
      const message =
        err?.code === 'auth/user-not-found'
          ? '🚫 No account found for this email'
          : err?.code === 'auth/wrong-password'
          ? '❌ Incorrect password'
          : err?.code === 'auth/invalid-credential'
          ? '❌ Invalid email or password'
          : err?.code === 'auth/too-many-requests'
          ? '⚠️ Too many failed attempts. Please try again later.'
          : err?.message || '⚠️ Login failed';

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 space-y-6 bg-black bg-opacity-60 border border-white/10 rounded-xl shadow-lg backdrop-blur-sm">
      <DropDown />
      <div className="flex items-center justify-center text-sm text-gray-400">or</div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            {...register('email', {
              required: '📩 Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: '❌ Invalid email format',
              },
            })}
            placeholder="you@example.com"
            className="w-full p-2 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: '🔒 Password is required',
                minLength: { value: 6, message: '⚠️ Minimum 6 characters' },
              })}
              placeholder="••••••••"
              className="w-full p-2 pr-10 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 text-white hover:text-blue-400 text-lg flex items-center" // Added flex items-center
              tabIndex={-1}
            >
              <i className={`fi ${showPassword ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`}></i>
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-400 hover:underline"
            onClick={() => {
              toast('🔁 Switching to password recovery', { icon: '📧' });
              setMethod('ForgotPassword');
            }}
          >
            Forgot Password?
          </button>
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </motion.button>
      </form>
    </div>
  );
}