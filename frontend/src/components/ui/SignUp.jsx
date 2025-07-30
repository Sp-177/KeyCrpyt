// Fixed SignUp.jsx - Removed setMethod prop, using onNavigate only and matched theme colors
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DropDown from './DropDown';
import { registerWithEmailPassword } from '../../auth/firebaseService';
import { useDispatch } from 'react-redux';
import { setUserEmail } from '../../store/authSlice';

const schema = z.object({
  email: z.string().email('📧 Invalid email format'),
  password: z.string().min(6, '🔐 Password must be at least 6 characters'),
});

export default function SignUp({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Creating your account... 🚀');

    try {
      const userCred = await registerWithEmailPassword(data.email, data.password);
      dispatch(setUserEmail(userCred.user.email));
      toast.success('🎉 Account created successfully!', { id: toastId });
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      const message =
        err?.code === 'auth/email-already-in-use'
          ? '📛 Email already registered'
          : err?.message || '❌ Registration failed. Please try again.';

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-6 p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md"
    >
      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          placeholder="you@example.com"
          className="w-full p-2 rounded border border-white/10 bg-black/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="••••••••"
            className="w-full p-2 pr-10 rounded border border-white/10 bg-black/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-white hover:text-teal-400 text-lg"
            tabIndex={-1}
          >
            <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        type="submit"
        className="w-full bg-teal-400 text-black py-2 rounded-xl font-semibold hover:bg-teal-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </motion.button>

      <div className="flex items-center justify-center text-sm text-gray-400 mt-1">or</div>

      <DropDown />
    </form>
  );
}
