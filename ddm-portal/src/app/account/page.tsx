'use client';

import React from 'react';
import Layout from '@/components/Layout';
import AccountSettings from '@/components/AccountSettings';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto my-8 px-4">
          <AccountSettings />
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 