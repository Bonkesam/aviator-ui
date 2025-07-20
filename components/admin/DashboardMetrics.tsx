// components/admin/DashboardMetrics.tsx
'use client';

import { useEffect, useRef } from 'react';
import { GSAPAnimations } from '@/lib/gsap';
import { TrendingUp, Users, DollarSign, Activity, Trophy, Zap } from 'lucide-react';

interface DashboardMetricsProps {
  gameStats: {
    totalRounds: number;
    activeRounds: number;
    totalVolume: string;
    totalPlayers: number;
    winRate: number;
    houseProfit: string;
  };
  isLoading: boolean;
}

export function DashboardMetrics({ gameStats, isLoading }: DashboardMetricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !isLoading) {
      GSAPAnimations.fadeInUp(containerRef.current);
    }
  }, [isLoading]);

  if (isLoading) {
    return <MetricsLoadingSkeleton />;
  }

  const metrics = [
    {
      title: 'Total Volume',
      value: `${gameStats.totalVolume} ETH`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Active Rounds',
      value: gameStats.activeRounds.toString(),
      change: '+3',
      trend: 'up',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Total Players',
      value: gameStats.totalPlayers.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Win Rate',
      value: `${gameStats.winRate.toFixed(1)}%`,
      change: '-0.3%',
      trend: 'down',
      icon: Trophy,
      color: 'yellow'
    },
    {
      title: 'House Profit',
      value: `${gameStats.houseProfit} ETH`,
      change: '+15.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total Rounds',
      value: gameStats.totalRounds.toLocaleString(),
      change: '+156',
      trend: 'up',
      icon: Zap,
      color: 'cyan'
    }
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} metric={metric} index={index} />
      ))}
    </div>
  );
}

function MetricCard({ metric, index }: { metric: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      GSAPAnimations.fadeInUp(cardRef.current, index * 0.1);
    }
  }, [index]);

  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/50 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/50 text-green-400',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/50 text-cyan-400',
  };

  return (
    <div 
      ref={cardRef}
      className={`
        bg-gradient-to-br ${colorClasses[metric.color as keyof typeof colorClasses]} 
        backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300
        hover:scale-105 hover:shadow-2xl cursor-pointer
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[metric.color as keyof typeof colorClasses]} rounded-xl`}>
          <metric.icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendingUp className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
          <span>{metric.change}</span>
        </div>
      </div>

      <div>
        <h3 className="text-slate-300 text-sm font-medium mb-1">{metric.title}</h3>
        <p className="text-white text-2xl font-bold">{metric.value}</p>
      </div>
    </div>
  );
}

function MetricsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl" />
            <div className="w-16 h-4 bg-slate-700 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-20 h-4 bg-slate-700 rounded" />
            <div className="w-24 h-8 bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}