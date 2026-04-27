import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// State for dialog management
export interface DialogState {
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: React.ReactNode;
}

export interface DialogOptions extends Omit<DialogState, 'isOpen'> {
  onConfirm?: () => void;
}

export interface DialogDispatch {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

// Context for dialog state
const DialogContext = React.createContext<DialogDispatch | undefined>(undefined);

export interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialog, setDialog] = React.useState<DialogState>({
    isOpen: false,
  });

  const openDialog = React.useCallback((options: DialogOptions) => {
    setDialog({ ...options, isOpen: true });
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={dialog.isOpen}
        onOpenChange={open => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent>
          {dialog.title && (
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              {dialog.description && <DialogDescription>{dialog.description}</DialogDescription>}
            </DialogHeader>
          )}
          {dialog.content}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

// Hook for using dialogs
export const useDialog = () => {
  return React.useContext(DialogContext);
};
