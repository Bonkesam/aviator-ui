// app/admin/layout.tsx
'use client';

import { useAccount } from 'wagmi';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import { AdminNavigation } from '@/components/navigation/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminNavigation />
      <main className="pt-16">
        {children}
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}