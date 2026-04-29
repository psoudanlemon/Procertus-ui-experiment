import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Updates which prototype organization is active for the signed-in mock user. */
export function useMockPrototypeSetActiveOrganization() {
  return useMockPrototypeAuthContext().setActiveOrganization;
}
