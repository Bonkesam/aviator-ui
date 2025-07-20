// hooks/useRealTimeEvents.ts - Simplified version
'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import {AVIATOR_ABI } from '@/lib/contracts/abis';
import { toast } from 'sonner';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export interface GameEvent {
  id: string;
  type: 'round_created' | 'round_ready' | 'round_launched' | 'multiplier_hit' | 'round_ended' | 'payout_processed';
  timestamp: number;
  data: any;
  processed: boolean;
}

export function useRealTimeEvents() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const eventsQueue = useRef<GameEvent[]>([]);

  const addEvent = useCallback((event: GameEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 19)]); // Keep last 20 events
    eventsQueue.current = [event, ...eventsQueue.current.slice(0, 19)];
  }, []);

  // Contract Event Listeners
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundCreated',
    onLogs(logs) {
      logs.forEach(log => {
        addEvent({
          id: `round_created_${log.args.roundId}_${Date.now()}`,
          type: 'round_created',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        toast.success(`Round ${log.args.roundId} created!`);
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundReadyToLaunch',
    onLogs(logs) {
      logs.forEach(log => {
        addEvent({
          id: `round_ready_${log.args.roundId}_${Date.now()}`,
          type: 'round_ready',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        toast.success(`Round ${log.args.roundId} ready to launch! 🚀`);
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundLaunched',
    onLogs(logs) {
      logs.forEach(log => {
        addEvent({
          id: `round_launched_${log.args.roundId}_${Date.now()}`,
          type: 'round_launched',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        toast.info(`Plane launched for round ${log.args.roundId}! ✈️`);
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'MultiplierHit',
    onLogs(logs) {
      logs.forEach(log => {
        const multiplier = Number(log.args.value) / 10000;
        addEvent({
          id: `multiplier_hit_${log.args.roundId}_${log.args.position}_${Date.now()}`,
          type: 'multiplier_hit',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        toast.success(`Multiplier hit: ${multiplier.toFixed(1)}x! ⚡`);
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'RoundEnded',
    onLogs(logs) {
      logs.forEach(log => {
        const isWin = log.args.state === 3; // LANDED_SAFE
        addEvent({
          id: `round_ended_${log.args.roundId}_${Date.now()}`,
          type: 'round_ended',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        toast[isWin ? 'success' : 'error'](
          isWin ? 'Successful landing! 🎉' : 'Plane crashed! 💥'
        );
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.AVIATOR,
    abi: AVIATOR_ABI,
    eventName: 'PayoutProcessed',
    onLogs(logs) {
      logs.forEach(log => {
        addEvent({
          id: `payout_processed_${log.args.roundId}_${Date.now()}`,
          type: 'payout_processed',
          timestamp: Date.now(),
          data: log.args,
          processed: false
        });
        
        if (Number(log.args.amount) > 0) {
          toast.success('Payout received! 💰');
        }
      });
    },
  });

  return {
    events,
    eventsQueue: eventsQueue.current,
    addEvent
  };
}