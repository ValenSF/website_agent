// src/main.jsx (or index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import QrisPage from './pages/QrisPage.js';
import '@mantine/core/styles.css'; // Import Mantine styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/qris" element={<QrisPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);