// hooks/useGameEvents.ts
import { AVIATOR_ABI } from "@/lib/contracts/abis";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses";
import { useState } from "react";
import { toast } from "sonner";
import { formatEther } from "viem";
import { useWatchContractEvent, useAccount, useBalance } from "wagmi";

export function useGameEvents() {
  const [events, setEvents] = useState<any[]>([]);

  // Listen to RoundCreated events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundCreated',
    onLogs(logs) {
      logs.forEach(log => {
        toast.success(`Round ${log.args.roundId} created!`);
        setEvents(prev => [...prev, { type: 'RoundCreated', ...log.args }]);
      });
    },
  });

  // Listen to RoundReadyToLaunch events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundReadyToLaunch',
    onLogs(logs) {
      logs.forEach(log => {
        toast.success(`Round ${log.args.roundId} ready to launch! 🚀`);
        setEvents(prev => [...prev, { type: 'RoundReadyToLaunch', ...log.args }]);
      });
    },
  });

  // Listen to RoundLaunched events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundLaunched',
    onLogs(logs) {
      logs.forEach(log => {
        toast.info(`Plane launched for round ${log.args.roundId}! ✈️`);
        setEvents(prev => [...prev, { type: 'RoundLaunched', ...log.args }]);
      });
    },
  });

  // Listen to MultiplierHit events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'MultiplierHit',
    onLogs(logs) {
      logs.forEach(log => {
        const multiplier = Number(log.args.value) / 10000;
        toast.success(`Multiplier hit: ${multiplier}x! ⚡`);
        setEvents(prev => [...prev, { type: 'MultiplierHit', ...log.args }]);
      });
    },
  });

  // Listen to RoundEnded events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundEnded',
    onLogs(logs) {
      logs.forEach(log => {
        const isWin = log.args.state === 3; // LANDED_SAFE
        toast[isWin ? 'success' : 'error'](
          isWin ? 'Successful landing! 🎉' : 'Plane crashed! 💥'
        );
        setEvents(prev => [...prev, { type: 'RoundEnded', ...log.args }]);
      });
    },
  });

  return { events };
}
// hooks/useBalance.ts

export function usePlayerBalance() {
  const { address } = useAccount();
  
  const { data: balance, refetch } = useBalance({
    address,
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  });

  return {
    balance: balance ? formatEther(balance.value) : '0',
    symbol: balance?.symbol || 'ETH',
    refetch,
  };
}