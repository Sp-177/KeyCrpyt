import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            background: 'rgba(17, 24, 39, 0.9)', // Tailwind slate-900 with opacity
            color: '#fff',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
          },
          success: {
            style: {
              background: 'rgba(5, 150, 105, 0.95)', // emerald-500
              color: '#fff',
              boxShadow: '0 4px 20px rgba(5, 150, 105, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            iconTheme: {
              primary: '#10b981', // emerald-500
              secondary: '#ecfdf5', // emerald-50
            },
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.95)', // rose-500
              color: '#fff',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            iconTheme: {
              primary: '#f87171', // rose-400
              secondary: '#fef2f2', // rose-50
            },
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);
