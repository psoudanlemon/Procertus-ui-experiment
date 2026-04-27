import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

type ButtonProps = React.ComponentProps<typeof Button>;
type IconComponent = React.ComponentType<{ className?: string }>;

// Define CVA variants primarily for IconButton SIZE and base interactive states
const iconButtonVariants = cva(
  // Base interactive styles (focus, disabled) & shape
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        // Combine button dimensions and icon size override for each variant
        sm: 'h-7 w-7 [&_svg]:size-4', // Button: h-7 w-7, Icon: h-4 w-4
        md: 'h-9 w-9 [&_svg]:size-5', // Button: h-9 w-9, Icon: h-5 w-5
        lg: 'h-11 w-11 [&_svg]:size-6', // Button: h-11 w-11, Icon: h-6 w-6
      },
      // Color logic is removed from here and handled conditionally below
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Define the props for IconButton
// Inherit ButtonProps (excluding conflicting size/children)
// Inherit CVA variants (provides 'size' prop)
export interface IconButtonProps
  extends Omit<ButtonProps, 'size' | 'children' | 'variant'>, // Exclude base button size and variant handled differently
    VariantProps<typeof iconButtonVariants> {
  // Include CVA size prop
  /**
   * If true, applies styling suitable for dark backgrounds,
   * adapting to the selected button 'variant'.
   * @default false
   */
  invertColors?: boolean;
  /**
   * The icon component type.
   */
  icon: IconComponent;
  /**
   * Optional class name specifically for the icon element.
   * Note: Icon size is controlled by the main 'size' prop.
   */
  iconClassName?: string;
  /**
   * Controls the button's visual style (ghost, outline, etc.).
   * This is passed directly to the underlying Shadcn Button.
   * @default 'ghost'
   */
  variant?: ButtonProps['variant']; // Keep variant prop, but pass it to base Button
}

// Removed the manual size mappings as CVA handles them

/**
 * IconButton: A pre-styled button optimized for icons using CVA.
 * Takes an 'icon' prop and manages button/icon sizing via its 'size' prop.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className, // General className for the button
      icon: Icon,
      iconClassName, // Specific className for the icon
      variant = 'ghost', // Appearance variant for the base Button
      size, // CVA size prop (sm, md, lg)
      invertColors, // CVA invertColors prop (boolean)
      // Note: `variant` is passed to base Button, `invertColors` modifies styles conditionally
      ...props
    },
    ref
  ) => {
    return (
      // Use the base Button component for its variant styles (ghost, etc.)
      // and accessibility features, but control sizing and base styles via CVA.
      <Button
        ref={ref}
        variant={variant} // Pass appearance variant to base Button
        // Generate className from CVA based on size, merge with user's className
        // AND conditionally add inverted color overrides if needed
        className={cn(
          iconButtonVariants({ size }), // Apply CVA size/shape/base styles
          invertColors &&
            // Define overrides for handled variants, use undefined for others
            (
              {
                // Inverted styles defined for all major variants
                ghost:
                  'text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 focus-visible:ring-primary-foreground',
                outline:
                  'bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 focus-visible:ring-primary-foreground border-input',
                default: 'bg-primary-foreground text-primary shadow hover:bg-primary-foreground/90',
                destructive:
                  'bg-destructive-foreground text-destructive shadow-sm hover:bg-destructive-foreground/90',
                secondary:
                  'bg-secondary-foreground text-secondary shadow-sm hover:bg-secondary-foreground/80',
                link: 'text-primary-foreground hover:underline focus-visible:ring-primary-foreground',
              } as const satisfies Record<NonNullable<ButtonProps['variant']>, string | undefined>
            )[variant || 'ghost'],
          className // Apply user's custom classes last
        )}
        {...props} // Pass remaining ButtonProps (like onClick, aria-label, disabled, etc.)
      >
        {/* Icon size is now controlled by the button's [&_svg] styles from CVA */}
        <Icon className={cn(iconClassName)} />
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
