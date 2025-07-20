// components/navigation/PlayerNavigation.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePlayerBalance } from '@/hooks/useGameContract';
import { Plane, Home } from 'lucide-react';
import Link from 'next/link';

export function PlayerNavigation() {
  const { balance, symbol } = usePlayerBalance();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-cyan-400" />
            <Plane className="h-8 w-8 text-cyan-400" />
            <span className="font-bold text-xl text-white">AdvancedAviator</span>
          </Link>

          {/* Balance & Wallet */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400 text-sm">Balance: </span>
              <span className="text-white font-semibold">
                {parseFloat(balance).toFixed(4)} {symbol}
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}