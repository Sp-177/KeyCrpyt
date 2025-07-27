// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loading from './components/ui/Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './auth/firebaseConfig';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser,clearUser } from './store/authSlice';

// Lazy-loaded pages
const AboutUS = lazy(() => import('./pages/AboutUS'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<AboutUS />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
