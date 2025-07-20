// app/player/page.tsx - Fixed BigInt compatibility
'use client';

import { useState, useEffect } from 'react';
import { useGameContract, useRoundInfo } from '@/hooks/useGameContract';
import { useRealTimeEvents } from '@/hooks/useRealTimeEvents';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { usePageTransition } from '@/lib/gsap';
import { RoundState } from '@/lib/contracts/types';

// Import components
import { FlightVisualization } from '@/components/game/FlightVisualization';
import { GameStatus } from '@/components/game/GameStatus';
import { SoundControls } from '@/components/game/SoundControls';
import { PerformanceMonitor } from '@/components/game/PerformanceMonitor';
import { TouchControls } from '@/components/game/TouchControls';
import { MobileControls } from '@/components/game/MobileControls';
import { GameControlPanels } from '@/components/game/GameControlPanels';
import { LoadingOptimizer } from '@/components/game/LoadingOptimizer';

export default function PlayerPage() {
  const { containerRef } = usePageTransition();
  const { isMobile, orientation } = useMobileOptimization();
  const { 
    playerRoundState, 
    gameConfig, 
    placeBet, 
    launchPlane, 
    claimPayout, 
    isLoading,
    formatEther 
  } = useGameContract() as {
    playerRoundState: {
      roundId: bigint;
      state: RoundState;
      betAmount: bigint;
      // Add other properties as needed based on your actual playerRoundState shape
    } | undefined;
    gameConfig: any;
    placeBet: (amount: string) => Promise<void>;
    launchPlane: (roundId: bigint) => Promise<void>;
    claimPayout: (roundId: bigint) => Promise<void>;
    isLoading: boolean;
    formatEther: (value: bigint) => string;
  };
  
  const { roundInfo } = useRoundInfo(playerRoundState?.roundId);
  const { eventsQueue } = useRealTimeEvents();
  const { playEngineSound, startAmbientSounds } = useGameAudio();
  const { trackGameEvent, trackUserAction } = useAnalytics();

  const [currentView, setCurrentView] = useState<'betting' | 'flight' | 'results'>('betting');
  const [betAmount, setBetAmount] = useState('0.1');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Update view based on round state
  useEffect(() => {
    if (!playerRoundState || playerRoundState.roundId === BigInt(0)) {
      setCurrentView('betting');
    } else {
      switch (playerRoundState.state) {
        case RoundState.WAITING_FOR_VRF:
        case RoundState.READY_TO_LAUNCH:
        case RoundState.FLYING:
          setCurrentView('flight');
          break;
        case RoundState.LANDED_SAFE:
        case RoundState.CRASHED:
          setCurrentView('results');
          break;
        default:
          setCurrentView('betting');
      }
    }
  }, [playerRoundState]);

  useEffect(() => {
    startAmbientSounds();
  }, [startAmbientSounds]);

  // Handle betting
  const handlePlaceBet = async (amount: string) => {
    try {
      trackUserAction('bet_placed', { amount, view: currentView, device: isMobile ? 'mobile' : 'desktop' });
      await placeBet(amount);
      playEngineSound('idle');
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };

  // Handle plane launch
  const handleLaunchPlane = async () => {
    if (!playerRoundState?.roundId) return;
    
    try {
      trackGameEvent('plane_launched', { 
        roundId: playerRoundState.roundId.toString(),
        betAmount: formatEther(playerRoundState.betAmount),
        device: isMobile ? 'mobile' : 'desktop'
      });
      await launchPlane(playerRoundState.roundId);
      playEngineSound('takeoff');
    } catch (error) {
      console.error('Failed to launch plane:', error);
    }
  };

  // Handle payout claim
  const handleClaimPayout = async () => {
    if (!playerRoundState?.roundId) return;
    
    try {
      trackGameEvent('payout_claimed', { 
        roundId: playerRoundState.roundId.toString(),
        result: playerRoundState.state === RoundState.LANDED_SAFE ? 'win' : 'loss',
        device: isMobile ? 'mobile' : 'desktop'
      });
      await claimPayout(playerRoundState.roundId);
    } catch (error) {
      console.error('Failed to claim payout:', error);
    }
  };

  return (
    <LoadingOptimizer>
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        {/* Mobile Header - Only on mobile */}
        {isMobile && (
          <MobileHeader 
            currentView={currentView}
            showMenu={showMobileMenu}
            onToggleMenu={() => setShowMobileMenu(!showMobileMenu)}
          />
        )}

        {/* Game Status Bar - Responsive */}
        <GameStatus 
          playerRoundState={
            playerRoundState
              ? { ...playerRoundState, readyToLaunch: playerRoundState.state === RoundState.READY_TO_LAUNCH }
              : undefined
          }
          gameConfig={gameConfig}
        />

        {/* Main Content - Responsive Layout */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Desktop Layout: Side-by-side */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Game Controls */}
            <div className="lg:col-span-1 space-y-6">
              <GameControlPanels 
                currentView={currentView}
                gameConfig={gameConfig}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                onPlaceBet={handlePlaceBet}
                playerRoundState={playerRoundState}
                roundInfo={roundInfo}
                onLaunch={handleLaunchPlane}
                onClaim={handleClaimPayout}
                isLoading={isLoading}
                eventsQueue={eventsQueue}
              />
            </div>

            {/* Right Panel - 3D Visualization */}
            <div className="lg:col-span-2">
              <FlightVisualization 
                view={currentView}
                playerRoundState={
                  playerRoundState
                    ? { ...playerRoundState, readyToLaunch: playerRoundState.state === RoundState.READY_TO_LAUNCH }
                    : undefined
                }
                roundInfo={roundInfo}
              />
            </div>
          </div>

          {/* Mobile/Tablet Layout: Stacked */}
          <div className="lg:hidden space-y-4">
            {/* 3D Visualization - Full width on mobile */}
            <div className="w-full">
              <FlightVisualization 
                view={currentView}
                playerRoundState={
                  playerRoundState
                    ? { ...playerRoundState, readyToLaunch: playerRoundState.state === RoundState.READY_TO_LAUNCH }
                    : undefined
                }
                roundInfo={roundInfo}
              />
            </div>

            {/* Mobile Game Controls */}
            <GameControlPanels
              currentView={currentView}
              gameConfig={gameConfig}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onPlaceBet={handlePlaceBet}
              playerRoundState={playerRoundState}
              roundInfo={roundInfo}
              onLaunch={handleLaunchPlane}
              onClaim={handleClaimPayout}
              isLoading={isLoading}
              eventsQueue={eventsQueue}
            />
          </div>
        </div>

        {/* Enhanced UI Components */}
        <SoundControls />
        <PerformanceMonitor />
        
        {/* Mobile-specific controls */}
        <TouchControls 
          onLaunch={handleLaunchPlane}
          onBet={handlePlaceBet}
          isFlying={playerRoundState?.state === RoundState.FLYING}
          canLaunch={playerRoundState?.state === RoundState.READY_TO_LAUNCH}
        />
        {/* <MobileControls /> */}

        {/* Orientation warning for mobile */}
        {isMobile && orientation === 'portrait' && (
          <OrientationWarning />
        )}
      </div>
    </LoadingOptimizer>
  );
}

// Mobile Header Component
function MobileHeader({ 
  currentView, 
  showMenu, 
  onToggleMenu 
}: { 
  currentView: string; 
  showMenu: boolean; 
  onToggleMenu: () => void; 
}) {
  return (
    <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">✈️</div>
          <div>
            <h1 className="text-lg font-bold text-white capitalize">{currentView} Mode</h1>
            <p className="text-xs text-slate-400">Swipe up for controls</p>
          </div>
        </div>
        
        <button
          onClick={onToggleMenu}
          className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={showMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Orientation Warning
function OrientationWarning() {
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-2xl mb-2">📱➡️📱</div>
        <div className="text-orange-400 font-semibold">Better Experience in Landscape</div>
        <div className="text-orange-300 text-sm">Rotate your device for optimal gameplay</div>
      </div>
    </div>
  );
}