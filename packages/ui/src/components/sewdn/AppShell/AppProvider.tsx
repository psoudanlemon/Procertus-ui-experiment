import * as React from 'react';
import {
  ConfirmProvider,
  useConfirm,
  type ConfirmState,
  type ConfirmDispatch,
} from './providers/confirm-provider';
import {
  DialogProvider,
  useDialog,
  type DialogState,
  type DialogDispatch,
} from './providers/dialog-provider';
import {
  AlertProvider,
  useAlert,
  type AlertState,
  type AlertDispatch,
} from './providers/alert-provider';
import { SnackbarProvider, useSnackbar } from '../Snackbar/SnackbarProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <SnackbarProvider>
      <AlertProvider>
        <DialogProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </DialogProvider>
      </AlertProvider>
    </SnackbarProvider>
  );
};

// Combined hook to access all contexts
export const useApp = () => {
  const confirm = useConfirm();
  const dialog = useDialog();
  const alert = useAlert();
  const snackbar = useSnackbar();

  return {
    confirm,
    dialog,
    alert,
    snackbar,
  };
};

export const appHooks = {
  useConfirm,
  useDialog,
  useAlert,
  useSnackbar,
};

// Export the types from the nested providers
export type {
  ConfirmState,
  ConfirmDispatch,
  DialogState,
  DialogDispatch,
  AlertState,
  AlertDispatch,
};

// Export Snackbar types
export type { SnackbarContextType } from '../Snackbar/SnackbarProvider';
