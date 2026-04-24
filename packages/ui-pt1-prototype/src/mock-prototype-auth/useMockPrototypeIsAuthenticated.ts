import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

export function useMockPrototypeIsAuthenticated() {
  const { isAuthenticated } = useMockPrototypeAuthContext();
  return isAuthenticated;
}
