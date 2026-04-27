import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Panel } from './Panel'; // Internal component for rendering panels
import type { PanelsProps } from './types';

// Wrap with forwardRef to accept the ref
export const Panels = React.forwardRef<HTMLDivElement, PanelsProps>(
  (
    {
      children,
      calculatedPanels,
      displayMode,
      totalVisibleWidth,
      removePanel,
      activateStackedPanel,
      mainViewMinWidth, // Still needed for main view style calc
      containerWidth, // Still needed for main view style calc
      className, // Get className from props
      ...props // Pass any remaining div props
    },
    ref // Accept the ref
  ) => {
    // Calculate available width for the main view in docked mode
    const mainViewAvailableWidth = containerWidth - totalVisibleWidth;
    const mainViewStyle =
      displayMode === 'docked'
        ? {
            minWidth: `${mainViewMinWidth}px`,
            width: `${Math.max(mainViewMinWidth, mainViewAvailableWidth)}px`,
            flexShrink: 0,
          }
        : { width: '100%' }; // Overlay mode takes full width

    return (
      <div
        ref={ref} // Attach the ref to the root div
        className={cn(
          'detail-panels-layout flex w-full overflow-hidden',
          className // Use className from props
        )}
        {...props}
      >
        {/* Main View Area */}
        <div className="detail-panels-main-view h-full overflow-auto" style={mainViewStyle}>
          {children}
        </div>

        {/* Panels Area (Docked) */}
        {displayMode === 'docked' && (
          <div
            className="detail-panels-panels-area relative h-full flex-shrink-0"
            style={{ width: `${totalVisibleWidth}px` }}
          >
            <AnimatePresence mode="popLayout">
              {calculatedPanels.map(panel => (
                <Panel
                  key={panel.id}
                  panel={panel}
                  onClose={removePanel} // Pass down from props
                  onActivate={activateStackedPanel} // Pass down from props
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Overlay Panels */}
        {displayMode === 'overlay' && (
          <AnimatePresence mode="popLayout">
            {calculatedPanels.map(panel => (
              <Panel
                key={panel.id}
                panel={panel}
                onClose={removePanel} // Pass down from props
                onActivate={activateStackedPanel} // Pass down from props
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    );
  }
);

Panels.displayName = 'Panels'; // Add display name for DevTools
