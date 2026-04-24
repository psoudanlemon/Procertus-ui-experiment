import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Lists every prototype user supplied by the application. */
export function useMockPrototypeUsers() {
  const { users } = useMockPrototypeAuthContext();
  return users;
}
