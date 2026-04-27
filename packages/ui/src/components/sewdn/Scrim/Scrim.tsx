import React, { useMemo } from 'react';
import { cn } from '@/lib/utils'; // Assuming utils are setup in the target project

// Define variants
export type ScrimVariant = 'light' | 'default' | 'dark';

export interface ScrimProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional URL for a background image.
   */
  cover?: string;
  /**
   * Controls the darkness of the gradient.
   * @default 'default'
   */
  variant?: ScrimVariant;
}

// Helper function to generate gradient stops based on a power function curve
const generatePowerGradient = (
  maxOpacity: number,
  power: number, // Added power parameter
  steps: number = 10
): string => {
  let stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const percentage = (i / steps) * 100;
    const x = (100 - percentage) / 100; // Normalize percentage (0=top, 1=bottom)
    // Use power function: opacity = maxOpacity * x^power
    const opacity = maxOpacity * Math.pow(x, power);
    const clampedOpacity = Math.min(opacity, maxOpacity);
    stops.push(`hsla(0, 0%, 0%, ${clampedOpacity.toFixed(3)}) ${percentage.toFixed(1)}%`);
  }
  return `linear-gradient(to top, ${stops.join(', ')})`;
};

// Keep default static
const gradientDefault = `linear-gradient(to top, hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.738) 19%, hsla(0, 0%, 0%, 0.541) 34%, hsla(0, 0%, 0%, 0.382) 47%, hsla(0, 0%, 0%, 0.278) 56.5%, hsla(0, 0%, 0%, 0.194) 65%, hsla(0, 0%, 0%, 0.126) 73%, hsla(0, 0%, 0%, 0.075) 80.2%, hsla(0, 0%, 0%, 0.042) 86.1%, hsla(0, 0%, 0%, 0.021) 91%, hsla(0, 0%, 0%, 0.008) 95.2%, hsla(0, 0%, 0%, 0.002) 98.2%, hsla(0, 0%, 0%, 0) 100%)`;

// Removed static gradientLight and gradientDark definitions

/**
 * A component that renders an overlay scrim with controllable darkness variants,
 * using dynamically generated gradients based on a power function.
 */
export const Scrim = React.forwardRef<HTMLDivElement, ScrimProps>(
  ({ cover, className, style, variant = 'default', ...props }, ref) => {
    const selectedGradient = useMemo(() => {
      switch (variant) {
        case 'light':
          // Generate light gradient (max 40% opacity, quadratic power=2)
          return generatePowerGradient(0.4, 2, 10);
        case 'dark':
          // Generate dark gradient (max 100% opacity, power=1.3)
          return generatePowerGradient(1.0, 1.3, 10);
        case 'default':
        default:
          return gradientDefault;
      }
    }, [variant]);

    // Reverse the order: Gradient first (on top), then image
    const backgroundImage = cover ? `${selectedGradient}, url(${cover})` : selectedGradient;

    const backgroundStyles: React.CSSProperties = {
      backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      // Merge with any existing style props
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('absolute inset-0 z-0 h-full w-full', className)}
        style={backgroundStyles}
        {...props}
      />
    );
  }
);
Scrim.displayName = 'Scrim';
