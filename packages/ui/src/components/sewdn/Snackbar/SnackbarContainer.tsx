'use client';

import { useSnackbar } from './SnackbarProvider';
import { Snackbar } from './Snackbar';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SnackbarContainerProps {
  // Define props for container positioning and styling
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  className?: string;
  snackbarClassName?: string; // Optional class for individual snackbars
  maxWidth?: string; // Optional max-width for individual snackbars
  maxVisible?: number; // Max number of snackbars visible at once
  stackOffset?: number; // Offset in pixels for stacked items
  stackScale?: number; // Scale factor for stacked items
  stackOpacityFactor?: number; // Opacity factor for stacked items (0-1)
}

export function SnackbarContainer({
  position = 'bottom',
  align = 'center',
  className,
  snackbarClassName,
  maxWidth = 'max-w-md', // Default max-width for snackbars
  maxVisible = 3, // Default max visible
  stackOffset = 12, // Default offset
  stackScale = 0.95, // Default scale
  stackOpacityFactor = 0.95, // Default opacity factor
}: SnackbarContainerProps) {
  const { snackbars, removeSnackbar } = useSnackbar();
  const totalSnackbars = snackbars.length;

  // Determine container position classes
  const positionClasses = cn(
    'fixed z-[100] flex p-4 pointer-events-none',
    // Vertical position
    position === 'top' ? 'top-0' : 'bottom-0',
    // Horizontal alignment and flex direction
    align === 'left'
      ? 'left-0 items-start'
      : align === 'right'
        ? 'right-0 items-end'
        : 'inset-x-0 items-center',
    // Flex direction based on position for stacking
    position === 'top' ? 'flex-col' : 'flex-col-reverse',
    className
  );

  return (
    <div className={positionClasses}>
      <AnimatePresence initial={false}>
        {snackbars.map((snackbar, index) => {
          const reverseIndex = totalSnackbars - 1 - index; // 0 = newest
          const estimatedSingleItemSpacing = 75; // Estimate needed for non-overlapping stack (tune this!)

          // Determine if this snackbar should be part of the overlapping stack
          const isInOverlapZone = reverseIndex >= maxVisible;
          // Calculate depth into the overlap zone (1 for the first overlapping item)
          const overlapDepth = isInOverlapZone ? reverseIndex - maxVisible + 1 : 0;

          let yOffset: number;
          let scale: number;
          let opacity: number; // Add opacity variable

          if (isInOverlapZone) {
            // Calculate position of the last non-overlapping item
            const lastVisibleYOffset = (maxVisible - 1) * estimatedSingleItemSpacing;
            // Add overlap based on depth
            yOffset = lastVisibleYOffset + overlapDepth * stackOffset;
            scale = Math.pow(stackScale, overlapDepth);
            opacity = Math.pow(stackOpacityFactor, overlapDepth); // Calculate opacity
          } else {
            // Normal stacking position
            yOffset = reverseIndex * estimatedSingleItemSpacing;
            scale = 1;
            opacity = 1; // Full opacity for visible items
          }

          // Adjust yOffset sign based on screen position
          yOffset = position === 'top' ? yOffset : -yOffset;

          // Dynamic animation properties - all items are visible
          const animateProps = {
            opacity: opacity, // Use calculated opacity
            y: yOffset,
            scale: scale,
            transition: {
              type: 'spring' as const,
              stiffness: 350,
              damping: 30,
            },
          };

          return (
            <motion.div
              key={snackbar.id}
              layout // Enable layout animations for vertical stacking
              initial={{ opacity: 0, y: position === 'top' ? -30 : 30, scale: 0.9 }}
              animate={animateProps}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={cn(
                'min-w-[300px] pointer-events-auto absolute' // Absolute positioning, clickable, NO w-full
                // Margins are less relevant for absolute positioning, but keep for initial calc?
                // position === 'top' ? 'mb-2' : 'mt-2'
              )}
              style={{ zIndex: totalSnackbars - reverseIndex }} // Ensure newer items are visually on top
            >
              {/* Render the actual Snackbar component */}
              <Snackbar
                {...snackbar}
                className={cn(maxWidth, snackbarClassName)}
                onDismiss={removeSnackbar}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
