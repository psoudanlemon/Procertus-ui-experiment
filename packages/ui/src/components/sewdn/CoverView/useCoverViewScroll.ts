import type { RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';

import { APPBAR_HEIGHT, COVER_HEIGHT } from './CoverView';

// Constants for collapsed state positioning (adjust as needed)

interface UseCoverViewScrollProps {
  scrollViewportRef: RefObject<HTMLDivElement | null>;
  coverMinimal: boolean;
  showPrimaryAction?: boolean; // Updated prop
  showSecondaryAction?: boolean; // Updated prop
}

interface CoverViewScrollValues {
  scrollY: MotionValue<number>;
  headerTranslateY: MotionValue<number>;
  headerContentOpacity: MotionValue<number>;
  stickyTranslateY: MotionValue<number>;
  mobileAppBarOpacity: MotionValue<number>;
  mobileAppBarVisibility: MotionValue<'visible' | 'hidden'>;
  headerContentVisibility: MotionValue<'visible' | 'hidden'>;
  titleFontSize: MotionValue<string>;
  titleFontWeight: MotionValue<number>;
  titlePaddingLeft: MotionValue<string>;
  titlePaddingRight: MotionValue<string>;
  primaryActionTranslateY: MotionValue<number>;
  secondaryActionTranslateY: MotionValue<number>;
}

export function useCoverViewScroll({
  scrollViewportRef,
  coverMinimal,
  showPrimaryAction = false,
  showSecondaryAction = false,
}: UseCoverViewScrollProps): CoverViewScrollValues {
  const SCROLL_RANGE_START = 0;
  const SCROLL_RANGE_END = COVER_HEIGHT - APPBAR_HEIGHT;
  const COLLAPSED_ACTION_PADDING_Y = COVER_HEIGHT - 65;

  // Framer Motion scroll setup
  const { scrollY } = useScroll({
    container: scrollViewportRef, // Target the viewport directly
  });

  // --- Transforms --- //
  const headerTranslateY = useTransform(
    scrollY,
    [SCROLL_RANGE_START, SCROLL_RANGE_END],
    [0, -(COVER_HEIGHT - APPBAR_HEIGHT)],
    { clamp: true }
  );

  // Opacity for header content AND actions (fade out together)
  const headerContentOpacity = useTransform(
    scrollY,
    [SCROLL_RANGE_START, SCROLL_RANGE_END * 0.8], // Start fading earlier
    [1, 0],
    { clamp: true }
  );

  const stickyTranslateY = useTransform(
    scrollY,
    [SCROLL_RANGE_START, SCROLL_RANGE_END],
    [COVER_HEIGHT, APPBAR_HEIGHT],
    { clamp: true }
  );

  // --- Mobile App Bar Opacity --- //
  const mobileAppBarOpacity = useTransform(
    scrollY,
    [SCROLL_RANGE_END * 0.5, SCROLL_RANGE_END],
    [0, 1],
    { clamp: true }
  );

  // --- Stuck State Style Transforms --- //
  const titleFontSize = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    ['2.25rem', '1.125rem'] // text-3xl -> text-lg
  );
  const titleFontWeight = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    [700, 800] // font-bold -> font-extrabold
  );

  // Adjust title padding based on primary action presence
  const titlePaddingLeft = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    // Start with 0 padding, move to ~2rem if primary action exists
    ['0rem', showPrimaryAction ? '3rem' : '0rem']
  );

  // Adjust title padding based on primary action presence
  const titlePaddingRight = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    // Start with 0 padding, move to ~2rem if sewcondary action exists
    ['0rem', showSecondaryAction ? '2rem' : '0rem']
  );

  // --- Action Horizontal Translation --- //
  // Primary action moves from left edge (0) towards the collapsed padding
  const primaryActionTranslateY = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    [0, COLLAPSED_ACTION_PADDING_Y] // Target final X position
  );
  // Secondary action moves from right edge (0) towards the collapsed padding (negative)
  const secondaryActionTranslateY = useTransform(
    scrollY,
    [0, SCROLL_RANGE_END],
    [0, COLLAPSED_ACTION_PADDING_Y] // Target final X position (negative)
  );

  // --- Visibility Transforms (Derived from Opacity) --- //
  const mobileAppBarVisibility = useTransform(mobileAppBarOpacity, val =>
    coverMinimal || val > 0 ? 'visible' : 'hidden'
  );

  // Header content visibility (including actions inside scrolling header)
  const headerContentVisibility = useTransform(headerContentOpacity, val =>
    coverMinimal || val > 0 ? 'visible' : 'hidden'
  );

  return {
    scrollY,
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
    primaryActionTranslateY,
    secondaryActionTranslateY,
  };
}
