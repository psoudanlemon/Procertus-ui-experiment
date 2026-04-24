import * as React from "react";

export type PrototypeSessionValue = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const PrototypeSessionContext = React.createContext<PrototypeSessionValue | null>(null);
