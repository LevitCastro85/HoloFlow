import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// 👇 Importa el AuthProvider
import { AuthProvider } from '@/contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 Rodea la app con el contexto */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
