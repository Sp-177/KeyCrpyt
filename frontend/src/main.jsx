// Fixed main.jsx - Removed BrowserRouter (it should be in App.jsx)
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
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);