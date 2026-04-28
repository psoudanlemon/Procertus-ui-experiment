'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Snackbar } from './Snackbar';
import { useSnackbar } from './SnackbarProvider';

export interface SnackbarContainerProps {
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  className?: string;
  snackbarClassName?: string;
  maxWidth?: string;
  maxVisible?: number;
  stackOffset?: number;
  stackScale?: number;
  stackOpacityFactor?: number;
}

export function SnackbarContainer({
  position = 'bottom',
  align = 'center',
  className,
  snackbarClassName,
  maxWidth = 'max-w-md',
  maxVisible = 3,
  stackOffset = 12,
  stackScale = 0.95,
  stackOpacityFactor = 0.95,
}: SnackbarContainerProps) {
  const { snackbars, removeSnackbar } = useSnackbar();
  const totalSnackbars = snackbars.length;

  const positionClasses = cn(
    'pointer-events-none fixed z-[100] flex p-4',
    position === 'top' ? 'top-0 flex-col' : 'bottom-0 flex-col-reverse',
    align === 'left' ? 'left-0 items-start' : align === 'right' ? 'right-0 items-end' : 'inset-x-0 items-center',
    className,
  );

  return (
    <div className={positionClasses}>
      <AnimatePresence initial={false}>
        {snackbars.map((snackbar, index) => {
          const reverseIndex = totalSnackbars - 1 - index;
          const isInOverlapZone = reverseIndex >= maxVisible;
          const overlapDepth = isInOverlapZone ? reverseIndex - maxVisible + 1 : 0;
          const estimatedSingleItemSpacing = 75;
          const yOffset =
            (position === 'top' ? 1 : -1) *
            (isInOverlapZone
              ? (maxVisible - 1) * estimatedSingleItemSpacing + overlapDepth * stackOffset
              : reverseIndex * estimatedSingleItemSpacing);
          const scale = isInOverlapZone ? Math.pow(stackScale, overlapDepth) : 1;
          const opacity = isInOverlapZone ? Math.pow(stackOpacityFactor, overlapDepth) : 1;

          return (
            <motion.div
              key={snackbar.id}
              layout
              initial={{ opacity: 0, y: position === 'top' ? -30 : 30, scale: 0.9 }}
              animate={{
                opacity,
                y: yOffset,
                scale,
                transition: { type: 'spring', stiffness: 350, damping: 30 },
              }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto absolute min-w-[300px]"
              style={{ zIndex: totalSnackbars - reverseIndex }}
            >
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
