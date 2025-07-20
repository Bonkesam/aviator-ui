// components/game/GameControlPanels.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameContract, usePlayerBalance } from '@/hooks/useGameContract';
import { RoundState } from '@/lib/contracts/types';
import { GSAPAnimations } from '@/lib/gsap';
import { Plane, TrendingUp, DollarSign, Zap, PlayCircle, Trophy, RotateCcw, Clock, Eye } from 'lucide-react';

interface GameControlPanelsProps {
  currentView: 'betting' | 'flight' | 'results';
  gameConfig?: any;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  onPlaceBet: (amount: string) => void;
  playerRoundState?: any;
  roundInfo?: any;
  onLaunch: () => void;
  onClaim: () => void;
  isLoading: boolean;
  eventsQueue: any[];
}

export function GameControlPanels({
  currentView,
  gameConfig,
  betAmount,
  setBetAmount,
  onPlaceBet,
  playerRoundState,
  roundInfo,
  onLaunch,
  onClaim,
  isLoading,
  eventsQueue
}: GameControlPanelsProps) {
  return (
    <div className="space-y-6">
      {/* Main Game Panel */}
      {currentView === 'betting' && (
        <BettingPanel 
          gameConfig={gameConfig}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={onPlaceBet}
          isLoading={isLoading}
        />
      )}
      
      {(currentView === 'flight' || currentView === 'results') && playerRoundState && (
        <FlightControlPanel 
          playerRoundState={playerRoundState}
          roundInfo={roundInfo}
          onLaunch={onLaunch}
          onClaim={onClaim}
          isLoading={isLoading}
        />
      )}

      {/* Supporting Panels */}
      <GameStatsPanel />
      <RecentEventsPanel events={eventsQueue.slice(-5)} />
    </div>
  );
}

// Betting Panel Component
interface BettingPanelProps {
  gameConfig?: any;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  onPlaceBet: (amount: string) => void;
  isLoading: boolean;
}

export function BettingPanel({ 
  gameConfig, 
  betAmount, 
  setBetAmount, 
  onPlaceBet, 
  isLoading 
}: BettingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { balance, symbol } = usePlayerBalance();

  useEffect(() => {
    if (panelRef.current) {
      GSAPAnimations.fadeInUp(panelRef.current);
    }
  }, []);

  const handleBetAmountChange = (value: string) => {
    setBetAmount(value);
  };

  const handlePlaceBet = async () => {
    if (buttonRef.current) {
      GSAPAnimations.buttonPress(buttonRef.current);
    }
    await onPlaceBet(betAmount);
  };

  const minBet = gameConfig?.minBet ? Number(gameConfig.minBet) / 1e18 : 0.01;
  const maxBet = gameConfig?.maxBet ? Number(gameConfig.maxBet) / 1e18 : 10;

  const quickBetAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  return (
    <div ref={panelRef} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Plane className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Place Your Bet</h2>
          <p className="text-slate-400 text-sm">Ready for takeoff?</p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Your Balance</span>
          <span className="text-white font-bold text-lg">
            {parseFloat(balance).toFixed(4)} {symbol}
          </span>
        </div>
      </div>

      {/* Bet Amount Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Bet Amount ({symbol})
          </label>
          <div className="relative">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => handleBetAmountChange(e.target.value)}
              min={minBet}
              max={maxBet}
              step="0.001"
              className="
                w-full px-4 py-3 bg-slate-900 border border-slate-600
                rounded-xl text-white text-lg font-semibold
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                transition-all duration-200
              "
              placeholder="0.01"
            />
            <DollarSign className="absolute right-3 top-3 h-6 w-6 text-slate-400" />
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {quickBetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleBetAmountChange(amount)}
              className={`
                py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200
                hover:scale-105 ${
                  betAmount === amount
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white'
                }
              `}
            >
              {amount}
            </button>
          ))}
        </div>

        {/* Bet Limits & Info */}
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Min Bet:</span>
            <span>{minBet} {symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Max Bet:</span>
            <span>{maxBet} {symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Payout:</span>
            <span className="text-green-400">2:1 on successful landing</span>
          </div>
        </div>
      </div>

      {/* Place Bet Button */}
      <button
        ref={buttonRef}
        onClick={handlePlaceBet}
        disabled={isLoading || !betAmount || parseFloat(betAmount) < minBet}
        className="
          w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600
          hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-600
          text-white font-bold rounded-xl text-lg
          disabled:cursor-not-allowed transition-all duration-300
          transform hover:scale-105 hover:shadow-xl
          flex items-center justify-center space-x-2
        "
        data-launch-button
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Creating Flight...</span>
          </div>
        ) : (
          <>
            <TrendingUp className="h-5 w-5" />
            <span>Take Flight!</span>
          </>
        )}
      </button>

      {/* Game Rules */}
      <div className="mt-6 p-4 bg-slate-900/50 rounded-xl">
        <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span>How to Play</span>
        </h3>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>• Place your bet and wait for flight generation</li>
          <li>• Launch when ready and watch your plane fly</li>
          <li>• Hit multipliers to increase speed</li>
          <li>• Land safely in the target zone to win!</li>
        </ul>
      </div>
    </div>
  );
}

