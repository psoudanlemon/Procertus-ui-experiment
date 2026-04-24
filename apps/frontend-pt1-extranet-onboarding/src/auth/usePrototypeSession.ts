import { useContext } from "react";

import { PrototypeSessionContext, type PrototypeSessionValue } from "./prototype-session-context";

export function usePrototypeSession(): PrototypeSessionValue {
  const ctx = useContext(PrototypeSessionContext);
  if (!ctx) {
    throw new Error("usePrototypeSession must be used within PrototypeSessionProvider");
  }
  return ctx;
}
