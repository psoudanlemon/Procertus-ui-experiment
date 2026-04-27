import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// State for alert dialog
export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
}

export interface AlertDispatch {
  showAlert: (title: string, message: string) => Promise<void>;
}

// Context for alert management
const AlertContext = React.createContext<AlertDispatch | undefined>(undefined);

export interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alert, setAlert] = React.useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const showAlert = React.useCallback((title: string, message: string): Promise<void> => {
    return new Promise<void>(resolve => {
      setAlert({
        isOpen: true,
        title,
        message,
      });

      // Store the resolve function to call when dialog is closed
      const handleClose = () => {
        setAlert(prev => ({ ...prev, isOpen: false }));
        resolve();
      };

      // @ts-ignore - We're storing the resolve function for later use
      setAlert(prev => ({ ...prev, onClose: handleClose }));
    });
  }, []);

  const handleClose = () => {
    // @ts-ignore - Call the stored resolve function
    if (alert.onClose) alert.onClose();
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Dialog
        open={alert.isOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{alert.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">{alert.message}</div>
          <DialogFooter>
            <Button onClick={handleClose}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AlertContext.Provider>
  );
};

// Hook for using alerts
export const useAlert = () => {
  return React.useContext(AlertContext);
};
