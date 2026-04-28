import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useIsPhone } from '../hooks/use-is-phone';
import { Scrim } from '../Scrim/Scrim'; // Corrected casing
import { Toolbar, type ToolbarColorScheme } from '../Toolbar/Toolbar'; // Corrected casing & import Color Scheme
import { useCoverViewScroll } from './useCoverViewScroll'; // Import the custom hook

// Constants (adjust values as needed)
export const COVER_HEIGHT = 271;
export const APPBAR_HEIGHT = 64; // Corresponds to h-16
// const APPBARL_HEIGHT = 144; // Height related to hiding header content

export interface CoverViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to display below the header, within the scrollable area */
  children?: React.ReactNode;
  /** Optional node for the primary action, typically a button, placed top-left in the header */
  primaryAction?: React.ReactNode;
  /** Optional node for the secondary action, typically buttons, placed top-right in the header */
  secondaryAction?: React.ReactNode;
  /** Optional node for main header content, displayed below the title */
  header?: React.ReactNode;
  /** Main title text */
  title?: string;
  /** Optional URL for the cover background image */
  cover?: string;
  /** Whether the content area should be scrollable */
  scrollable?: boolean;
  /** Props to pass to the title h1 element */
  titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
  /**
   * The color scheme to apply to the CoverView and the fixed Toolbar.
   * @default 'background'
   */
  colorScheme?: ToolbarColorScheme;
  /** Show a loading indicator */
  loading?: boolean;
  /** Start in the minimal (scrolled) state and disable scroll effects */
  coverMinimal?: boolean;
  /** Start with the cover taking full viewport height */
  coverFullscreen?: boolean;
  /** Content to display sticky below the collapsed header */
  stickyContent?: React.ReactNode;
  /** Optional progress value (0-100) for the loading indicator */
  loadingProgress?: number;
}

/**
 * A component creating a cover view effect with a collapsing header.
 * On scroll, the header scrolls up, and on mobile, a fixed title bar appears.
 */
