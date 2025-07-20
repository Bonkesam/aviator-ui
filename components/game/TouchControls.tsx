// components/game/TouchControls.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface TouchControlsProps {
  onLaunch?: () => void;
  onBet?: (amount: string) => void;
  isFlying?: boolean;
  canLaunch?: boolean;
}

export function TouchControls({ onLaunch, onBet, isFlying, canLaunch }: TouchControlsProps) {
  const { isMobile } = useMobileOptimization();
  const [activeTouch, setActiveTouch] = useState<string | null>(null);
  const [quickBetAmount, setQuickBetAmount] = useState('0.1');
  const [showQuickBets, setShowQuickBets] = useState(true);

  // Don't render on desktop
  if (!isMobile) return null;

  const handleTouchStart = (action: string) => {
    setActiveTouch(action);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTouchEnd = () => {
    setActiveTouch(null);
  };

  const handleQuickBet = (amount: string) => {
    setQuickBetAmount(amount);
    onBet?.(amount);
    
    // Success haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([20, 10, 20]);
    }
  };

  const handleLaunch = () => {
    onLaunch?.();
    
    // Launch haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 20, 100]);
    }
  };

  // Hide quick bets when flying or ready to launch
  const shouldShowQuickBets = !isFlying && !canLaunch;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
      
      <div className="relative pointer-events-auto">
        {/* Swipe indicator */}
        <div className="text-center py-2">
          <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-1" />
          <p className="text-xs text-slate-400">Touch controls</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Bet Controls - Only show when appropriate */}
          {shouldShowQuickBets && (
            <QuickBetControls
              quickBetAmount={quickBetAmount}
              onQuickBet={handleQuickBet}
              activeTouch={activeTouch}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
          )}

          {/* Main Action Button */}
          <MainActionButton
            canLaunch={canLaunch}
            isFlying={isFlying}
            quickBetAmount={quickBetAmount}
            onLaunch={handleLaunch}
            onBet={() => handleQuickBet(quickBetAmount)}
            activeTouch={activeTouch}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>
    </div>
  );
}

// Quick Bet Controls Component
interface QuickBetControlsProps {
  quickBetAmount: string;
  onQuickBet: (amount: string) => void;
  activeTouch: string | null;
  onTouchStart: (action: string) => void;
  onTouchEnd: () => void;
}

function QuickBetControls({ 
  quickBetAmount, 
  onQuickBet, 
  activeTouch, 
  onTouchStart, 
  onTouchEnd 
}: QuickBetControlsProps) {
  const quickBetAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-slate-300 text-sm font-medium">Quick Bet</p>
      </div>
      
      <div className="flex justify-center space-x-2">
        {quickBetAmounts.map((amount) => (
          <button
            key={amount}
            onTouchStart={() => onTouchStart(`bet-${amount}`)}
            onTouchEnd={onTouchEnd}
            onClick={() => onQuickBet(amount)}
            className={`
              flex-1 max-w-[60px] py-3 px-2 rounded-xl font-semibold text-sm 
              transition-all duration-200 transform active:scale-95
              ${activeTouch === `bet-${amount}` ? 'scale-95' : 'scale-100'}
              ${quickBetAmount === amount 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border-2 border-cyan-400' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
              }
            `}
          >
            <div className="text-xs leading-tight">{amount}</div>
            <div className="text-xs opacity-75">ETH</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Main Action Button Component
interface MainActionButtonProps {
  canLaunch: boolean;
  isFlying: boolean;
  quickBetAmount: string;
  onLaunch: () => void;
  onBet: () => void;
  activeTouch: string | null;
  onTouchStart: (action: string) => void;
  onTouchEnd: () => void;
}

function MainActionButton({
  canLaunch,
  isFlying,
  quickBetAmount,
  onLaunch,
  onBet,
  activeTouch,
  onTouchStart,
  onTouchEnd
}: MainActionButtonProps) {
  const getButtonConfig = () => {
    if (canLaunch) {
      return {
        text: 'LAUNCH FLIGHT',
        emoji: '🚀',
        action: 'launch',
        onClick: onLaunch,
        className: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
        pulseColor: 'bg-green-400'
      };
    } else if (isFlying) {
      return {
        text: 'FLIGHT IN PROGRESS',
        emoji: '✈️',
        action: 'flying',
        onClick: () => {},
        className: 'from-blue-500/50 to-blue-600/50 cursor-not-allowed',
        pulseColor: 'bg-blue-400',
        disabled: true
      };
    } else {
      return {
        text: `BET ${quickBetAmount} ETH`,
        emoji: '💰',
        action: 'bet',
        onClick: onBet,
        className: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
        pulseColor: 'bg-cyan-400'
      };
    }
  };

  const config = getButtonConfig();

  return (
    <div className="flex justify-center">
      <button
        onTouchStart={() => onTouchStart(config.action)}
        onTouchEnd={onTouchEnd}
        onClick={config.onClick}
        disabled={config.disabled}
        className={`
          relative w-full max-w-sm py-4 px-8 rounded-2xl font-bold text-lg 
          transition-all duration-300 transform
          ${activeTouch === config.action ? 'scale-95' : 'scale-100'}
          bg-gradient-to-r ${config.className}
          text-white shadow-xl
          flex items-center justify-center space-x-3
          ${config.disabled ? '' : 'active:scale-95'}
        `}
      >
        {/* Pulse effect for active states */}
        {(canLaunch || isFlying) && (
          <div className={`absolute inset-0 rounded-2xl ${config.pulseColor} opacity-20 animate-pulse`} />
        )}
        
        <span className="text-2xl">{config.emoji}</span>
        <span className="relative z-10">{config.text}</span>
        
        {/* Progress indicator for flying state */}
        {isFlying && (
          <div className="absolute bottom-1 left-4 right-4 h-1 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/60 rounded-full animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}

// Enhanced Touch Controls with Gestures
export function EnhancedTouchControls({ onLaunch, onBet, isFlying, canLaunch }: TouchControlsProps) {
  const { isMobile } = useMobileOptimization();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [showControls, setShowControls] = useState(false);
  const touchRef = useRef<HTMLDivElement>(null);

  if (!isMobile) return null;

  // Swipe up gesture to show controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaY = touchStart.y - touch.clientY;
    const deltaX = Math.abs(touchStart.x - touch.clientX);

    // Swipe up gesture (30px minimum, more vertical than horizontal)
    if (deltaY > 30 && deltaX < 50) {
      setShowControls(true);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Touch area for swipe gesture */}
      <div
        ref={touchRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="h-16 w-full"
      />

      {/* Gesture hint */}
      {!showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-600">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="text-sm">👆</div>
              <span className="text-xs">Swipe up for controls</span>
            </div>
          </div>
        </div>
      )}

      {/* Slide-up controls panel */}
      <div className={`
        absolute bottom-0 left-0 right-0 
        bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 
        backdrop-blur-sm border-t border-slate-700
        transform transition-transform duration-300 ease-out
        ${showControls ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <TouchControls 
          onLaunch={onLaunch}
          onBet={onBet}
          isFlying={isFlying}
          canLaunch={canLaunch}
        />
        
        {/* Close button */}
        <div className="text-center pb-4">
          <button
            onClick={() => setShowControls(false)}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}