import type {
  PrototypeOrganizationProfile,
  PrototypePostalAddress,
} from "../schema/prototype-profile-schemas";

/** Demo-only partial overlay for {@link PrototypeOrganizationProfile} (sessionStorage). */
export type MockPrototypeOrganizationProfilePatch = {
  tradeName?: string;
  legalName?: string;
  vatNumber?: string;
  enterpriseNumber?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  websiteUrl?: string;
  registeredAddress?: Partial<PrototypePostalAddress>;
  correspondenceAddress?: Partial<PrototypePostalAddress>;
  industrySector?: string;
  employeeCountApprox?: number;
  foundedYear?: number;
};

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<T>;
}

function mergePostal(base: PrototypePostalAddress, partial?: Partial<PrototypePostalAddress>): PrototypePostalAddress {
  if (partial === undefined) return base;
  return { ...base, ...partial };
}

export function mergePrototypeOrganizationProfile(
  base: PrototypeOrganizationProfile,
  patch: MockPrototypeOrganizationProfilePatch,
): PrototypeOrganizationProfile {
  const {
    registeredAddress: regPatch,
    correspondenceAddress: corrPatch,
    ...scalarPatch
  } = patch;
  const scalars = omitUndefined(scalarPatch as Record<string, unknown>);
  const registeredAddress = mergePostal(base.registeredAddress, regPatch);
  const correspondenceAddress =
    corrPatch === undefined
      ? base.correspondenceAddress
      : mergePostal(base.correspondenceAddress ?? base.registeredAddress, corrPatch);
  return {
    ...base,
    ...scalars,
    registeredAddress,
    correspondenceAddress,
  };
}
