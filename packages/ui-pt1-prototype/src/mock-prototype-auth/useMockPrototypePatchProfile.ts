import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Returns {@link MockPrototypeAuthContextValue.patchPrototypeProfile} for the enclosing provider. */
export function useMockPrototypePatchProfile() {
  return useMockPrototypeAuthContext().patchPrototypeProfile;
}
