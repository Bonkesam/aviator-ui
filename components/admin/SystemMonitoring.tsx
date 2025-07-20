// components/admin/SystemMonitoring.tsx
import { useState } from "react";

export function SystemMonitoring({ systemHealth }: { systemHealth: any }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* System Health */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">System Health</h3>
        
        <div className="space-y-4">
          <HealthIndicator 
            label="VRF Service"
            status={systemHealth?.vrfStatus || 'unknown'}
            details="Chainlink VRF requests and responses"
          />
          <HealthIndicator 
            label="Smart Contract"
            status={systemHealth?.contractStatus || 'unknown'}
            details="Contract interactions and state"
          />
          <HealthIndicator 
            label="Network"
            status={systemHealth?.networkStatus || 'unknown'}
            details="Sepolia network connectivity"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Performance</h3>
        
        <div className="space-y-4">
          <MetricDisplay label="Avg Response Time" value="1.2s" trend="good" />
          <MetricDisplay label="Success Rate" value="99.8%" trend="good" />
          <MetricDisplay label="Gas Usage" value="180k avg" trend="normal" />
          <MetricDisplay label="VRF Latency" value="2.1s avg" trend="normal" />
        </div>
      </div>
    </div>
  );
}

function HealthIndicator({ label, status, details }: { label: string; status: string; details: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400 bg-green-500/20';
      case 'degraded': return 'text-yellow-400 bg-yellow-500/20';
      case 'down': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-slate-400 text-sm">{details}</div>
      </div>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {status.toUpperCase()}
      </div>
    </div>
  );
}

function MetricDisplay({ label, value, trend }: { label: string; value: string; trend: 'good' | 'normal' | 'bad' }) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'good': return 'text-green-400';
      case 'normal': return 'text-yellow-400';
      case 'bad': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
      <div className="text-slate-300">{label}</div>
      <div className={`font-medium ${getTrendColor(trend)}`}>{value}</div>
    </div>
  );
}

// VRF Monitoring Component
export function VRFMonitoring() {
  const [vrfRequests, setVrfRequests] = useState([
    { id: 1, requestId: '0x123...', status: 'fulfilled', timestamp: '2 min ago', gasUsed: '180k' },
    { id: 2, requestId: '0x456...', status: 'pending', timestamp: '5 min ago', gasUsed: '-' },
    { id: 3, requestId: '0x789...', status: 'fulfilled', timestamp: '8 min ago', gasUsed: '175k' },
  ]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">VRF Request Monitoring</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 text-slate-300 font-medium">Request ID</th>
              <th className="text-left py-3 text-slate-300 font-medium">Status</th>
              <th className="text-left py-3 text-slate-300 font-medium">Timestamp</th>
              <th className="text-left py-3 text-slate-300 font-medium">Gas Used</th>
            </tr>
          </thead>
          <tbody>
            {vrfRequests.map((request) => (
              <tr key={request.id} className="border-b border-slate-700/50">
                <td className="py-3 text-slate-300 font-mono text-sm">{request.requestId}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'fulfilled' 
                      ? 'text-green-400 bg-green-500/20' 
                      : 'text-yellow-400 bg-yellow-500/20'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-slate-300">{request.timestamp}</td>
                <td className="py-3 text-slate-300">{request.gasUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
