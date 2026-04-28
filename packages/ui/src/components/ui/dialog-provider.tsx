"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DialogState {
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: React.ReactNode;
}

export interface DialogOptions extends Omit<DialogState, "isOpen"> {
  onConfirm?: () => void;
}

export interface DialogDispatch {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = React.createContext<DialogDispatch | undefined>(undefined);

export interface DialogProviderProps {
  children: React.ReactNode;
}

/**
 * Imperative wrapper around the {@link Dialog} primitive: lets descendants
 * call `openDialog({ title, content })` from anywhere via {@link useDialog}
 * instead of managing local state + JSX.
 */
export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialog, setDialog] = React.useState<DialogState>({ isOpen: false });

  const openDialog = React.useCallback((options: DialogOptions) => {
    setDialog({ ...options, isOpen: true });
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={dialog.isOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent>
          {dialog.title && (
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              {dialog.description && (
                <DialogDescription>{dialog.description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {dialog.content}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => React.useContext(DialogContext);
