// main.tsx - Updated dengan routes baru
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import QrisPage from './pages/QrisPage';
import SuccessPage from './pages/PaymentSuccessBongkar'; // Success page untuk Bongkar
import PaymentSuccessPage from './pages/PaymentSuccessPage'; // Success page untuk TopUp
import PendingPage from './pages/PendingPage';
import FailedPage from './pages/FailedPage';
import BankFormPage from './pages/BankFormPage'; // Bank form page
import BankConfirmationPage from './pages/BankConfirmationPage'; // Bank confirmation page
import BongkarPendingPage from './pages/BongkarPendingPage'; // NEW: Bongkar Pending page
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
          <Route path="/success" element={<PaymentSuccessPage />} /> {/* TopUp Success */}
          <Route path="/success-bongkar" element={<SuccessPage />} /> {/* Bongkar Success */}
          <Route path="/pending" element={<PendingPage />} /> {/* TopUp Pending */}
          <Route path="/pending-bongkar" element={<BongkarPendingPage />} /> {/* NEW: Bongkar Pending */}
          <Route path="/failed" element={<FailedPage />} />
          <Route path="/bank-form" element={<BankFormPage />} />
          <Route path="/bank-confirmation" element={<BankConfirmationPage />} />
          {/* Fallback route - redirect to home */}
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);