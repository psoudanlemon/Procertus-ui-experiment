'use client';

import * as React from 'react';

import {
  AlertDialogProvider,
  useAlert,
  useConfirm,
  type AlertDialogDispatch,
} from '@/components/ui/alert-dialog-provider';
import {
  DialogProvider,
  useDialog,
  type DialogDispatch,
} from '@/components/ui/dialog-provider';
import {
  SnackbarProvider,
  useSnackbar,
  type SnackbarContextType,
} from '../Snackbar/SnackbarProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

export type AppConfirmDispatch = {
  confirm: NonNullable<AlertDialogDispatch['confirm']>;
};

export type AppAlertDispatch = {
  showAlert: NonNullable<AlertDialogDispatch['alert']>;
};

export type AppContextValue = {
  confirm?: AppConfirmDispatch;
  alert?: AppAlertDispatch;
  dialog?: DialogDispatch;
  snackbar: SnackbarContextType;
};

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

function AppContextBridge({ children }: AppProviderProps) {
  const confirm = useConfirm();
  const alert = useAlert();
  const dialog = useDialog();
  const snackbar = useSnackbar();

  const value = React.useMemo<AppContextValue>(
    () => ({
      confirm: confirm ? { confirm } : undefined,
      alert: alert ? { showAlert: alert } : undefined,
      dialog,
      snackbar,
    }),
    [alert, confirm, dialog, snackbar],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <SnackbarProvider>
      <AlertDialogProvider>
        <DialogProvider>
          <AppContextBridge>{children}</AppContextBridge>
        </DialogProvider>
      </AlertDialogProvider>
    </SnackbarProvider>
  );
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
