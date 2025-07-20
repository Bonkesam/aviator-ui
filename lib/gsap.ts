import { gsap } from 'gsap';

// Register GSAP plugins (add more as needed)
if (typeof window !== 'undefined') {
  gsap.registerPlugin();
}

// Animation presets for consistent timing
export const GSAP_EASE = {
  // UI Animations
  smooth: "power2.out",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.5)",
  
  // Flight Animations
  takeoff: "power3.out",
  cruise: "none",
  landing: "power4.in",
  crash: "power4.out",
  
  // Mobile-optimized
  mobile: "power2.inOut",
} as const;

export const GSAP_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  flight: 3.0,
} as const;

// Animation utilities with proper TypeScript
export class GSAPAnimations {
  // UI entrance animations
  static fadeInUp(element: Element, delay: number = 0) {
    return gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: GSAP_DURATION.normal,
        ease: GSAP_EASE.smooth,
        delay
      }
    );
  }

  // Button press effect
  static buttonPress(element: Element) {
    return gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: GSAP_EASE.bounce
    });
  }

  // Loading pulse
  static pulse(element: Element) {
    return gsap.to(element, {
      scale: 1.1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: GSAP_EASE.smooth
    });
  }

  // Success celebration
  static celebrate(element: Element) {
    const tl = gsap.timeline();
    
    return tl
      .to(element, {
        scale: 1.2,
        rotation: 5,
        duration: 0.2,
        ease: GSAP_EASE.bounce
      })
      .to(element, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: GSAP_EASE.elastic
      });
  }

  // Error shake - FIXED TypeScript issue
  static shake(element: Element) {
    return gsap.timeline()
      .to(element, { x: "+=10", duration: 0.1 })
      .to(element, { x: "-=20", duration: 0.1 })
      .to(element, { x: "+=16", duration: 0.1 })
      .to(element, { x: "-=12", duration: 0.1 })
      .to(element, { x: "+=8", duration: 0.1 })
      .to(element, { x: "-=4", duration: 0.1 })
      .to(element, { x: 0, duration: 0.1 });
  }

  // Page transition
  static pageTransition(entering: Element, exiting?: Element) {
    const tl = gsap.timeline();

    if (exiting) {
      tl.to(exiting, {
        opacity: 0,
        x: -50,
        duration: GSAP_DURATION.fast,
        ease: GSAP_EASE.smooth
      });
    }

    return tl.fromTo(entering,
      { opacity: 0, x: 50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: GSAP_DURATION.normal,
        ease: GSAP_EASE.smooth 
      }
    );
  }

  // Mobile-specific animations
  static mobileSlideUp(element: Element) {
    return gsap.fromTo(element,
      { y: '100%', opacity: 0 },
      { 
        y: '0%', 
        opacity: 1, 
        duration: GSAP_DURATION.normal,
        ease: GSAP_EASE.mobile
      }
    );
  }

  // Flight-specific animations
  static planeTakeoff(element: Element, distance: number = 1000) {
    const tl = gsap.timeline();
    
    return tl
      .to(element, {
        x: distance * 0.3,
        y: -distance * 0.1,
        rotation: -5,
        duration: GSAP_DURATION.flight * 0.3,
        ease: GSAP_EASE.takeoff
      })
      .to(element, {
        x: distance * 0.8,
        y: -distance * 0.3,
        rotation: 0,
        duration: GSAP_DURATION.flight * 0.5,
        ease: GSAP_EASE.cruise
      })
      .to(element, {
        x: distance,
        y: -distance * 0.2,
        rotation: 5,
        duration: GSAP_DURATION.flight * 0.2,
        ease: GSAP_EASE.landing
      });
  }

  static multiplierHit(element: Element) {
    return gsap.timeline()
      .to(element, {
        scale: 1.5,
        rotation: 360,
        duration: 0.3,
        ease: GSAP_EASE.elastic
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: GSAP_EASE.bounce
      });
  }
}

// Utility for creating consistent timelines - EXPORTED PROPERLY
export function createTimeline(vars?: gsap.TimelineVars) {
  return gsap.timeline({
    defaults: {
      ease: GSAP_EASE.smooth,
      duration: GSAP_DURATION.normal
    },
    ...vars
  });
}

// hooks/useGSAP.ts
import { useRef, useEffect, RefObject } from 'react';

export function useGSAPRef<T extends Element = HTMLDivElement>(): RefObject<T | null> {
  return useRef<T>(null);
}

export function useGSAPAnimation(
  animationFn: (element: Element) => gsap.core.Tween | gsap.core.Timeline,
  deps: any[] = [],
  triggerImmediately: boolean = true
) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const trigger = () => {
    if (elementRef.current) {
      return animationFn(elementRef.current);
    }
  };

  useEffect(() => {
    if (triggerImmediately) {
      trigger();
    }
  }, deps);

  return { elementRef, trigger };
}

export function usePageTransition() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const transitionIn = () => {
    if (containerRef.current) {
      return GSAPAnimations.pageTransition(containerRef.current);
    }
  };

  const transitionOut = () => {
    if (containerRef.current) {
      return gsap.to(containerRef.current, {
        opacity: 0,
        x: -50,
        duration: GSAP_DURATION.fast,
        ease: GSAP_EASE.smooth
      });
    }
  };

  useEffect(() => {
    transitionIn();
  }, []);

  return { containerRef, transitionOut };
}

// Mobile-specific GSAP utilities
export class MobileGSAP {
  // Touch feedback
  static touchDown(element: Element) {
    return gsap.to(element, {
      scale: 0.98,
      duration: 0.1,
      ease: GSAP_EASE.mobile
    });
  }

  static touchUp(element: Element) {
    return gsap.to(element, {
      scale: 1,
      duration: 0.2,
      ease: GSAP_EASE.bounce
    });
  }

  // Optimized scroll animations
  static mobileScrollReveal(element: Element, threshold: number = 0.3) {
    return gsap.fromTo(element,
      { 
        opacity: 0, 
        y: 50,
        rotationX: 30
      },
      { 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        duration: GSAP_DURATION.normal,
        ease: GSAP_EASE.mobile,
        scrollTrigger: {
          trigger: element,
          start: `top ${100 - threshold * 100}%`,
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}