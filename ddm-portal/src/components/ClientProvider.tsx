'use client';

import React from 'react';
import { OrderProvider } from '@/context/OrderContext';

interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return <OrderProvider>{children}</OrderProvider>;
};

export default ClientProvider; 