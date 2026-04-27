import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// State for confirm dialog
export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
}

export interface ConfirmDispatch {
  confirm: (title: string, message: string) => Promise<boolean>;
}

// Context for confirm dialog management
const ConfirmContext = React.createContext<ConfirmDispatch | undefined>(undefined);

export interface ConfirmProviderProps {
  children: React.ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [confirmState, setConfirmState] = React.useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const confirm = React.useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      setConfirmState({
        isOpen: true,
        title,
        message,
      });

      // Store the resolve function to call when dialog is closed
      const handleConfirm = (confirmed: boolean) => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        resolve(confirmed);
      };

      // @ts-ignore - We're storing the resolve function for later use
      setConfirmState(prev => ({ ...prev, onConfirm: handleConfirm }));
    });
  }, []);

  const handleClose = () => {
    // @ts-ignore - Call the stored resolve function with false (cancel)
    if (confirmState.onConfirm) confirmState.onConfirm(false);
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    // @ts-ignore - Call the stored resolve function with true (confirm)
    if (confirmState.onConfirm) confirmState.onConfirm(true);
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={confirmState.isOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmState.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">{confirmState.message}</div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

// Hook for using confirmation dialogs
export const useConfirm = () => {
  return React.useContext(ConfirmContext);
};
