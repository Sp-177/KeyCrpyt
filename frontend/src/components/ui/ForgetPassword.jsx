import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendResetEmail } from '../../auth/firebaseService';

export default function ForgetPassword({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Sending reset link...');
    try {
      await sendResetEmail(data.email);
      toast.success(' Reset link sent to your email', { id: toastId });
      onNavigate('signin');
    } catch (err) {
      toast.error(' Error sending reset link', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative z-10 w-full max-w-sm space-y-6 p-6 bg-gradient-to-br from-gray-950/90 to-black/90 border border-white/10 rounded-xl shadow-xl backdrop-blur-lg"
    >
      <div>
        <label className="block text-sm text-white mb-1">Email</label>
        <input
          type="email"
          autoComplete="email"
          {...register('email', {
            required: ' Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: ' Invalid email format',
            },
          })}
          placeholder="you@example.com"
          className="w-full p-3 rounded-lg border border-cyan-500 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </motion.button>

      <div className="text-sm text-center text-gray-400 mt-2">
        Remembered your password?
        <button
          type="button"
          onClick={() => onNavigate('signin')}
          className="ml-2 underline text-cyan-300 hover:text-white transition duration-300 cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
}
