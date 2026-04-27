import * as React from 'react';
import { cn } from '@/lib/utils';
import { SnackbarContainer, SnackbarContainerProps } from '../Snackbar/SnackbarContainer';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  snackbarContainerProps?: Omit<SnackbarContainerProps, 'className'>;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, children, snackbarContainerProps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex h-full w-full flex-row overflow-hidden', className)}
        {...props}
      >
        {children}
        <SnackbarContainer {...snackbarContainerProps} />
      </div>
    );
  }
);

AppShell.displayName = 'AppShell';
