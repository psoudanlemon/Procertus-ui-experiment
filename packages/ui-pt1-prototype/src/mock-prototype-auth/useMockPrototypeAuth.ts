import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Full mock auth state and actions (users come from the app via provider props). */
export function useMockPrototypeAuth() {
  return useMockPrototypeAuthContext();
}
