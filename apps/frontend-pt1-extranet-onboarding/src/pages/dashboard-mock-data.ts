import { formatPrototypePostalAddressLine, getPrototypeOrganizationProfile } from "@procertus-ui/ui-pt1-prototype";

/** Static mock content for dashboard sections without live data binding (financiën, certificaat-teaser). */

export const mockFinancialOverview = {
  openInvoicesCount: 3,
  paymentSpendingYtd: "€ 14.280",
  ordersAwaitingInvoice: 2,
};

/** Placeholder totals until certificaatdata aan het extranet wordt gekoppeld. */
export const mockCertificateTeaser = {
  activeCertificates: 8,
};

export type MockInvoicePreview = {
  id: string;
  /** Display reference, e.g. year-serial */
  reference: string;
  amount: string;
  paid: boolean;
};

const MOCK_LATEST_INVOICES: Record<string, MockInvoicePreview[]> = {
  "org-procertus": [
    { id: "inv-p1", reference: "2025-0142", amount: "€ 2.450,00", paid: true },
    { id: "inv-p2", reference: "2025-0156", amount: "€ 890,00", paid: false },
    { id: "inv-p3", reference: "2025-0161", amount: "€ 12.100,00", paid: false },
  ],
  "org-acme": [
    { id: "inv-a1", reference: "2025-0801", amount: "€ 1.240,00", paid: true },
    { id: "inv-a2", reference: "2025-0803", amount: "€ 3.600,00", paid: true },
    { id: "inv-a3", reference: "2025-0809", amount: "€ 475,00", paid: false },
  ],
  "org-greenleaf": [
    { id: "inv-g1", reference: "2025-1201", amount: "€ 6.200,00", paid: false },
    { id: "inv-g2", reference: "2025-1202", amount: "€ 980,00", paid: true },
    { id: "inv-g3", reference: "2025-1204", amount: "€ 2.310,00", paid: false },
  ],
  "org-northwind": [
    { id: "inv-n1", reference: "2025-0301", amount: "€ 4.100,00", paid: true },
    { id: "inv-n2", reference: "2025-0305", amount: "€ 720,00", paid: false },
    { id: "inv-n3", reference: "2025-0310", amount: "€ 1.890,00", paid: true },
  ],
};

const DEFAULT_INVOICES: MockInvoicePreview[] = [
  { id: "inv-d1", reference: "2025-0001", amount: "€ 1.100,00", paid: true },
  { id: "inv-d2", reference: "2025-0002", amount: "€ 2.200,00", paid: false },
  { id: "inv-d3", reference: "2025-0003", amount: "€ 330,00", paid: false },
];

/** Latest three fictive invoices for the active organisation (prototype). */
export function mockLatestInvoices(organizationId: string): MockInvoicePreview[] {
  return MOCK_LATEST_INVOICES[organizationId] ?? DEFAULT_INVOICES;
}

const MOCK_ACTIVE_CERTIFICATE_COUNTS: Record<string, number> = {
  "org-procertus": 14,
  "org-acme": 6,
  "org-greenleaf": 9,
  "org-northwind": 5,
};

/** Actieve certificaten voor de organisatie (prototype). */
export function mockActiveCertificateCount(organizationId: string): number {
  return MOCK_ACTIVE_CERTIFICATE_COUNTS[organizationId] ?? mockCertificateTeaser.activeCertificates;
}

/** Prototype-only: users in the directory for the active org (no live API). */
const MOCK_ORG_USER_COUNTS: Record<string, number> = {
  "org-procertus": 24,
  "org-acme": 12,
  "org-greenleaf": 7,
  "org-northwind": 9,
};

export function mockOrganizationUserCount(organizationId: string): number {
  const approx = getPrototypeOrganizationProfile(organizationId)?.employeeCountApprox;
  if (typeof approx === "number" && Number.isFinite(approx)) return Math.max(0, Math.round(approx));
  return MOCK_ORG_USER_COUNTS[organizationId] ?? 8;
}

export function mockOrganizationAddress(organizationId: string): string {
  const profile = getPrototypeOrganizationProfile(organizationId);
  if (profile) return formatPrototypePostalAddressLine(profile.registeredAddress);
  return "Teststraat 1, 1000 Brussel";
}

/** Source module for dashboard notification previews (prototype). */
export type DashboardNotificationModule = "user-management" | "certification" | "invoicing";

export type DashboardNotification = {
  id: string;
  module: DashboardNotificationModule;
  message: string;
  /** ISO 8601 instant for sorting and display. */
  occurredAt: string;
};

const MOCK_RECENT_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: "ntf-1",
    module: "certification",
    message: "Uw certificatieaanvraag is goedgekeurd.",
    occurredAt: "2026-04-29T14:22:00.000Z",
  },
  {
    id: "ntf-2",
    module: "user-management",
    message: "Gebruiker Alex Janssens heeft het account geactiveerd.",
    occurredAt: "2026-04-29T11:40:00.000Z",
  },
  {
    id: "ntf-3",
    module: "invoicing",
    message: "Er werd een nieuwe factuur toegevoegd.",
    occurredAt: "2026-04-29T09:05:00.000Z",
  },
  {
    id: "ntf-4",
    module: "user-management",
    message: "Gebruiker Maya Vermeulen werd toegevoegd aan de organisatie.",
    occurredAt: "2026-04-28T16:12:00.000Z",
  },
  {
    id: "ntf-5",
    module: "certification",
    message: "Uw certificatieaanvraag is ingediend en wacht op beoordeling.",
    occurredAt: "2026-04-28T08:30:00.000Z",
  },
];

/** Fictive meldingen voor het dashboard (geen live API). */
export function mockRecentNotifications(): DashboardNotification[] {
  return [...MOCK_RECENT_NOTIFICATIONS].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}
