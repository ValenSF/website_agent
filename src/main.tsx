import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import QrisPage from './pages/QrisPage.js';
import SuccessPage from './pages/PaymentSuccessPage.js'; // Tambah import SuccessPage
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/qris" element={<QrisPage />} />
          <Route path="/success" element={<SuccessPage />} /> {/* Tambah route success */}
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);