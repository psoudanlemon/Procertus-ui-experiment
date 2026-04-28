import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { PanelsProvider, PanelsContext } from './PanelsProvider'; // Assuming context exported from provider file
import { Panels as PanelsPresentational } from './Panels'; // The presentational component
import type { PersistenceLayer } from './persistence';
import type { PanelsConfigProps } from './types'; // Import the common config type

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => setWidth(element.getBoundingClientRect().width);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}

// --- Use PanelsConfigProps for Layout Props ---
type PanelsLayoutProps<TPanelRegistry extends Record<string, ComponentType<any>>> =
  PanelsConfigProps & {
    // Include common config props
    persistenceLayer?: PersistenceLayer;
    children: React.ReactNode; // Main view content passed by the user
    panelTypes: TPanelRegistry;
    className?: string; // Optional class name for the root div
    // No need to re-list optional props like panelWidth, they are in PanelsConfigProps
  };

/**
 * Internal component that consumes context and renders the presentational component.
 * Now also forwards the ref to the presentational component.
 */
const PanelsLayoutRenderer = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
  }
>(({ children, className }, ref) => {
  // Infer registry type from context if possible, otherwise use 'any'
  // This might require adjusting how the context is typed or consumed
  const context = useContext(PanelsContext); // Use untyped context for now

  if (!context) {
    // This should technically not happen if used correctly within the layout
    console.error(
      'PanelsLayoutRenderer: Context is missing. Ensure it is rendered within PanelsProvider.'
    );
    return null;
  }

  // Destructure ONLY what's needed by PanelsPresentational
  const {
    calculatedPanels,
    displayMode,
    totalVisibleWidth,
    removePanel,
    activateStackedPanel,
    mainViewMinWidth,
    containerWidth,
  } = context;

  // Props needed by the presentational Panels component
  const presentationalProps = {
    calculatedPanels,
    displayMode,
    totalVisibleWidth,
    removePanel,
    activateStackedPanel,
    mainViewMinWidth: mainViewMinWidth ?? 300,
    containerWidth: containerWidth ?? 0,
    className,
  };

  return (
    // Pass the forwarded ref here
    <PanelsPresentational ref={ref} {...presentationalProps}>
      {children}
    </PanelsPresentational>
  );
});
PanelsLayoutRenderer.displayName = 'PanelsLayoutRenderer';

/**
 * Convenience component combining PanelsProvider and the presentational
 * Panels component. Manages width measurement internally.
 * Accepts a ref that will be attached to the root measuring element.
 */
export const PanelsLayout = React.forwardRef<
  HTMLDivElement, // Forwarding div ref
  // Use a specific type or keep 'any' if registry type isn't critical here
  PanelsLayoutProps<Record<string, ComponentType<any>>>
>(({ children, persistenceLayer, panelTypes, className, ...configProps }, forwardedRef) => {
  // Ref for the root element to measure width
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useImperativeHandle to merge refs if the forwardedRef needs control
  // For now, we'll just use the internal ref for measurement
  React.useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement);

  // Measure the width of the container - Explicitly cast the ref type
  const containerWidth = useElementWidth(containerRef);

  // Props for the Provider, including the measured width
  const providerProps = {
    persistenceLayer,
    panelTypes,
    containerWidth,
    ...configProps,
  };

  return (
    // Pass the correct generic type to the provider
    <PanelsProvider<Record<string, ComponentType<any>>> {...providerProps}>
      {/* Render the helper which consumes context and renders the UI */}
      {/* Attach the measuring ref to the renderer, which forwards it */}
      <PanelsLayoutRenderer ref={containerRef} className={className}>
        {children}
      </PanelsLayoutRenderer>
    </PanelsProvider>
  );
});
PanelsLayout.displayName = 'PanelsLayout';
