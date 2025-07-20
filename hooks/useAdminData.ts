// hooks/useAdminData.ts
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { AVIATOR_ABI } from '@/lib/contracts/abis';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export function useAdminData() {
  const [gameStats, setGameStats] = useState({
    totalRounds: 0,
    activeRounds: 0,
    totalVolume: '0',
    totalPlayers: 0,
    winRate: 0,
    houseProfit: '0'
  });

  const [activeRounds, setActiveRounds] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ status: 'healthy' });
  const [isLoading, setIsLoading] = useState(true);

  // Read contract data
  const { data: contractBalance } = useReadContract({
    abi: AVIATOR_ABI,
    address: CONTRACT_ADDRESSES.AVIATOR,
    functionName: 'totalHouseProfit',
  });

  const { data: gameConfig } = useReadContract({
    abi: AVIATOR_ABI,
    address: CONTRACT_ADDRESSES.AVIATOR,
    functionName: 'gameConfig',
  });

  useEffect(() => {
    // Simulate loading admin data
    const loadAdminData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGameStats({
        totalRounds: 1247,
        activeRounds: 8,
        totalVolume: '156.7',
        totalPlayers: 89,
        winRate: 15.3,
        houseProfit: '12.4'
      });

      setActiveRounds([
        { id: 1001, player: '0x742d...35B1', amount: '0.1', status: 'flying', progress: 65 },
        { id: 1002, player: '0x8A3f...92C4', amount: '0.05', status: 'ready', progress: 0 },
        { id: 1003, player: '0x1B5e...78D9', amount: '0.2', status: 'waiting_vrf', progress: 0 },
      ] as any);

      setPlayerStats([
        { address: '0x742d...35B1', rounds: 23, volume: '2.1', winRate: 21.7, profit: '0.3' },
        { address: '0x8A3f...92C4', rounds: 45, volume: '4.8', winRate: 13.3, profit: '-0.2' },
        { address: '0x1B5e...78D9', rounds: 12, volume: '1.2', winRate: 16.7, profit: '0.1' },
      ] as any);

      setSystemHealth({
        status: 'healthy',
        vrfStatus: 'operational',
        contractStatus: 'operational',
        networkStatus: 'stable'
      } as any);

      setIsLoading(false);
    };

    loadAdminData();
    
    // Set up real-time updates
    const interval = setInterval(loadAdminData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    gameStats,
    activeRounds,
    playerStats,
    systemHealth,
    isLoading
  };
}