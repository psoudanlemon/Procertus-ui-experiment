/**
 * Zod schemas for capturing identificatiefiche-aligned data in multi-step forms.
 * Composes primitives from `identificatiefiche-zod.ts` (GraphQL mirror).
 */
import { z } from "zod";

import { addressSchema, personSchema } from "./identificatiefiche-zod";

/** Natural person as typed in UI (split naam) before merging to `Person.name`. */
export const identificatiePersonSubformValueSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  telephone: z.string(),
  email: z.string(),
});
export type IdentificatiePersonSubformValue = z.infer<typeof identificatiePersonSubformValueSchema>;

const looseEmailStructuralSchema = z.string().email();

/**
 * Structural email check for live UI feedback on person subforms.
 * Empty or whitespace-only input is treated as neutral (no structural error) so typing is not nagged.
 */
export function isPersonSubformEmailStructurallyValid(email: string): boolean {
  const t = email.trim();
  if (t.length === 0) return true;
  return looseEmailStructuralSchema.safeParse(t).success;
}

/**
 * When the user entered something that is not a structurally valid e-mail, returns a short Dutch message;
 * otherwise `null` (including when the field is empty).
 */
export function personSubformEmailStructuralIssue(email: string): string | null {
  const t = email.trim();
  if (t.length === 0) return null;
  return looseEmailStructuralSchema.safeParse(t).success ? null : "Voer een geldig e-mailadres in.";
}

/**
 * Validates person lines used on the identificatiefiche (wettelijke vertegenwoordiger,
 * PROCERTUS-contacten, …). Maps to {@link personSchema} after assigning an `id`.
 */
export const identificatiePersonCaptureSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email(),
});
export type IdentificatiePersonCapture = z.infer<typeof identificatiePersonCaptureSchema>;

export function personSubformValueToCapture(
  v: IdentificatiePersonSubformValue,
): IdentificatiePersonCapture {
  return {
    name: [v.firstName, v.lastName].filter((x) => x.trim().length > 0).join(" ").trim(),
    title: v.title.trim() || undefined,
    telephone: v.telephone.trim() || undefined,
    email: v.email.trim(),
  };
}

export function finalizePersonCapture(
  capture: IdentificatiePersonCapture,
  id: string,
): z.infer<typeof personSchema> {
  return personSchema.parse({
    id,
    name: capture.name,
    title: capture.title,
    telephone: capture.telephone,
    email: capture.email,
  });
}

/** Belgian-style structured lines before mapping to {@link addressSchema}. */
export const identificatieStreetAddressCaptureSchema = z.object({
  street: z.string().min(1),
  houseNumber: z.string().min(1),
  postalCode: z.string().min(1),
  locality: z.string().min(1),
  countryLabel: z.string().min(1),
  countryCode: z.string().length(2).optional(),
});
export type IdentificatieStreetAddressCapture = z.infer<
  typeof identificatieStreetAddressCaptureSchema
>;

export function streetAddressCaptureToAddress(
  v: IdentificatieStreetAddressCapture,
): z.infer<typeof addressSchema> {
  const line1 = `${v.street.trim()} ${v.houseNumber.trim()}`.trim();
  const lines = [line1, v.countryLabel.trim()].filter((l) => l.length > 0);
  return addressSchema.parse({
    lines,
    locality: v.locality.trim(),
    postalCode: v.postalCode.trim(),
    countryCode: v.countryCode,
  });
}

export function customerContextToFirmaAddressCapture(input: {
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  country: string;
  addressCountryCode?: string;
}): IdentificatieStreetAddressCapture {
  const cc = input.addressCountryCode?.trim() ?? "";
  return {
    street: input.addressStreet.trim(),
    houseNumber: input.addressHouseNumber.trim(),
    postalCode: input.addressPostalCode.trim(),
    locality: input.addressCity.trim(),
    countryLabel: input.country.trim(),
    countryCode: cc.length === 2 ? cc : undefined,
  };
}

/** Onboarding validation: firma postal + land goed genoeg voor verder-CTA. */
export function isFirmaAddressCaptureComplete(input: {
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
  country: string;
}): boolean {
  return identificatieStreetAddressCaptureSchema.safeParse(
    customerContextToFirmaAddressCapture(input),
  ).success;
}

const invoicingEmailRequiredSchema = z.object({
  invoicingEmail: z.string().email(),
});

export function isOnboardingInvoicingCaptureValid(input: {
  invoicingEmail: string;
}): boolean {
  return invoicingEmailRequiredSchema.safeParse({ invoicingEmail: input.invoicingEmail.trim() })
    .success;
}
