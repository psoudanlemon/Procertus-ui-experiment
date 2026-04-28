import * as React from 'react';
import { AppProvider, type AppProviderProps } from './AppProvider';
import { AppShell, type AppShellProps } from './AppShell';

// Combine AppProviderProps and relevant AppShellProps for AppLayout
export interface AppLayoutProps
  extends Omit<AppProviderProps, 'children'>,
    Pick<AppShellProps, 'snackbarContainerProps'> {
  // Pick relevant props from AppShell
  children: React.ReactNode;
  className?: string; // className for the AppShell
}

/**
 * Convenience component combining AppProvider and the AppShell component.
 * It simplifies the setup required to use the application shell features.
 */
export const AppLayout = ({
  children,
  className,
  snackbarContainerProps, // Destructure new prop
  ...providerProps
}: AppLayoutProps) => {
  return (
    <AppProvider {...providerProps}>
      {/* Pass className and snackbar props to the AppShell */}
      <AppShell className={className} snackbarContainerProps={snackbarContainerProps}>
        {children}
      </AppShell>
    </AppProvider>
  );
};

AppLayout.displayName = 'AppLayout';
