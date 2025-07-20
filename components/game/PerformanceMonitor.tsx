'use client';

import { useEffect, useState, useRef } from 'react';
import { Activity, Cpu, Zap, X } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  frameDrops: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    frameDrops: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const dropCountRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const updateMetrics = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Calculate frame time
      const deltaTime = now - lastTimeRef.current;
      
      // Detect frame drops (>20ms between frames = <50fps)
      if (deltaTime > 20) {
        dropCountRef.current++;
      }

      // Calculate FPS every second
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize / 1048576 || 0, // MB
          renderTime: deltaTime,
          frameDrops: dropCountRef.current
        }));

        frameCountRef.current = 0;
        dropCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F3' && e.ctrlKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      if (e.key === 'F2' && e.ctrlKey) {
        e.preventDefault();
        setIsMinimized(!isMinimized);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, isMinimized]);

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55 && metrics.frameDrops < 5) return { status: 'excellent', color: 'text-green-400' };
    if (metrics.fps >= 45 && metrics.frameDrops < 10) return { status: 'good', color: 'text-yellow-400' };
    if (metrics.fps >= 30) return { status: 'fair', color: 'text-orange-400' };
    return { status: 'poor', color: 'text-red-400' };
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Show Performance Monitor (Ctrl+F3)"
        >
          <Activity className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700 min-w-48">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="text-white font-semibold text-sm">Performance</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-white transition-colors text-xs"
            title="Toggle Details (Ctrl+F2)"
          >
            {isMinimized ? '▼' : '▲'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
            title="Hide (Ctrl+F3)"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Always visible: FPS and Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 text-sm">FPS:</span>
            <span className={`font-bold text-lg ${getFpsColor(metrics.fps)}`}>
              {metrics.fps}
            </span>
          </div>
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${performanceStatus.color} bg-current bg-opacity-20`}>
            {performanceStatus.status.toUpperCase()}
          </div>
        </div>

        {/* Detailed metrics (collapsible) */}
        {!isMinimized && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Memory:</span>
              <span className="text-white font-medium">
                {metrics.memoryUsage.toFixed(1)} MB
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Frame Time:</span>
              <span className="text-white font-medium">
                {metrics.renderTime.toFixed(1)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Frame Drops:</span>
              <span className={`font-medium ${metrics.frameDrops > 5 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.frameDrops}
              </span>
            </div>
            
            {/* Quality Indicators */}
            <div className="pt-2 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <QualityIndicator
                  label="3D"
                  status={metrics.fps >= 55 ? 'good' : metrics.fps >= 30 ? 'medium' : 'low'}
                />
                <QualityIndicator
                  label="Audio"
                  status="good"
                />
                <QualityIndicator
                  label="Network"
                  status="good"
                />
              </div>
            </div>

            {/* Performance Tips */}
            {metrics.fps < 45 && (
              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs text-yellow-400 mb-1">💡 Performance Tips:</div>
                <div className="text-xs text-slate-400">
                  • Lower graphics quality in settings<br/>
                  • Close other browser tabs<br/>
                  • Enable hardware acceleration
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keyboard shortcuts */}
        <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">
          Ctrl+F3: Toggle • Ctrl+F2: Details
        </div>
      </div>
    </div>
  );
}

function QualityIndicator({ label, status }: { label: string; status: 'good' | 'medium' | 'low' }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
