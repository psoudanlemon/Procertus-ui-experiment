import * as React from "react";

import type { MockPrototypeSession, MockPrototypeUser } from "../types/mock-prototype-user";

export type MockPrototypeAuthContextValue = {
  users: MockPrototypeUser[];
  session: MockPrototypeSession | null;
  isAuthenticated: boolean;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  login: (userId?: string) => void;
  logout: () => void;
};

export const MockPrototypeAuthContext = React.createContext<MockPrototypeAuthContextValue | undefined>(
  undefined,
);

export function useMockPrototypeAuthContext(): MockPrototypeAuthContextValue {
  const ctx = React.useContext(MockPrototypeAuthContext);
  if (ctx === undefined) {
    throw new Error("Mock prototype auth hooks must be used within MockPrototypeAuthProvider");
  }
  return ctx;
}
