import React, { useEffect } from 'react';
import { auth } from '../auth/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || !user.email) {
      navigate('/landing');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user || !user.email) return null;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-700">You are logged in as {user.email}</p>
        <button
          onClick={() => {
            auth.signOut().then(() => {
              navigate('/landing');
            });
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800 transition">
          Sign Out
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
