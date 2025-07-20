// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAdminData } from '@/hooks/useAdminData';
import { RealTimeMonitor } from '@/components/admin/realTimeMonitor';
import { RoundManagement } from '@/components/admin/RoundManagement';
import { PlayerAnalytics } from '@/components/admin/PlayerAnalytics';
import { SystemControls } from '@/components/admin/SystemControls';
import { usePageTransition } from '@/lib/gsap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BarChart3, Users, Settings, Activity, Zap } from 'lucide-react';
import { SystemMonitoring, VRFMonitoring } from '@/components/admin/SystemMonitoring';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';

export default function AdminPage() {
  const { containerRef } = usePageTransition();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    gameStats, 
    activeRounds, 
    playerStats, 
    systemHealth,
    isLoading 
  } = useAdminData();

  // Check admin permissions (you might want to implement proper role checking)
  const isAdmin = address && address.toLowerCase() === '0x9027A88b08e3436271e24611Fb5aeC1585B6FE43'.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-300">You don't have admin permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Admin Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400">AdvancedAviator Game Management</p>
              </div>
            </div>
            
            <SystemHealthIndicator health={systemHealth} />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rounds" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Rounds</span>
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Players</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Monitor</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <DashboardMetrics gameStats={gameStats} isLoading={isLoading} />
            <div className="grid lg:grid-cols-2 gap-6">
              <RealTimeMonitor activeRounds={activeRounds} />
              <RecentActivity />
            </div>
          </TabsContent>

          {/* Rounds Management Tab */}
          <TabsContent value="rounds" className="space-y-6">
            <RoundManagement activeRounds={activeRounds} isLoading={isLoading} />
          </TabsContent>

          {/* Players Analytics Tab */}
          <TabsContent value="players" className="space-y-6">
            <PlayerAnalytics playerStats={playerStats} isLoading={isLoading} />
          </TabsContent>

          {/* Real-time Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <SystemMonitoring systemHealth={systemHealth} />
            <VRFMonitoring />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SystemControls />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// System Health Indicator
function SystemHealthIndicator({ health }: { health: any }) {
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  return (
    <div className={`px-4 py-2 rounded-lg border ${getHealthColor(health?.status || 'unknown')}`}>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <span className="text-sm font-medium capitalize">
          {health?.status || 'Checking...'}
        </span>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'round_created', player: '0x742d...35B1', amount: '0.1 ETH', time: '2 min ago' },
    { id: 2, type: 'round_completed', player: '0x8A3f...92C4', result: 'won', amount: '0.2 ETH', time: '5 min ago' },
    { id: 3, type: 'round_crashed', player: '0x1B5e...78D9', amount: '0.05 ETH', time: '8 min ago' },
    { id: 4, type: 'vrf_request', requestId: '12345', time: '10 min ago' },
    { id: 5, type: 'multiplier_hit', player: '0x9C2a...45F6', multiplier: '1.5x', time: '12 min ago' },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'round_created': return '🆕';
      case 'round_completed': return '✅';
      case 'round_crashed': return '💥';
      case 'vrf_request': return '🎲';
      case 'multiplier_hit': return '⚡';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'round_created': return 'text-blue-400';
      case 'round_completed': return 'text-green-400';
      case 'round_crashed': return 'text-red-400';
      case 'vrf_request': return 'text-purple-400';
      case 'multiplier_hit': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
            <div className="text-lg">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                  {activity.type.replace('_', ' ').toUpperCase()}
                </p>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                {activity.type === 'round_created' && `Player ${activity.player} placed bet of ${activity.amount}`}
                {activity.type === 'round_completed' && `Player ${activity.player} ${activity.result} ${activity.amount}`}
                {activity.type === 'round_crashed' && `Player ${activity.player} lost ${activity.amount}`}
                {activity.type === 'vrf_request' && `VRF request ${activity.requestId} initiated`}
                {activity.type === 'multiplier_hit' && `Player ${activity.player} hit ${activity.multiplier} multiplier`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
