// components/navigation/AdminNavigation.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Home, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export function AdminNavigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-emerald-400" />
            <Shield className="h-8 w-8 text-emerald-400" />
            <span className="font-bold text-xl text-white">Admin Dashboard</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin" className="text-slate-300 hover:text-white transition-colors">
              <BarChart3 className="h-5 w-5" />
            </Link>
            <Link href="/admin/settings" className="text-slate-300 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          {/* Wallet */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
