// app/player/layout.tsx
'use client';

import { useAccount } from 'wagmi';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import { PlayerNavigation } from '@/components/navigation/PlayerNavigation';

export default function PlayerLayout({
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
      <PlayerNavigation />
      <main className="pt-16">
        {children}
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}