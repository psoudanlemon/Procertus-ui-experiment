import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

export function useMockPrototypeLogout() {
  const { logout } = useMockPrototypeAuthContext();
  return logout;
}
