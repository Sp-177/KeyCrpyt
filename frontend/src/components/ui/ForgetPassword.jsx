import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendResetEmail } from '../../auth/firebaseService';

export default function ForgetPassword({ setMethod }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Sending reset link...');
    try {
      // Replace this with your actual Firebase call:
      await new Promise((res) => setTimeout(res, 1500));
      await sendResetEmail(data.email);
      toast.success('✅ Reset link sent to your email', { id: toastId });
      setMethod('SignIn');
    } catch (err) {
      toast.error('❌ Error sending reset link', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6 p-6 bg-black bg-opacity-60 border border-white/10 rounded-xl shadow-lg backdrop-blur-sm">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email format',
            },
          })}
          placeholder="you@example.com"
          className="w-full p-2 rounded border border-white bg-black text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        type="submit"
        className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </motion.button>

      <div className="text-sm text-center text-gray-400 mt-2">
        Remembered your password?
        <button onClick={() => setMethod('SignIn')} className="ml-2 underline text-white hover:text-gray-300 transition duration-300 cursor-pointer">
          Back to Sign In
        </button>
      </div>
    </form>
  );
}
