import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { registerWithEmailPassword } from '../../auth/firebaseService';
import DropDown from './DropDown';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Registering... ⏳');

    try {
      await registerWithEmailPassword(data.email, data.password);
      toast.success('🎉 Account created!', { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || '❌ Something went wrong', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-6 p-6 bg-black bg-opacity-60 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          {...register('name')}
          placeholder="John Doe"
          className="w-full p-2 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          placeholder="you@example.com"
          className="w-full p-2 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="••••••••"
            className="w-full p-2 pr-10 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-white hover:text-blue-400 text-lg"
            tabIndex={-1}
          >
            <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'}`}></i>
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        type="submit"
        className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </motion.button>

      {/* OR separator */}
      <div className="flex items-center justify-center text-sm text-gray-400 mt-1">or</div>

      {/* Social Login */}
      <DropDown />
    </form>
  );
}
