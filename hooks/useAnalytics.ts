// hooks/useAnalytics.ts
import { AnalyticsManager } from '@/lib/analytics/AnalyticsManager';
import { useEffect, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';

export function useAnalytics() {
  const { address } = useAccount();
  const analytics = useRef<AnalyticsManager>(AnalyticsManager.getInstance());
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (!isInitialized.current) {
        await analytics.current.initialize(address);
        isInitialized.current = true;
      }
    };

    initializeAnalytics();

    return () => {
      analytics.current.destroy();
    };
  }, [address]);

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.current.track(event, properties);
  }, []);

  const trackGameEvent = useCallback((action: string, data: any) => {
    analytics.current.trackGameEvent(action, data);
  }, []);

  const trackUserAction = useCallback((action: string, properties?: Record<string, any>) => {
    analytics.current.trackUserAction(action, properties);
  }, []);

  const trackPerformance = useCallback((metric: string, value: number, unit?: string) => {
    analytics.current.trackPerformance(metric, value, unit);
  }, []);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analytics.current.trackError(error, context);
  }, []);

  const trackConversion = useCallback((event: string, value?: number, currency?: string) => {
    analytics.current.trackConversion(event, value, currency);
  }, []);

  return {
    track,
    trackGameEvent,
    trackUserAction,
    trackPerformance,
    trackError,
    trackConversion,
    getSessionData: () => analytics.current.getSessionData()
  };
}