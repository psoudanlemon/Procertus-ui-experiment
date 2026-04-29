export { cn } from "./lib/utils";

export type {
  MockPrototypeOrganization,
  MockPrototypeSession,
  MockPrototypeUser,
} from "./types/mock-prototype-user";
export type {
  MockPrototypeProfilePatch,
  MockPrototypeUserProfilePatch,
} from "./types/mock-prototype-profile-patch";
export type {
  PrototypeOrganizationProfile,
  PrototypeOrganizationRef,
  PrototypePostalAddress,
  PrototypeUserProfile,
} from "./schema/prototype-profile-schemas";
export {
  formatPrototypePostalAddressLine,
  MockPrototypeSessionSchema,
  MockPrototypeUserSchema,
  PrototypeOrganizationProfileSchema,
  PrototypeOrganizationRefSchema,
  PrototypePostalAddressSchema,
  PrototypeUserProfileSchema,
} from "./schema/prototype-profile-schemas";
export { MOCK_PROTOTYPE_USERS } from "./data/mock-prototype-users";
export {
  getPrototypeOrganizationProfile,
  MOCK_PROTOTYPE_ORGANIZATION_PROFILES,
} from "./data/mock-prototype-organization-profiles";
export { mockPrototypeMembershipsForUser } from "./types/mock-prototype-user";

export {
  MockPrototypeAuthProvider,
  type MockPrototypeAuthProviderProps,
} from "./mock-prototype-auth/MockPrototypeAuthProvider";
export {
  MockPrototypeUserSelect,
  type MockPrototypeUserSelectProps,
} from "./mock-prototype-auth/MockPrototypeUserSelect";
export {
  MockPrototypePasswordlessLoginForm,
  type MockPrototypePasswordlessLoginFormProps,
} from "./mock-prototype-auth/MockPrototypePasswordlessLoginForm";
export { PrototypeCard, type PrototypeCardProps } from "./mock-prototype-auth/PrototypeCard";
export { useMockPrototypeAuthContext } from "./mock-prototype-auth/mock-prototype-auth-context";
export { useMockPrototypeAuth } from "./mock-prototype-auth/useMockPrototypeAuth";
export { useMockPrototypeIsAuthenticated } from "./mock-prototype-auth/useMockPrototypeIsAuthenticated";
export { useMockPrototypeLogin } from "./mock-prototype-auth/useMockPrototypeLogin";
export { useMockPrototypeLogout } from "./mock-prototype-auth/useMockPrototypeLogout";
export { useMockPrototypeSession } from "./mock-prototype-auth/useMockPrototypeSession";
export { useMockPrototypeSetActiveOrganization } from "./mock-prototype-auth/useMockPrototypeSetActiveOrganization";
export { useMockPrototypeUsers } from "./mock-prototype-auth/useMockPrototypeUsers";
export { useMockPrototypeUserSelection } from "./mock-prototype-auth/useMockPrototypeUserSelection";
export { useMockPrototypePatchProfile } from "./mock-prototype-auth/useMockPrototypePatchProfile";
export { useMockPrototypeResolveOrganizationProfile } from "./mock-prototype-auth/useMockPrototypeResolveOrganizationProfile";
export {
  mergePrototypeOrganizationProfile,
  type MockPrototypeOrganizationProfilePatch,
} from "./lib/merge-prototype-organization-profile";
