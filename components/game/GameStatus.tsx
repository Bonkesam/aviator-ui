// components/game/GameStatus.tsx - Fixed BigInt compatibility
'use client';

import { usePlayerBalance } from '@/hooks/useGameContract';
import { PlayerRoundState, GameConfig } from '@/lib/contracts/types';
import { Plane, Clock, DollarSign, Zap } from 'lucide-react';

interface GameStatusProps {
  playerRoundState?: PlayerRoundState;
  gameConfig?: GameConfig;
}

export function GameStatus({ playerRoundState, gameConfig }: GameStatusProps) {
  const { balance, symbol } = usePlayerBalance();

  const getStatusColor = () => {
    if (!playerRoundState || playerRoundState.roundId === BigInt(0)) return 'text-slate-400';
    
    switch (playerRoundState.state) {
      case 0: return 'text-yellow-400'; // WAITING_FOR_VRF
      case 1: return 'text-green-400';  // READY_TO_LAUNCH
      case 2: return 'text-blue-400';   // FLYING
      case 3: return 'text-emerald-400'; // LANDED_SAFE
      case 4: return 'text-red-400';    // CRASHED
      default: return 'text-slate-400';
    }
  };

  const getStatusText = () => {
    if (!playerRoundState || playerRoundState.roundId === BigInt(0)) return 'Ready to Bet';
    
    switch (playerRoundState.state) {
      case 0: return 'Generating Flight...';
      case 1: return 'Ready to Launch!';
      case 2: return 'In Flight';
      case 3: return 'Successful Landing!';
      case 4: return 'Flight Crashed';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Flight Status */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <Plane className={`h-5 w-5 ${getStatusColor()}`} />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Status</div>
              <div className={`text-sm font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Balance</div>
              <div className="text-sm font-semibold text-white">
                {parseFloat(balance).toFixed(4)} {symbol}
              </div>
            </div>
          </div>

          {/* Current Round */}
          {playerRoundState && playerRoundState.roundId > BigInt(0) && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700 rounded-lg">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Round</div>
                <div className="text-sm font-semibold text-white">
                  #{playerRoundState.roundId.toString()}
                </div>
              </div>
            </div>
          )}

          {/* Game Stats */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Win Rate</div>
              <div className="text-sm font-semibold text-white">
                {gameConfig ? (Number(gameConfig.targetWinRate) / 100).toFixed(1) : '15.0'}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}