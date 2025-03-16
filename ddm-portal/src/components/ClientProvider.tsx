'use client';

import React from 'react';
import { OrderProvider } from '@/context/OrderContext';
import { AuthProvider } from '@/context/AuthContext';

interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthProvider>
  );
};

export default ClientProvider; 