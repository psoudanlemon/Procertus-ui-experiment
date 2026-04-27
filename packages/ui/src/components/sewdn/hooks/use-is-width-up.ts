import { useEffect, useState } from 'react';

/** Aligns with common Tailwind-style breakpoints (px). */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Custom hook to check if the current viewport width is greater than a specified breakpoint
 */
export function useIsWidthUp(breakpoint: Breakpoint): boolean {
  const [isUp, setIsUp] = useState<boolean>(false);

  useEffect(() => {
    const checkWidth = () => {
      const currentWidth = window.innerWidth;
      setIsUp(currentWidth >= BREAKPOINT_VALUES[breakpoint]);
    };

    // Check immediately
    checkWidth();

    // Listen for window resize events
    window.addEventListener('resize', checkWidth);

    // Clean up
    return () => window.removeEventListener('resize', checkWidth);
  }, [breakpoint]);

  return isUp;
}
