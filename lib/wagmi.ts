// lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AdvancedAviator',
  projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com
  chains: [sepolia],
  ssr: true,
});