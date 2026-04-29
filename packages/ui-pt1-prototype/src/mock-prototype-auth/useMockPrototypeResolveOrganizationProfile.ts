import { useMockPrototypeAuthContext } from "./mock-prototype-auth-context";

/** Resolved mock org profile (static dataset + sessionStorage demo overlays). */
export function useMockPrototypeResolveOrganizationProfile() {
  return useMockPrototypeAuthContext().resolveOrganizationProfile;
}
