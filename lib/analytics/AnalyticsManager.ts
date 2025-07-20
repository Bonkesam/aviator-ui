// lib/analytics/AnalyticsManager.ts
declare var gtag: (...args: any[]) => void;
declare var mixpanel: any;

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: number;
  page?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: {
    type: 'mobile' | 'desktop' | 'tablet';
    os: string;
    browser: string;
    screen: { width: number; height: number };
  };
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private session: UserSession;
  private isInitialized: boolean = false;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  public async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) return;

    this.userId = userId;
    this.session.userId = userId;

    // Start automatic event flushing
    this.startEventFlushing();
    
    // Track session start
    this.track('session_start', {
      userId: this.userId,
      device: this.session.device,
      timestamp: Date.now()
    });

    // Track page load performance
    this.trackPagePerformance();

    // Set up page visibility tracking
    this.setupVisibilityTracking();

    this.isInitialized = true;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      sessionId: this.sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      device: this.detectDevice(),
    };
  }

  private detectDevice() {
    const userAgent = navigator.userAgent;
    const screen = { width: window.screen.width, height: window.screen.height };
    
    let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'mobile';
    else if (/Tablet|iPad/i.test(userAgent)) deviceType = 'tablet';

    let os = 'Unknown';
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iOS/i.test(userAgent)) os = 'iOS';

    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';

    return { type: deviceType, os, browser, screen };
  }

  public track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        page: window.location.pathname,
        referrer: document.referrer || 'direct'
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent
    };

    this.eventQueue.push(analyticsEvent);
    this.session.events.push(analyticsEvent);
    this.session.lastActivity = Date.now();

    // Immediate flush for critical events
    if (this.isCriticalEvent(event)) {
      this.flushEvents();
    }
  }

  private isCriticalEvent(event: string): boolean {
    const criticalEvents = [
      'round_created',
      'round_launched', 
      'round_ended',
      'payout_processed',
      'error_occurred',
      'user_registration',
      'deposit_made'
    ];
    return criticalEvents.includes(event);
  }

  // Game-specific tracking methods
  public trackGameEvent(action: string, data: any): void {
    this.track(`game_${action}`, {
      roundId: data.roundId,
      betAmount: data.betAmount,
      result: data.result,
      multipliers: data.multipliers,
      gameMode: 'aviator',
      ...data
    });
  }

  public trackUserAction(action: string, properties: Record<string, any> = {}): void {
    this.track(`user_${action}`, {
      ...properties,
      timestamp: Date.now()
    });
  }

  public trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.track('performance_metric', {
      metric,
      value,
      unit,
      device: this.session.device.type,
      timestamp: Date.now()
    });
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    this.track('error_occurred', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  }

  public trackConversion(event: string, value?: number, currency: string = 'ETH'): void {
    this.track('conversion', {
      conversionEvent: event,
      value,
      currency,
      timestamp: Date.now()
    });
  }

  private trackPagePerformance(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.track('page_performance', {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      });
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private setupVisibilityTracking(): void {
    let visibilityStart = Date.now();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden
        const visibleTime = Date.now() - visibilityStart;
        this.track('page_hidden', { visibleTime });
      } else {
        // Page became visible
        visibilityStart = Date.now();
        this.track('page_visible', {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  private startEventFlushing(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Flush on page hide (mobile)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushEvents();
      }
    });
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to analytics service
      await this.sendToAnalyticsService(events);
      
      // Store locally as backup
      this.storeEventsLocally(events);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  private async sendToAnalyticsService(events: AnalyticsEvent[]): Promise<void> {
    // Send to multiple analytics services
    const promises = [
      this.sendToCustomAnalytics(events),
      this.sendToGoogleAnalytics(events),
      this.sendToMixpanel(events)
    ];

    await Promise.allSettled(promises);
  }

  private async sendToCustomAnalytics(events: AnalyticsEvent[]): Promise<void> {
    // Send to your custom analytics backend
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events,
        session: this.session,
        timestamp: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  private async sendToGoogleAnalytics(events: AnalyticsEvent[]): Promise<void> {
    // Google Analytics 4 integration
    if (typeof gtag !== 'undefined') {
      events.forEach(event => {
        gtag('event', event.event, {
          custom_map: event.properties,
          session_id: event.sessionId,
          user_id: event.userId
        });
      });
    }
  }

  private async sendToMixpanel(events: AnalyticsEvent[]): Promise<void> {
    // Mixpanel integration
    if (typeof mixpanel !== 'undefined') {
      events.forEach(event => {
        mixpanel.track(event.event, {
          ...event.properties,
          $user_id: event.userId,
          $session_id: event.sessionId
        });
      });
    }
  }

  private storeEventsLocally(events: AnalyticsEvent[]): void {
    try {
      const stored = localStorage.getItem('analytics_backup') || '[]';
      const existingEvents = JSON.parse(stored);
      const updatedEvents = [...existingEvents, ...events];
      
      // Keep only last 1000 events locally
      const trimmedEvents = updatedEvents.slice(-1000);
      localStorage.setItem('analytics_backup', JSON.stringify(trimmedEvents));
    } catch (error) {
      console.warn('Failed to store analytics events locally:', error);
    }
  }

  public getSessionData(): UserSession {
    return { ...this.session };
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    this.session.userId = userId;
    this.track('user_identified', { userId });
  }

  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
    this.track('session_end', {
      sessionDuration: Date.now() - this.session.startTime,
      totalEvents: this.session.events.length
    });
  }
}