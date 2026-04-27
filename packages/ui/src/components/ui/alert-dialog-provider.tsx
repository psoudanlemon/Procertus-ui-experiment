"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertResolver = () => void;
type ConfirmResolver = (value: boolean) => void;

interface AlertDialogState {
  isOpen: boolean;
  kind: "alert" | "confirm";
  title: string;
  message: string;
}

export interface AlertDialogDispatch {
  /** Show a single-button informational dialog. Resolves when dismissed. */
  alert: (title: string, message: string) => Promise<void>;
  /** Show a confirm/cancel dialog. Resolves to `true` on confirm, `false` on cancel. */
  confirm: (title: string, message: string) => Promise<boolean>;
}

const AlertDialogContext = React.createContext<AlertDialogDispatch | undefined>(undefined);

export interface AlertDialogProviderProps {
  children: React.ReactNode;
}

/**
 * Imperative wrappers around the {@link AlertDialog} primitive: descendants
 * can call `await alert(...)` or `await confirm(...)` instead of managing
 * local state + JSX. Both share a single overlay so only one is open at a time.
 */
export const AlertDialogProvider = ({ children }: AlertDialogProviderProps) => {
  const [state, setState] = React.useState<AlertDialogState>({
    isOpen: false,
    kind: "alert",
    title: "",
    message: "",
  });
  const resolverRef = React.useRef<AlertResolver | ConfirmResolver | null>(null);

  const close = React.useCallback((value: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolve) {
      // Both alert and confirm resolvers accept the boolean (alert ignores it).
      (resolve as ConfirmResolver)(value);
    }
  }, []);

  const alert = React.useCallback((title: string, message: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      resolverRef.current = resolve as AlertResolver;
      setState({ isOpen: true, kind: "alert", title, message });
    });
  }, []);

  const confirm = React.useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve as ConfirmResolver;
      setState({ isOpen: true, kind: "confirm", title, message });
    });
  }, []);

  return (
    <AlertDialogContext.Provider value={{ alert, confirm }}>
      {children}
      <AlertDialog
        open={state.isOpen}
        onOpenChange={(open) => {
          if (!open) close(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state.kind === "confirm" && (
              <AlertDialogCancel onClick={() => close(false)}>Cancel</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={() => close(true)}>
              {state.kind === "confirm" ? "Confirm" : "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => React.useContext(AlertDialogContext);

/** Shorthand for `useAlertDialog()?.alert`. */
export const useAlert = () => useAlertDialog()?.alert;

/** Shorthand for `useAlertDialog()?.confirm`. */
export const useConfirm = () => useAlertDialog()?.confirm;
