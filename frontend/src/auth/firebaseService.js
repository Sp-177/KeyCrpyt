// src/auth/firebaseService.js
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,

} from 'firebase/auth';



const logout = async () => {
  try {
    await signOut(auth);
    console.log('✅ Signed out successfully');
  } catch (error) {
    console.error('❌ Error signing out:', error);
  }
};
/**
 * Register user with email & password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
const registerWithEmailPassword = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Login user with email & password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
const loginWithEmailPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google using popup
 * @returns {Promise<UserCredential>}
 */
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

/** * Send password reset email
 * @param {string} email
 * @returns {Promise<void>}
  */
const sendResetEmail = async (email) => {
  return await sendPasswordResetEmail(auth, email);
}

// ✅ Export all functions
export {
  registerWithEmailPassword,
  loginWithEmailPassword,
  signInWithGoogle,
  sendResetEmail,
  logout,
};
