import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Info
} from 'lucide-react';

// Custom Icon Component
const CustomIcon = ({ type }) => {
  const baseClass = 'w-5 h-5';
  switch (type) {
    case 'success':
      return <CheckCircle className={`${baseClass} text-emerald-400`} />;
    case 'error':
      return <XCircle className={`${baseClass} text-rose-400`} />;
    case 'loading':
      return <Loader2 className={`${baseClass} text-sky-400 animate-spin`} />;
    default:
      return <Info className={`${baseClass} text-cyan-400`} />;
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        containerStyle={{
          top: '1.2rem',
          right: '1.2rem',
        }}
        toastOptions={{
          duration: 4000,
          className: '',
          style: {
            padding: '14px 18px',
            borderRadius: '16px',
            background: 'rgba(17, 24, 39, 0.8)', // slate-900/80
            color: '#ffffff',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            fontSize: '15px',
            fontWeight: 500,
            transition: 'all 0.4s ease-in-out',
          },
          // Default icon
          icon: <CustomIcon type="default" />,
          success: {
            icon: <CustomIcon type="success" />,
            style: {
              background: 'rgba(34, 197, 94, 0.9)', // emerald
              color: '#ecfdf5',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
          error: {
            icon: <CustomIcon type="error" />,
            style: {
              background: 'rgba(239, 68, 68, 0.92)', // rose
              color: '#fee2e2',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
          loading: {
            icon: <CustomIcon type="loading" />,
            style: {
              background: 'rgba(59, 130, 246, 0.92)', // blue
              color: '#e0f2fe',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);
