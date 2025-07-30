// Fixed SignIn.jsx - Removed setMethod prop, using onNavigate only and matched theme colors
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DropDown from './DropDown';
import { loginWithEmailPassword } from '../../auth/firebaseService';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../store/authSlice';

export default function SignIn({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      dispatch(setEmail(userCred.user.email));
      toast.success('🎉 Login successful!', { id: toastId });
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
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
    <div className="w-full max-w-sm p-6 space-y-6 bg-gradient-to-br from-gray-900/80 to-gray-800/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
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
            className="w-full p-2 rounded border border-white/10 bg-black/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
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
              className="w-full p-2 pr-10 rounded border border-white/10 bg-black/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 text-white hover:text-teal-400 text-lg flex items-center"
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
            className="text-sm text-teal-400 hover:underline hover:text-white"
            onClick={() => {
              toast('🔁 Switching to password recovery', { icon: '📧' });
              if (onNavigate) onNavigate('forgotpassword');
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
          className="w-full bg-teal-400 text-black py-2 rounded-xl font-semibold hover:bg-teal-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </motion.button>
      </form>
    </div>
  );
}