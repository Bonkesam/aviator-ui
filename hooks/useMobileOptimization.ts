'use client';

import { useEffect, useState } from 'react';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  screen: {
    width: number;
    height: number;
  };
}

interface OptimalSettings {
  shadows: boolean;
  antialiasing: boolean;
  particleCount: number;
  renderScale: number;
  maxLights: number;
  lodBias: number;
}

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screen = { 
        width: window.screen.width, 
        height: window.screen.height 
      };

      // Device type detection
      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletDevice = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || 
                           (window.innerWidth >= 768 && window.innerWidth <= 1024);
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice && !isMobileDevice);

      // Performance detection
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 4;
      const isLowPerf = cores < 4 || memory < 4 || isMobileDevice;
      setIsLowPerformance(isLowPerf);

      // OS detection
      let os = 'Unknown';
      if (/windows/i.test(userAgent)) os = 'Windows';
      else if (/mac/i.test(userAgent)) os = 'macOS';
      else if (/linux/i.test(userAgent)) os = 'Linux';
      else if (/android/i.test(userAgent)) os = 'Android';
      else if (/ios|iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

      // Browser detection
      let browser = 'Unknown';
      if (/chrome/i.test(userAgent)) browser = 'Chrome';
      else if (/firefox/i.test(userAgent)) browser = 'Firefox';
      else if (/safari/i.test(userAgent)) browser = 'Safari';
      else if (/edge/i.test(userAgent)) browser = 'Edge';

      setDeviceInfo({
        type: isMobileDevice ? 'mobile' : isTabletDevice ? 'tablet' : 'desktop',
        os,
        browser,
        screen
      });

      // Quality setting based on device
      if (isLowPerf || isMobileDevice) {
        setQuality('medium');
      } else if (isTabletDevice) {
        setQuality('medium');
      } else {
        setQuality('high');
      }
    };

    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    // Initial detection
    detectDevice();
    checkOrientation();

    // Event listeners
    const handleResize = () => {
      checkOrientation();
      detectDevice(); // Re-detect on resize for dynamic changes
    };

    const handleOrientationChange = () => {
      // Wait a bit for the orientation change to complete
      setTimeout(checkOrientation, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const getOptimalSettings = (): OptimalSettings => {
    if (isLowPerformance || isMobile) {
      return {
        shadows: false,
        antialiasing: false,
        particleCount: 50,
        renderScale: 0.8,
        maxLights: 2,
        lodBias: 2
      };
    }

    if (isTablet) {
      return {
        shadows: true,
        antialiasing: false,
        particleCount: 100,
        renderScale: 0.9,
        maxLights: 4,
        lodBias: 1.5
      };
    }

    // Desktop high performance
    return {
      shadows: true,
      antialiasing: true,
      particleCount: 200,
      renderScale: 1.0,
      maxLights: 8,
      lodBias: 1
    };
  };

  const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const getViewportSize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };

  const canVibrate = () => {
    return 'vibrate' in navigator;
  };

  const supportsFullscreen = () => {
    return 'requestFullscreen' in document.documentElement;
  };

  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isLowPerformance,
    deviceInfo,
    
    // Orientation and layout
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    
    // Quality and performance
    quality,
    optimalSettings: getOptimalSettings(),
    
    // Capabilities
    isTouch: isTouch(),
    canVibrate: canVibrate(),
    supportsFullscreen: supportsFullscreen(),
    
    // Utilities
    getViewportSize,
  };
}