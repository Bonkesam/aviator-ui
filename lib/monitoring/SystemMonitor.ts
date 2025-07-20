// lib/monitoring/SystemMonitor.ts
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    blockchain: ServiceStatus;
    vrf: ServiceStatus;
    database: ServiceStatus;
    api: ServiceStatus;
    frontend: ServiceStatus;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
    uptime: number;
  };
  alerts: Alert[];
}

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  errorRate: number;
  lastCheck: number;
  message?: string;
}

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  service?: string;
}

export class SystemMonitor {
  private static instance: SystemMonitor;
  private health: SystemHealth;
  private checkInterval: NodeJS.Timeout | null = null;
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  private constructor() {
    this.health = this.initializeHealth();
  }

  public static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  private initializeHealth(): SystemHealth {
    return {
      status: 'healthy',
      services: {
        blockchain: { status: 'operational', latency: 0, errorRate: 0, lastCheck: Date.now() },
        vrf: { status: 'operational', latency: 0, errorRate: 0, lastCheck: Date.now() },
        database: { status: 'operational', latency: 0, errorRate: 0, lastCheck: Date.now() },
        api: { status: 'operational', latency: 0, errorRate: 0, lastCheck: Date.now() },
        frontend: { status: 'operational', latency: 0, errorRate: 0, lastCheck: Date.now() }
      },
      metrics: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0,
        uptime: 100
      },
      alerts: []
    };
  }

  public async startMonitoring(): Promise<void> {
    console.log('Starting system monitoring...');
    
    // Initial health check
    await this.performHealthCheck();
    
    // Set up periodic monitoring
    this.checkInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Check every 30 seconds

    // Set up error monitoring
    this.setupErrorMonitoring();
  }

  private async performHealthCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      // Check all services concurrently
      const [blockchain, vrf, database, api, frontend] = await Promise.allSettled([
        this.checkBlockchain(),
        this.checkVRF(),
        this.checkDatabase(),
        this.checkAPI(),
        this.checkFrontend()
      ]);

      // Update service statuses
      this.updateServiceStatus('blockchain', blockchain);
      this.updateServiceStatus('vrf', vrf);
      this.updateServiceStatus('database', database);
      this.updateServiceStatus('api', api);
      this.updateServiceStatus('frontend', frontend);

      // Calculate overall health
      this.calculateOverallHealth();

      // Update metrics
      this.health.metrics.responseTime = Date.now() - startTime;
      
    } catch (error) {
      console.error('Health check failed:', error);
      this.createAlert('critical', 'Health check system failure', 'monitoring');
    }
  }

  private async checkBlockchain(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      // Check if we can read from the blockchain
      const response = await fetch('/api/blockchain/health');
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status === 'connected' ? 'operational' : 'degraded',
          latency,
          errorRate: 0,
          lastCheck: Date.now(),
          message: data.message
        };
      } else {
        return {
          status: 'down',
          latency,
          errorRate: 100,
          lastCheck: Date.now(),
          message: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        errorRate: 100,
        lastCheck: Date.now(),
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkVRF(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/vrf/health');
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: data.subscriptionActive ? 'operational' : 'degraded',
          latency,
          errorRate: 0,
          lastCheck: Date.now(),
          message: `Balance: ${data.balance} LINK`
        };
      } else {
        return {
          status: 'down',
          latency,
          errorRate: 100,
          lastCheck: Date.now(),
          message: 'VRF service unavailable'
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        errorRate: 100,
        lastCheck: Date.now(),
        message: 'VRF check failed'
      };
    }
  }

  private async checkDatabase(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/database/health');
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'operational',
          latency,
          errorRate: 0,
          lastCheck: Date.now()
        };
      } else {
        return {
          status: 'down',
          latency,
          errorRate: 100,
          lastCheck: Date.now(),
          message: 'Database connection failed'
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        errorRate: 100,
        lastCheck: Date.now(),
        message: 'Database unreachable'
      };
    }
  }

  private async checkAPI(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/health');
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'operational',
          latency,
          errorRate: 0,
          lastCheck: Date.now()
        };
      } else {
        return {
          status: 'degraded',
          latency,
          errorRate: 50,
          lastCheck: Date.now(),
          message: `API responding with ${response.status}`
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        errorRate: 100,
        lastCheck: Date.now(),
        message: 'API unreachable'
      };
    }
  }

  private async checkFrontend(): Promise<ServiceStatus> {
    // Frontend is operational if this code is running
    return {
      status: 'operational',
      latency: 0,
      errorRate: 0,
      lastCheck: Date.now()
    };
  }

  private updateServiceStatus(serviceName: keyof SystemHealth['services'], result: PromiseSettledResult<ServiceStatus>): void {
    if (result.status === 'fulfilled') {
      this.health.services[serviceName] = result.value;
    } else {
      this.health.services[serviceName] = {
        status: 'down',
        latency: 0,
        errorRate: 100,
        lastCheck: Date.now(),
        message: 'Health check rejected'
      };
    }
  }

  private calculateOverallHealth(): void {
    const services = Object.values(this.health.services);
    const operationalCount = services.filter(s => s.status === 'operational').length;
    const degradedCount = services.filter(s => s.status === 'degraded').length;
    
    if (operationalCount === services.length) {
      this.health.status = 'healthy';
    } else if (degradedCount > 0 || operationalCount >= services.length * 0.8) {
      this.health.status = 'degraded';
    } else {
      this.health.status = 'down';
    }

    // Calculate error rate
    const totalErrorRate = services.reduce((sum, s) => sum + s.errorRate, 0);
    this.health.metrics.errorRate = totalErrorRate / services.length;

    // Calculate average response time
    const validLatencies = services.filter(s => s.latency > 0).map(s => s.latency);
    this.health.metrics.responseTime = validLatencies.length > 0 
      ? validLatencies.reduce((sum, l) => sum + l, 0) / validLatencies.length 
      : 0;
  }

  private setupErrorMonitoring(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.createAlert('error', `JavaScript Error: ${event.message}`, 'frontend');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.createAlert('error', `Unhandled Promise Rejection: ${event.reason}`, 'frontend');
    });

    // Performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 3000) { // Alert for slow operations
            this.createAlert('warning', `Slow operation detected: ${entry.name} took ${entry.duration}ms`, 'performance');
          }
        }
      });
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }
  }

  private createAlert(level: Alert['level'], message: string, service?: string): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: Date.now(),
      resolved: false,
      service
    };

    this.health.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    this.health.alerts = this.health.alerts.slice(0, 100);

    // Notify alert callbacks
    this.alertCallbacks.forEach(callback => callback(alert));

    // Auto-resolve info and warning alerts after 5 minutes
    if (level === 'info' || level === 'warning') {
      setTimeout(() => {
        this.resolveAlert(alert.id);
      }, 5 * 60 * 1000);
    }
  }

  public resolveAlert(alertId: string): void {
    const alert = this.health.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public onAlert(callback: (alert: Alert) => void): void {
    this.alertCallbacks.push(callback);
  }

  public getHealth(): SystemHealth {
    return { ...this.health };
  }

  public stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}