import { Schema } from "effect";

/** Postal address used on organization profiles (registered / correspondence). */
export const PrototypePostalAddressSchema = Schema.Struct({
  street: Schema.String,
  houseNumber: Schema.String,
  postalCode: Schema.String,
  city: Schema.String,
  /** ISO 3166-1 alpha-2 */
  countryCode: Schema.String,
});
export type PrototypePostalAddress = typeof PrototypePostalAddressSchema.Type;

/** Minimal organization handle (workspace switcher, session). */
export const PrototypeOrganizationRefSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
});
export type PrototypeOrganizationRef = typeof PrototypeOrganizationRefSchema.Type;

/**
 * Full organization profile for prototype / extranet demos (legal entity + contact + address).
 * Distinct from {@link PrototypeOrganizationRef}, which is only id + display name.
 */
export const PrototypeOrganizationProfileSchema = Schema.Struct({
  id: Schema.String,
  tradeName: Schema.String,
  legalName: Schema.String,
  vatNumber: Schema.String,
  enterpriseNumber: Schema.optional(Schema.String),
  primaryEmail: Schema.String,
  primaryPhone: Schema.optional(Schema.String),
  websiteUrl: Schema.optional(Schema.String),
  registeredAddress: PrototypePostalAddressSchema,
  correspondenceAddress: Schema.optional(PrototypePostalAddressSchema),
  industrySector: Schema.optional(Schema.String),
  /** Approximate headcount for demos (not audited). */
  employeeCountApprox: Schema.optional(Schema.Number),
  foundedYear: Schema.optional(Schema.Number),
});
export type PrototypeOrganizationProfile = typeof PrototypeOrganizationProfileSchema.Type;

const prototypeUserProfileFields = {
  id: Schema.String,
  displayName: Schema.String,
  givenName: Schema.String,
  familyName: Schema.String,
  email: Schema.String,
  workEmail: Schema.optional(Schema.String),
  phone: Schema.optional(Schema.String),
  mobilePhone: Schema.optional(Schema.String),
  jobTitle: Schema.optional(Schema.String),
  department: Schema.optional(Schema.String),
  locale: Schema.optional(Schema.String),
  timeZone: Schema.optional(Schema.String),
  preferredLanguage: Schema.optional(Schema.String),
  salutation: Schema.optional(Schema.String),
  employeeReference: Schema.optional(Schema.String),
  role: Schema.optional(Schema.String),
  notes: Schema.optional(Schema.String),
} as const;

/** Person-level profile fields (no organization membership). */
export const PrototypeUserProfileSchema = Schema.Struct(prototypeUserProfileFields);
export type PrototypeUserProfile = typeof PrototypeUserProfileSchema.Type;

/**
 * Signed-in prototype persona: full {@link PrototypeUserProfile} plus organizational context.
 */
export const MockPrototypeUserSchema = Schema.Struct({
  ...prototypeUserProfileFields,
  homeOrganization: PrototypeOrganizationRefSchema,
  representedOrganization: PrototypeOrganizationRefSchema,
  organizations: Schema.optional(Schema.Array(PrototypeOrganizationRefSchema)),
});
export type MockPrototypeUser = typeof MockPrototypeUserSchema.Type;

export const MockPrototypeSessionSchema = Schema.Struct({
  user: MockPrototypeUserSchema,
  activeOrganization: PrototypeOrganizationRefSchema,
  organizations: Schema.Array(PrototypeOrganizationRefSchema),
});
export type MockPrototypeSession = typeof MockPrototypeSessionSchema.Type;

export function formatPrototypePostalAddressLine(a: PrototypePostalAddress): string {
  const line1 = `${a.street} ${a.houseNumber}`.trim();
  return `${line1}, ${a.postalCode} ${a.city} (${a.countryCode})`;
}
