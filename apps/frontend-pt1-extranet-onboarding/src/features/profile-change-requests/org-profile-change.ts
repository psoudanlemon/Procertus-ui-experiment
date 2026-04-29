import type { CustomerContext } from "@procertus-ui/ui-certification";
import type {
  MockPrototypeOrganizationProfilePatch,
  PrototypeOrganizationProfile,
  PrototypePostalAddress,
} from "@procertus-ui/ui-pt1-prototype";

/** All fields editable in the organization profile change dialog (demo). */
export type OrgProfileChangeForm = {
  orgName: string;
  demoAddress: string;
  organizationName: string;
  vatNumber: string;
  country: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  tradeName: string;
  legalName: string;
  enterpriseNumber: string;
  primaryEmail: string;
  primaryPhone: string;
  websiteUrl: string;
  industrySector: string;
  employeeCountApprox: string;
  foundedYear: string;
  regStreet: string;
  regHouse: string;
  regPostal: string;
  regCity: string;
  regCountry: string;
  corrStreet: string;
  corrHouse: string;
  corrPostal: string;
  corrCity: string;
  corrCountry: string;
};

export function recordToOrgProfileForm(r: Record<string, string>): OrgProfileChangeForm {
  const g = (k: keyof OrgProfileChangeForm) => r[k] ?? "";
  return {
    orgName: g("orgName"),
    demoAddress: g("demoAddress"),
    organizationName: g("organizationName"),
    vatNumber: g("vatNumber"),
    country: g("country"),
    addressStreet: g("addressStreet"),
    addressHouseNumber: g("addressHouseNumber"),
    addressPostalCode: g("addressPostalCode"),
    addressCity: g("addressCity"),
    tradeName: g("tradeName"),
    legalName: g("legalName"),
    enterpriseNumber: g("enterpriseNumber"),
    primaryEmail: g("primaryEmail"),
    primaryPhone: g("primaryPhone"),
    websiteUrl: g("websiteUrl"),
    industrySector: g("industrySector"),
    employeeCountApprox: g("employeeCountApprox"),
    foundedYear: g("foundedYear"),
    regStreet: g("regStreet"),
    regHouse: g("regHouse"),
    regPostal: g("regPostal"),
    regCity: g("regCity"),
    regCountry: g("regCountry"),
    corrStreet: g("corrStreet"),
    corrHouse: g("corrHouse"),
    corrPostal: g("corrPostal"),
    corrCity: g("corrCity"),
    corrCountry: g("corrCountry"),
  };
}

export function companySlice(ctx: Partial<CustomerContext> | null | undefined): Pick<
  OrgProfileChangeForm,
  | "organizationName"
  | "vatNumber"
  | "country"
  | "addressStreet"
  | "addressHouseNumber"
  | "addressPostalCode"
  | "addressCity"
> {
  return {
    organizationName: ctx?.organizationName ?? "",
    vatNumber: ctx?.vatNumber ?? "",
    country: ctx?.country ?? "",
    addressStreet: ctx?.addressStreet ?? "",
    addressHouseNumber: ctx?.addressHouseNumber ?? "",
    addressPostalCode: ctx?.addressPostalCode ?? "",
    addressCity: ctx?.addressCity ?? "",
  };
}

export function referenceSliceFromProfile(p: PrototypeOrganizationProfile | undefined): Pick<
  OrgProfileChangeForm,
  | "tradeName"
  | "legalName"
  | "enterpriseNumber"
  | "primaryEmail"
  | "primaryPhone"
  | "websiteUrl"
  | "industrySector"
  | "employeeCountApprox"
  | "foundedYear"
  | "regStreet"
  | "regHouse"
  | "regPostal"
  | "regCity"
  | "regCountry"
  | "corrStreet"
  | "corrHouse"
  | "corrPostal"
  | "corrCity"
  | "corrCountry"
> {
  if (!p) {
    return {
      tradeName: "",
      legalName: "",
      enterpriseNumber: "",
      primaryEmail: "",
      primaryPhone: "",
      websiteUrl: "",
      industrySector: "",
      employeeCountApprox: "",
      foundedYear: "",
      regStreet: "",
      regHouse: "",
      regPostal: "",
      regCity: "",
      regCountry: "",
      corrStreet: "",
      corrHouse: "",
      corrPostal: "",
      corrCity: "",
      corrCountry: "",
    };
  }
  const r = p.registeredAddress;
  const c = p.correspondenceAddress ?? p.registeredAddress;
  return {
    tradeName: p.tradeName,
    legalName: p.legalName,
    enterpriseNumber: p.enterpriseNumber ?? "",
    primaryEmail: p.primaryEmail,
    primaryPhone: p.primaryPhone ?? "",
    websiteUrl: p.websiteUrl ?? "",
    industrySector: p.industrySector ?? "",
    employeeCountApprox: p.employeeCountApprox !== undefined ? String(p.employeeCountApprox) : "",
    foundedYear: p.foundedYear !== undefined ? String(p.foundedYear) : "",
    regStreet: r.street,
    regHouse: r.houseNumber,
    regPostal: r.postalCode,
    regCity: r.city,
    regCountry: r.countryCode,
    corrStreet: c.street,
    corrHouse: c.houseNumber,
    corrPostal: c.postalCode,
    corrCity: c.city,
    corrCountry: c.countryCode,
  };
}

function optionalInt(s: string): number | undefined {
  const t = s.trim();
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function partialPostalFromForm(
  street: string,
  houseNumber: string,
  postalCode: string,
  city: string,
  countryCode: string,
): PrototypePostalAddress | undefined {
  const out = {
    street: street.trim(),
    houseNumber: houseNumber.trim(),
    postalCode: postalCode.trim(),
    city: city.trim(),
    countryCode: countryCode.trim(),
  };
  if (!Object.values(out).some((v) => v.length > 0)) return undefined;
  return out;
}

export function buildOrganizationProfileOverlay(form: OrgProfileChangeForm): MockPrototypeOrganizationProfilePatch {
  const reg = partialPostalFromForm(
    form.regStreet,
    form.regHouse,
    form.regPostal,
    form.regCity,
    form.regCountry,
  );
  const corr = partialPostalFromForm(
    form.corrStreet,
    form.corrHouse,
    form.corrPostal,
    form.corrCity,
    form.corrCountry,
  );
  return {
    tradeName: form.tradeName.trim() || undefined,
    legalName: form.legalName.trim() || undefined,
    enterpriseNumber: form.enterpriseNumber.trim() || undefined,
    primaryEmail: form.primaryEmail.trim() || undefined,
    primaryPhone: form.primaryPhone.trim() || undefined,
    websiteUrl: form.websiteUrl.trim() || undefined,
    industrySector: form.industrySector.trim() || undefined,
    employeeCountApprox: optionalInt(form.employeeCountApprox),
    foundedYear: optionalInt(form.foundedYear),
    vatNumber: form.vatNumber.trim() || undefined,
    ...(reg ? { registeredAddress: reg } : {}),
    ...(corr ? { correspondenceAddress: corr } : {}),
  };
}
