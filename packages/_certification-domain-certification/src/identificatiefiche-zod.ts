/**
 * Zod mirror of `docs/identificatie fiche/identificatiefiche-domain.graphql`.
 *
 * Effective certification / inspection contacts for a unit (unit override,
 * else company default) are not encoded in the schema; resolve in application
 * code when needed.
 *
 * **Why `Company` / `OrganizationalUnit` are not `z.infer<typeof …>` alone:**
 * Mutually recursive `z.lazy()` schemas reference each other in their
 * initializers. TypeScript then cannot infer either schema (circular
 * `TS7022` / implicit `any`). Declaring these two object types up front breaks
 * the cycle so `z.ZodType<Company>` / `z.ZodType<OrganizationalUnit>` can
 * type-check the lazy factories. Non-recursive types below still use `z.infer`.
 */
import { z } from "zod";

export const organizationalUnitKindSchema = z.enum([
  "PRODUCTION_UNIT",
  "DISTRIBUTION_CENTER",
  "RENTAL_COMPANY",
]);
export type OrganizationalUnitKind = z.infer<typeof organizationalUnitKindSchema>;

export const addressSchema = z.object({
  lines: z.array(z.string()).min(1),
  locality: z.string().optional(),
  postalCode: z.string().optional(),
  region: z.string().optional(),
  countryCode: z.string().length(2).optional(),
});
export type Address = z.infer<typeof addressSchema>;

export const personSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email(),
});
export type Person = z.infer<typeof personSchema>;

export const companyInvoicingDetailsSchema = z.object({
  responsiblePerson: personSchema.nullish(),
  invoicingEmail: z.string().email().nullish(),
  invoicingAddressOverride: addressSchema.nullish(),
});
export type CompanyInvoicingDetails = z.infer<typeof companyInvoicingDetailsSchema>;

/** @see file-level note — breaks TS circular inference for `z.lazy`. */
export type Company = {
  id: string;
  name: string;
  address: Address;
  phone: string;
  representative: Person;
  vatNumber: string;
  units: OrganizationalUnit[];
  certificationAndInspectionContact: Person;
  certificationAndInspectionSecondaryContact?: Person | null;
  invoicing?: CompanyInvoicingDetails | null;
};

/** @see file-level note — breaks TS circular inference for `z.lazy`. */
export type OrganizationalUnit = {
  id: string;
  name: string;
  address: Address;
  phone: string;
  representative: Person;
  unitKind: OrganizationalUnitKind;
  company: Company;
  certificationAndInspectionContact?: Person | null;
  certificationAndInspectionSecondaryContact?: Person | null;
};

export const companySchema: z.ZodType<Company> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    address: addressSchema,
    phone: z.string().min(1),
    representative: personSchema,
    vatNumber: z.string().min(1),
    units: z.array(organizationalUnitSchema),
    certificationAndInspectionContact: personSchema,
    certificationAndInspectionSecondaryContact: personSchema.nullish(),
    invoicing: companyInvoicingDetailsSchema.nullish(),
  }),
);

export const organizationalUnitSchema: z.ZodType<OrganizationalUnit> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    address: addressSchema,
    phone: z.string().min(1),
    representative: personSchema,
    unitKind: organizationalUnitKindSchema,
    company: companySchema,
    certificationAndInspectionContact: personSchema.nullish(),
    certificationAndInspectionSecondaryContact: personSchema.nullish(),
  }),
);
