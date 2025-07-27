import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadProfilePicture } from '../../utils/uploadProfilePicture';
import { setUser } from '../../store/authSlice';

const UploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    if (!file) {
      toast.error("📷 Please select a photo to upload!");
      return;
    }

    const toastId = toast.loading("Uploading profile picture...");
    setLoading(true);

    try {
      const profileURL = await uploadProfilePicture(file);

      if (!profileURL) throw new Error("No URL returned from Firebase.");

      dispatch(setUser({ photoURL: profileURL }));
      toast.success("✅ Profile picture updated!", { id: toastId });

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("❌ Upload failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 w-[90%] max-w-md shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 text-gray-700 hover:text-black hover:bg-white/50 transition"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6 drop-shadow-md">
            Upload Profile Picture
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-sm text-gray-700 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full mt-6 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;