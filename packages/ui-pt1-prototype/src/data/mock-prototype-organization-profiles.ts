import { Schema } from "effect";

import {
  type PrototypeOrganizationProfile,
  PrototypeOrganizationProfileSchema,
} from "../schema/prototype-profile-schemas";

const raw: readonly unknown[] = [
  {
    id: "org-procertus",
    tradeName: "PROCERTUS",
    legalName: "PROCERTUS NV",
    vatNumber: "BE0404484654",
    enterpriseNumber: "0404484654",
    primaryEmail: "info@procertus.example",
    primaryPhone: "+32 2 123 45 67",
    websiteUrl: "https://www.procertus.example",
    registeredAddress: {
      street: "Koning Albert II-laan",
      houseNumber: "37",
      postalCode: "1030",
      city: "Brussel",
      countryCode: "BE",
    },
    correspondenceAddress: {
      street: "Koning Albert II-laan",
      houseNumber: "37",
      postalCode: "1030",
      city: "Brussel",
      countryCode: "BE",
    },
    industrySector: "Conformity assessment / certification",
    employeeCountApprox: 120,
    foundedYear: 1998,
  },
  {
    id: "org-acme",
    tradeName: "Acme Packaging BV",
    legalName: "Acme Packaging BVBA",
    vatNumber: "BE0456789012",
    enterpriseNumber: "0456789012",
    primaryEmail: "contact@acme-packaging.example",
    primaryPhone: "+32 15 555 010",
    websiteUrl: "https://www.acme-packaging.example",
    registeredAddress: {
      street: "Industrielaan",
      houseNumber: "42",
      postalCode: "2800",
      city: "Mechelen",
      countryCode: "BE",
    },
    industrySector: "Packaging manufacturing",
    employeeCountApprox: 85,
    foundedYear: 2005,
  },
  {
    id: "org-greenleaf",
    tradeName: "GreenLeaf Ingredients",
    legalName: "GreenLeaf Ingredients SA",
    vatNumber: "BE0789123456",
    enterpriseNumber: "0789123456",
    primaryEmail: "hello@greenleaf.example",
    primaryPhone: "+32 9 555 02 20",
    websiteUrl: "https://www.greenleaf.example",
    registeredAddress: {
      street: "Havenkaai",
      houseNumber: "5",
      postalCode: "9000",
      city: "Gent",
      countryCode: "BE",
    },
    industrySector: "Food ingredients",
    employeeCountApprox: 42,
    foundedYear: 2011,
  },
  {
    id: "org-northwind",
    tradeName: "Northwind Foods",
    legalName: "Northwind Foods BV",
    vatNumber: "BE0123987654",
    enterpriseNumber: "0123987654",
    primaryEmail: "office@northwind-foods.example",
    primaryPhone: "+32 9 444 88 00",
    websiteUrl: "https://www.northwind-foods.example",
    registeredAddress: {
      street: "Zuiderlaan",
      houseNumber: "88",
      postalCode: "9000",
      city: "Gent",
      countryCode: "BE",
    },
    industrySector: "Food wholesale",
    employeeCountApprox: 60,
    foundedYear: 2002,
  },
];

export const MOCK_PROTOTYPE_ORGANIZATION_PROFILES: readonly PrototypeOrganizationProfile[] =
  Schema.decodeUnknownSync(Schema.Array(PrototypeOrganizationProfileSchema))(raw);

export function getPrototypeOrganizationProfile(
  organizationId: string,
): PrototypeOrganizationProfile | undefined {
  return MOCK_PROTOTYPE_ORGANIZATION_PROFILES.find((p) => p.id === organizationId);
}