// Flight Control Panel Component
interface FlightControlPanelProps {
  playerRoundState: any;
  roundInfo?: any;
  onLaunch: () => void;
  onClaim: () => void;
  isLoading: boolean;
}

export function FlightControlPanel({ 
  playerRoundState, 
  roundInfo, 
  onLaunch, 
  onClaim, 
  isLoading 
}: FlightControlPanelProps) {
  const { formatEther } = useGameContract();

  const isReadyToLaunch = playerRoundState.state === RoundState.READY_TO_LAUNCH;
  const isFlying = playerRoundState.state === RoundState.FLYING;
  const isFinished = playerRoundState.state === RoundState.LANDED_SAFE || 
                    playerRoundState.state === RoundState.CRASHED;
  const isWin = playerRoundState.state === RoundState.LANDED_SAFE;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      {/* Round Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Flight #{playerRoundState.roundId.toString()}
        </h3>
        <div className="text-slate-400">
          Bet: {formatEther(playerRoundState.betAmount)} ETH
        </div>
      </div>

      {/* Flight Status */}
      <div className="mb-6">
        <FlightStatusIndicator state={playerRoundState.state} />
      </div>

      {/* State-specific Controls */}
      <div className="space-y-4">
        {playerRoundState.state === RoundState.WAITING_FOR_VRF && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300 font-medium">Generating Flight Parameters...</p>
            <p className="text-sm text-slate-500 mt-2">Using Chainlink VRF for true randomness</p>
          </div>
        )}

        {isReadyToLaunch && (
          <button
            onClick={onLaunch}
            disabled={isLoading}
            className="
              w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700 disabled:opacity-50
              text-white font-bold rounded-xl text-lg
              transition-all duration-300 transform hover:scale-105
              flex items-center justify-center space-x-2
            "
          >
            <PlayCircle className="h-6 w-6" />
            <span>Launch Plane!</span>
          </button>
        )}

        {isFlying && (
          <div className="text-center py-4">
            <div className="text-cyan-400 font-bold text-lg mb-2 flex items-center justify-center space-x-2">
              <span>✈️</span>
              <span>In Flight</span>
            </div>
            <p className="text-slate-300">Your plane is flying...</p>
            {roundInfo && (
              <div className="mt-4 text-sm text-slate-400">
                <div>Speed: {roundInfo.currentSpeed || 200} km/h</div>
                <div>Multipliers Hit: {roundInfo.multipliers?.filter((m: any) => m.hitByPlane).length || 0}</div>
              </div>
            )}
          </div>
        )}

        {isFinished && (
          <div className="space-y-4">
            {/* Result Display */}
            <div className={`text-center py-6 rounded-xl border ${
              isWin 
                ? 'bg-green-500/20 border-green-500/50' 
                : 'bg-red-500/20 border-red-500/50'
            }`}>
              <div className={`text-4xl mb-2`}>
                {isWin ? '🎉' : '💥'}
              </div>
              <div className={`font-bold text-xl mb-2 ${
                isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {isWin ? 'Successful Landing!' : 'Flight Crashed!'}
              </div>
              {isWin && (
                <div className="text-slate-300">
                  You won {formatEther(playerRoundState.betAmount * BigInt(2))} ETH!
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={onClaim}
              disabled={isLoading}
              className="
                w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600
                hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50
                text-white font-bold rounded-xl text-lg
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center space-x-2
              "
              data-win-element={isWin}
            >
              {isWin ? <Trophy className="h-6 w-6" /> : <RotateCcw className="h-6 w-6" />}
              <span>{isWin ? 'Claim Winnings' : 'Start New Flight'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Flight Details */}
      {roundInfo && (
        <div className="mt-6 p-4 bg-slate-900/50 rounded-xl">
          <h4 className="text-white font-semibold mb-3">Flight Details</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">Current Speed:</span>
              <span className="text-white ml-2">{roundInfo.currentSpeed || 200} km/h</span>
            </div>
            <div>
              <span className="text-slate-400">Distance:</span>
              <span className="text-white ml-2">{roundInfo.currentPosition || 0}m</span>
            </div>
            {roundInfo.multipliers && (
              <>
                <div>
                  <span className="text-slate-400">Multipliers:</span>
                  <span className="text-white ml-2">{roundInfo.multipliers.length}</span>
                </div>
                <div>
                  <span className="text-slate-400">Hit:</span>
                  <span className="text-white ml-2">
                    {roundInfo.multipliers.filter((m: any) => m.hitByPlane).length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Flight Status Indicator Component
function FlightStatusIndicator({ state }: { state: RoundState }) {
  const getStatusInfo = (state: RoundState) => {
    switch (state) {
      case RoundState.WAITING_FOR_VRF:
        return { text: 'Preparing Flight', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
      case RoundState.READY_TO_LAUNCH:
        return { text: 'Ready for Takeoff', color: 'text-green-400', bg: 'bg-green-400/20' };
      case RoundState.FLYING:
        return { text: 'In Flight', color: 'text-blue-400', bg: 'bg-blue-400/20' };
      case RoundState.LANDED_SAFE:
        return { text: 'Landed Successfully', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
      case RoundState.CRASHED:
        return { text: 'Flight Crashed', color: 'text-red-400', bg: 'bg-red-400/20' };
      default:
        return { text: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-400/20' };
    }
  };

  const statusInfo = getStatusInfo(state);

  return (
    <div className={`${statusInfo.bg} rounded-lg p-3 text-center`}>
      <div className={`${statusInfo.color} font-semibold`}>
        {statusInfo.text}
      </div>
    </div>
  );
}

// Game Stats Panel Component
export function GameStatsPanel() {
  const [stats, setStats] = useState({
    totalFlights: 47,
    winRate: 15.3,
    totalWagered: '4.2',
    totalWon: '1.8',
    bestMultiplier: 2.8,
    longestStreak: 3
  });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-400">Total Flights</div>
          <div className="text-white font-bold">{stats.totalFlights}</div>
        </div>
        <div>
          <div className="text-slate-400">Win Rate</div>
          <div className="text-white font-bold">{stats.winRate}%</div>
        </div>
        <div>
          <div className="text-slate-400">Wagered</div>
          <div className="text-white font-bold">{stats.totalWagered} ETH</div>
        </div>
        <div>
          <div className="text-slate-400">Won</div>
          <div className="text-white font-bold">{stats.totalWon} ETH</div>
        </div>
        <div>
          <div className="text-slate-400">Best Multi</div>
          <div className="text-white font-bold">{stats.bestMultiplier}x</div>
        </div>
        <div>
          <div className="text-slate-400">Best Streak</div>
          <div className="text-white font-bold">{stats.longestStreak}</div>
        </div>
      </div>
    </div>
  );
}

// Recent Events Panel Component
interface RecentEventsPanelProps {
  events: any[];
}

export function RecentEventsPanel({ events }: RecentEventsPanelProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'round_created': return '🆕';
      case 'round_ready': return '✅';
      case 'round_launched': return '🚀';
      case 'multiplier_hit': return '⚡';
      case 'round_ended': return '🏁';
      default: return '📋';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
      
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            No recent activity
          </p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="flex items-start space-x-3 text-sm">
              <div className="text-lg">{getEventIcon(event.type)}</div>
              <div className="flex-1">
                <div className="text-white font-medium capitalize">
                  {event.type.replace('_', ' ')}
                </div>
                <div className="text-slate-400 text-xs">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}