// hooks/useGameContract.ts - Adding missing exports
import { useReadContract, useWriteContract, useAccount, useWatchContractEvent, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { AVIATOR_ABI } from '@/lib/contracts/abis';
import { PlayerRoundState, GameConfig } from '@/lib/contracts/types';
import { toast } from 'sonner';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export function useGameContract() {
  const { address } = useAccount();
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  // Read player's current round state
  const { data: playerRoundState, refetch: refetchPlayerState } = useReadContract({
    abi: AVIATOR_ABI,
    address: CONTRACT_ADDRESSES.AVIATOR,
    functionName: 'getPlayerRoundState',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 2000,
    }
  }) as { data: PlayerRoundState | undefined, refetch: () => void };

  // Read game configuration
  const { data: gameConfig } = useReadContract({
    abi: AVIATOR_ABI,
    address: CONTRACT_ADDRESSES.AVIATOR,
    functionName: 'gameConfig',
  }) as { data: GameConfig | undefined };

  // Place bet and create round
  const placeBet = async (betAmount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      await writeContract({
        abi: AVIATOR_ABI,
        address: CONTRACT_ADDRESSES.AVIATOR,
        functionName: 'placeBetAndCreateRound',
        value: parseEther(betAmount),
      });
      
      toast.success('Bet placed! Waiting for VRF...');
    } catch (error) {
      toast.error('Failed to place bet');
      console.error('Bet error:', error);
    }
  };

  // Launch plane
  const launchPlane = async (roundId: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      await writeContract({
        abi: AVIATOR_ABI,
        address: CONTRACT_ADDRESSES.AVIATOR,
        functionName: 'launchPlane',
        args: [roundId],
      });
      
      toast.success('Plane launched! 🛫');
    } catch (error) {
      toast.error('Failed to launch plane');
      console.error('Launch error:', error);
    }
  };

  // Claim payout
  const claimPayout = async (roundId: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      await writeContract({
        abi: AVIATOR_ABI,
        address: CONTRACT_ADDRESSES.AVIATOR,
        functionName: 'claimPayout',
        args: [roundId],
      });
      
      toast.success('Payout claimed!');
    } catch (error) {
      toast.error('Failed to claim payout');
      console.error('Claim error:', error);
    }
  };

  return {
    // State
    playerRoundState,
    gameConfig,
    isLoading: isWritePending,
    error: writeError,
    
    // Actions
    placeBet,
    launchPlane,
    claimPayout,
    refetchPlayerState,
    
    // Utilities
    formatEther: (value: bigint) => formatEther(value),
    parseEther,
  };
}

export function useRoundInfo(roundId: bigint | undefined) {
  const { data: roundInfo, refetch } = useReadContract({
    abi: AVIATOR_ABI,
    address: CONTRACT_ADDRESSES.AVIATOR,
    functionName: 'getVisibleRoundInfo',
    args: roundId ? [roundId] : undefined,
    query: {
      enabled: !!roundId && roundId > 0n,
      refetchInterval: 1000,
    }
  });

  return {
    roundInfo,
    refetch,
  };
}

export function usePlayerBalance() {
  const { address } = useAccount();
  
  const { data: balance, refetch } = useBalance({
    address,
    query: {
      refetchInterval: 10000,
    }
  });

  return {
    balance: balance ? formatEther(balance.value) : '0',
    symbol: balance?.symbol || 'ETH',
    refetch,
  };
}