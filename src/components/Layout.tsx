// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerCareButton from './CustomerCareButton';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Main content - either children or Outlet for nested routes */}
      {children || <Outlet />}
      
      {/* Customer Care Button - will appear on all pages */}
      <CustomerCareButton liveChatUrl="https://tawk.to/chat/67f9111ed014271912746be8/1ioieloaf" />
    </>
  );
};

export default Layout;