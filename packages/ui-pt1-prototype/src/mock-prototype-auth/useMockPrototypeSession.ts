import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

import type { MockPrototypeSession } from "../types/mock-prototype-user";

/** Active mock session with user and both organizations, or null when signed out. */
export function useMockPrototypeSession(): MockPrototypeSession | null {
  const { session } = useMockPrototypeAuthContext();
  return session;
}
