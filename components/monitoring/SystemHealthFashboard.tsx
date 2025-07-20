// components/monitoring/SystemHealthDashboard.tsx
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

export function SystemHealthDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [monitor] = useState(() => SystemMonitor.getInstance());

  useEffect(() => {
    // Start monitoring
    monitor.startMonitoring();

    // Set up real-time updates
    const interval = setInterval(() => {
      setHealth(monitor.getHealth());
    }, 5000);

    // Set up alert notifications
    monitor.onAlert((alert) => {
      if (alert.level === 'critical' || alert.level === 'error') {
        // Show critical alerts immediately
        console.error('Critical Alert:', alert.message);
      }
    });

    return () => {
      clearInterval(interval);
      monitor.stop();
    };
  }, [monitor]);

  if (!health) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'border-green-500/50 bg-green-500/10';
      case 'degraded':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'down':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className={`rounded-2xl p-6 border backdrop-blur-sm ${getStatusColor(health.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(health.status)}
            <div>
              <h2 className="text-xl font-bold text-white capitalize">{health.status}</h2>
              <p className="text-slate-300">All systems operational</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-sm">Uptime</div>
            <div className="text-white font-bold">{health.metrics.uptime.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(health.services).map(([serviceName, service]) => (
          <div key={serviceName} className={`rounded-xl p-4 border backdrop-blur-sm ${getStatusColor(service.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(service.status)}
                <span className="text-white font-medium capitalize">{serviceName}</span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(service.lastCheck).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Latency:</span>
                <span className="text-white">{service.latency}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Error Rate:</span>
                <span className="text-white">{service.errorRate.toFixed(1)}%</span>
              </div>
              {service.message && (
                <div className="text-xs text-slate-300 mt-2">
                  {service.message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <MetricCard title="Response Time" value={`${health.metrics.responseTime.toFixed(0)}ms`} />
        <MetricCard title="Error Rate" value={`${health.metrics.errorRate.toFixed(2)}%`} />
        <MetricCard title="Throughput" value={`${health.metrics.throughput}/min`} />
        <MetricCard title="Uptime" value={`${health.metrics.uptime.toFixed(3)}%`} />
      </div>

      {/* Recent Alerts */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Recent Alerts</span>
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {health.alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent alerts</p>
            </div>
          ) : (
            health.alerts.slice(0, 10).map((alert) => (
              <AlertItem key={alert.id} alert={alert} onResolve={() => monitor.resolveAlert(alert.id)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  );
}

function AlertItem({ alert, onResolve }: { alert: Alert; onResolve: () => void }) {
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'error': return 'text-red-400 bg-red-500/10';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-blue-400 bg-blue-500/10';
    }
  };

  return (
    <div className={`flex items-start justify-between p-3 rounded-lg ${alert.resolved ? 'opacity-50' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className={`px-2 py-1 rounded text-xs font-medium ${getAlertColor(alert.level)}`}>
          {alert.level.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-white text-sm">{alert.message}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-slate-400 text-xs">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            {alert.service && (
              <span className="text-slate-500 text-xs">• {alert.service}</span>
            )}
          </div>
        </div>
      </div>
      
      {!alert.resolved && (
        <button
          onClick={onResolve}
          className="text-slate-400 hover:text-white text-xs transition-colors"
        >
          Resolve
        </button>
      )}
    </div>
  );
}