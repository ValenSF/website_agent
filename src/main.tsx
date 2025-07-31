
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import App from './App';
import QrisPage from './pages/QrisPage';
import SuccessPage from './pages/PaymentSuccessBongkar'; 
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PendingPage from './pages/PendingPage';
import FailedPage from './pages/FailedPage';
import BankFormPage from './pages/BankFormPage'; 
import BankConfirmationPage from './pages/BankConfirmationPage';
import BongkarPendingPage from './pages/BongkarPendingPage';
import '@mantine/core/styles.css';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          {/* ✅ Wrap all routes with Layout component */}
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="qris" element={<QrisPage />} />
            <Route path="success" element={<PaymentSuccessPage />} /> {/* TopUp Success */}
            <Route path="success-bongkar" element={<SuccessPage />} /> {/* Bongkar Success */}
            <Route path="pending" element={<PendingPage />} /> {/* TopUp Pending */}
            <Route path="pending-bongkar" element={<BongkarPendingPage />} /> {/* Bongkar Pending */}
            <Route path="failed" element={<FailedPage />} />
            <Route path="bank-form" element={<BankFormPage />} />
            <Route path="bank-confirmation" element={<BankConfirmationPage />} />
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
);