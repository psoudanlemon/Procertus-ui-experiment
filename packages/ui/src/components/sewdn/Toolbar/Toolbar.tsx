import React from 'react';
import { cn } from '@/lib/utils'; // Assuming utils are setup in the target project

export type ToolbarColorScheme =
  | 'background'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'card'
  | 'transparent';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If `true`, disables the default horizontal padding.
   * @default false
   */
  disableGutters?: boolean;
  /**
   * The variant to use. `dense` is shorter.
   * @default 'regular'
   */
  variant?: 'regular' | 'dense';
  /**
   * The color scheme to apply, using ShadCN theme colors.
   * @default 'background'
   */
  colorScheme?: ToolbarColorScheme;
}

/**
 * A Toolbar component acts as a container for grouping items, typically used
 * within an AppBar. It applies standard horizontal padding (gutters),
 * height variants, and theme-based color schemes.
 */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      children,
      className,
      disableGutters = false,
      variant = 'regular',
      colorScheme = 'background',
      ...props
    },
    ref
  ) => {
    const colorClasses = {
      background: 'bg-background text-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      card: 'bg-card text-card-foreground',
      transparent: '', // No specific color classes for transparent
    };

    const toolbarClasses = cn(
      'flex items-center', // Base flex container styles
      // Height variants
      variant === 'regular' ? 'h-16' : 'h-12',
      // Padding
      !disableGutters && 'px-4 md:px-6',
      // Color scheme
      colorClasses[colorScheme],
      className // Allow overriding
    );

    return (
      <div ref={ref} className={toolbarClasses} {...props}>
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';