export const CoverView = React.forwardRef<HTMLDivElement, CoverViewProps>(
  (
    {
      children,
      primaryAction,
      secondaryAction,
      header,
      title,
      cover,
      scrollable = true,
      className,
      titleProps,
      colorScheme = 'background', // Default color scheme
      loading = false,
      coverMinimal = false,
      coverFullscreen = false,
      stickyContent,
      loadingProgress,
      ...props
    },
    ref
  ) => {
    const isPhone = useIsPhone();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null); // Ref for the actual viewport

    // Determine if scrolling effects should be active
    const scrollEffectsActive = scrollable && !coverMinimal && !coverFullscreen;

    // Get motion values from the custom hook
    const {
      scrollY, // Keep scrollY if needed for direct checks like pointerEvents
      headerTranslateY,
      headerContentOpacity,
      stickyTranslateY,
      mobileAppBarOpacity,
      mobileAppBarVisibility,
      headerContentVisibility,
      titleFontSize,
      titleFontWeight,
      titlePaddingLeft,
      titlePaddingRight,
      secondaryActionTranslateY,
      primaryActionTranslateY,
    } = useCoverViewScroll({
      showPrimaryAction: !!primaryAction,
      showSecondaryAction: !!secondaryAction,
      scrollViewportRef,
      coverMinimal,
    });

    const colorClasses = {
      background: 'bg-background text-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      card: 'bg-card text-card-foreground',
      transparent: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-full w-full flex-col bg-background overflow-hidden',
          className
        )}
        {...props}
      >
        {/* --- Fixed Mobile App Bar (Conditional styling) --- */}
        {isPhone && (
          <motion.div
            className="fixed left-0 top-0 z-20 h-16 w-full flex-shrink-0 shadow-md"
            style={{
              opacity: coverMinimal ? 1 : mobileAppBarOpacity,
              // Keep element in layout, use opacity to hide/show
              visibility: mobileAppBarVisibility,
            }}
          >
            <Toolbar
              colorScheme={colorScheme}
              className="h-full flex items-center justify-between px-4"
            >
              {/* Mobile Primary Action Area */}
              <motion.div
                className="flex-shrink-0"
                // Apply mobile-specific styles/motion if needed
                // style={{ opacity: primaryActionOpacity }} // Example
              >
                {primaryAction}
              </motion.div>

              {/* Mobile Title */}
              <h2
                className={cn(
                  'truncate text-lg font-semibold mx-4', // Added horizontal margin
                  colorScheme === 'background' && 'text-foreground',
                  colorScheme === 'primary' && 'text-primary-foreground',
                  colorScheme === 'secondary' && 'text-secondary-foreground',
                  colorScheme === 'accent' && 'text-accent-foreground',
                  colorScheme === 'card' && 'text-card-foreground'
                )}
              >
                {title}
              </h2>

              {/* Mobile Secondary Action Area */}
              <motion.div
                className="flex-shrink-0"
                // Apply mobile-specific styles/motion if needed
                // style={{ opacity: secondaryActionOpacity }} // Example
              >
                {secondaryAction}
              </motion.div>
            </Toolbar>
          </motion.div>
        )}

        {/* --- Scrolling Header (motion.div) --- */}
        <motion.div
          className={cn(
            'absolute left-0 right-0 top-0 z-30 flex flex-col shadow-sm',
            colorScheme !== 'transparent' && colorClasses[colorScheme]
          )}
          style={{
            // Calculate minHeight based on props
            minHeight: coverFullscreen ? '100vh' : coverMinimal ? APPBAR_HEIGHT : COVER_HEIGHT,
            // Apply Framer Motion transform if scroll effects active
            translateY: scrollEffectsActive ? headerTranslateY : 0,
            // Prevent interaction if fullscreen and not scrolled
            pointerEvents: coverFullscreen && scrollY.get() === 0 ? 'none' : 'auto',
            // Add transition for min-height
            transition: 'min-height 0.4s ease-in-out',
          }}
        >
          {/* Content INSIDE the transformed header (Scrim, actual text header, etc.) */}
          {cover && (
            <motion.div className="absolute inset-0 z-[-1]">
              <Scrim cover={cover} className="h-full w-full" />
            </motion.div>
          )}
          {/* Header Top Actions Area */}
          {!coverFullscreen && (primaryAction || secondaryAction) && (
            <div className="absolute left-0 top-0 z-10 flex h-16 w-full items-center justify-between px-1 pt-1">
              {/* Primary Action (Top Left) */}
              {primaryAction && (
                <motion.div
                  className="pointer-events-auto pl-4"
                  style={{
                    translateY: scrollEffectsActive ? primaryActionTranslateY : 0,
                  }}
                >
                  {primaryAction}
                </motion.div>
              )}
              {/* Spacer to push secondary action right */}
              <div className="flex-grow"></div>
              {/* Secondary Action (Top Right) */}
              {secondaryAction && (
                <motion.div
                  className="pointer-events-auto pr-4"
                  style={{
                    translateY: scrollEffectsActive ? secondaryActionTranslateY : 0, // Apply X translation
                  }}
                >
                  {secondaryAction}
                </motion.div>
              )}
            </div>
          )}

          <div className="flex flex-grow flex-col pt-16">
            {' '}
            {/* Keep pt-16 for spacing below actions */}
            <div className="relative flex flex-grow flex-col items-start justify-between p-6 pb-4 pt-0">
              {/* Removed old action placeholder */}
              <div className="h-0 flex-shrink-0">&nbsp;</div>
              {/* Header: Conditionally render and transition opacity */}
              {!coverFullscreen && (
                <motion.div
                  className={cn('pointer-events-none mb-2')}
                  // Use visibility to prevent interaction when hidden
                  style={{
                    opacity: scrollEffectsActive ? headerContentOpacity : 1,
                    // Ensure visibility syncs with opacity
                    visibility: headerContentVisibility,
                  }}
                >
                  {header}
                </motion.div>
              )}
              {(() => {
                // Separate style and className from other titleProps to avoid type conflicts
                const {
                  style: titleStyle,
                  className: titleClassName,
                  id: titleId,
                } = titleProps || {};

                return (
                  <motion.h1
                    id={titleId}
                    className={cn(
                      'text-3xl font-bold leading-tight pointer-events-none',
                      cover ||
                        colorScheme === 'primary' ||
                        colorScheme === 'secondary' ||
                        colorScheme === 'accent'
                        ? 'text-white drop-shadow-sm'
                        : colorScheme === 'card'
                          ? 'text-card-foreground'
                          : 'text-foreground',
                      titleClassName
                    )}
                    style={{
                      ...titleStyle,
                      fontSize: scrollEffectsActive ? titleFontSize : undefined,
                      fontWeight: scrollEffectsActive ? titleFontWeight : undefined,
                      paddingLeft: scrollEffectsActive ? titlePaddingLeft : undefined,
                      paddingRight: scrollEffectsActive ? titlePaddingRight : undefined,
                    }}
                  >
                    {title}
                  </motion.h1>
                );
              })()}
            </div>
          </div>
        </motion.div>

        {/* --- Sticky Content / Loader Container (Outside Header) --- */}
        {/* Render only if not fullscreen and either is loading or has sticky content */}
        {!coverFullscreen && (loading || stickyContent) && (
          <motion.div
            className="absolute left-0 right-0 top-0 w-full"
            style={{
              translateY: scrollEffectsActive ? stickyTranslateY : COVER_HEIGHT,
              // Need appropriate z-index
              zIndex: loading ? 25 : 20, // Below header (30), loader above sticky
            }}
          >
            {/* Non-Fullscreen Loader */}
            {loading && (
              <Progress
                value={loadingProgress ?? null}
                className={cn(
                  'h-1 w-full transition-all duration-300 ease-in-out'
                  // Add specific styles if needed when sticky
                )}
              />
            )}
            {/* Sticky Content */}
            {stickyContent && (
              <div className={loading ? 'mt-1' : ''}>
                {' '}
                {/* Add margin if loader is also present */}
                {stickyContent}
              </div>
            )}
          </motion.div>
        )}

        {/* --- Fullscreen Loader --- */}
        {loading && coverFullscreen && (
          <div className="absolute left-0 right-0 top-0 z-50 p-2 transition-all duration-300 ease-in-out">
            <Progress
              value={loadingProgress ?? null}
              className="h-2 rounded-full transition-all duration-300 ease-in-out"
            />
          </div>
        )}

        {/* --- Content Container (Flex-1 Wrapper) --- */}
        <div className="relative z-10 flex-1 overflow-hidden">
          {scrollable ? (
            <ScrollArea ref={scrollAreaRef} viewportRef={scrollViewportRef} className="h-full">
              <div className="h-full w-full rounded-[inherit]">
                {/* Spacer div matches initial header height */}
                <div
                  style={{
                    height: coverFullscreen ? '100vh' : coverMinimal ? APPBAR_HEIGHT : COVER_HEIGHT,
                  }}
                />
                {/* Add back the original padding */}
                <div className="p-6">
                  {/* Padding top is handled by the spacer div */}
                  {/* Conditionally render children only when not fullscreen */}
                  {!coverFullscreen && children}
                </div>
              </div>
            </ScrollArea>
          ) : (
            // Non-scrollable content also needs the top padding/spacer
            <div
              className={cn('h-full overflow-auto')} // Removed padding class here
            >
              <div
                style={{
                  height: coverFullscreen ? '100vh' : coverMinimal ? APPBAR_HEIGHT : COVER_HEIGHT,
                }}
              />
              {/* Add padding to content wrapper */}
              <div className="p-6">
                {/* Conditionally render children only when not fullscreen */}
                {!coverFullscreen && children}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CoverView.displayName = 'CoverView';
