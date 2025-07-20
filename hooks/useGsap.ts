import { GSAP_DURATION, GSAP_EASE, GSAPAnimations } from '@/lib/gsap';
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
