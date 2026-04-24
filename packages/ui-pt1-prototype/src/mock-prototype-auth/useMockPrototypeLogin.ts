import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Starts a session for `userId`, or for the user currently chosen in the picker when omitted. */
export function useMockPrototypeLogin() {
  const { login } = useMockPrototypeAuthContext();
  return login;
}
