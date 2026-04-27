import { useMedia } from 'react-use';

// Define a common breakpoint for mobile devices (adjust as needed)
const MOBILE_BREAKPOINT = '(max-width: 768px)';

/**
 * Custom hook to determine if the current viewport matches mobile dimensions.
 * Uses `react-use`'s `useMedia` hook.
 *
 * @returns {boolean} True if the viewport width is below the mobile breakpoint, false otherwise.
 */
export const useIsPhone = (): boolean => {
  const isMobile = useMedia(MOBILE_BREAKPOINT);
  return isMobile;
};
