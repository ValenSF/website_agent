import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // Changed from .jsx to .tsx
import QrisPage from './pages/QrisPage'; // Changed from .js to .tsx
import SuccessPage from './pages/PaymentSuccessPage'; // Changed from .js to .tsx
import '@mantine/core/styles.css';

// Fix untuk null check
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/qris" element={<QrisPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);