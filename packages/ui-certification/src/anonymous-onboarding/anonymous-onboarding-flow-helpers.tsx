import type {
  RequestPackageReviewRequesterPresentation,
  RequestPackageRow,
} from "../components/request-package-review";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import { ONBOARDING_FLOW_STORAGE_KEY } from "./lib/onboardingRegistrationCompleteSession";
import {
  ONBOARDING_STEPS,
  type CustomerContext,
  type OnboardingStep,
} from "./anonymous-onboarding-types";
import { roleLabelForPresetId } from "./lib/registrationPersonOptions";
import {
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  findVatPrototypePreset,
  getPersonContextFieldsForPrototypePreset,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";

export function formatRequesterDisplayName(context: CustomerContext): string {
  const title = context.representativeTitle?.trim() ?? "";
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [title, first, last].filter(Boolean).join(" ");
}

export function formatRequesterStepperLabel(context: CustomerContext): string {
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ") || "Vertegenwoordiger";
}

export function formatPostalAddressDisplay(context: CustomerContext): string {
  const line1 = [context.addressStreet?.trim(), context.addressHouseNumber?.trim()]
    .filter(Boolean)
    .join(" ");
  const line2 = [context.addressPostalCode?.trim(), context.addressCity?.trim()]
    .filter(Boolean)
    .join(" ");
  return [line1, line2].filter(Boolean).join(", ") || "—";
}

export function hasStructuredPostalAddress(context: CustomerContext): boolean {
  return (
    (context.addressStreet?.trim() ?? "").length > 0 &&
    (context.addressHouseNumber?.trim() ?? "").length > 0 &&
    (context.addressPostalCode?.trim() ?? "").length > 0 &&
    (context.addressCity?.trim() ?? "").length > 0
  );
}

const INITIAL_VAT_PROTOTYPE_PRESET =
  findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;

export const DEFAULT_CONTEXT: CustomerContext = {
  ...getPersonContextFieldsForPrototypePreset(INITIAL_VAT_PROTOTYPE_PRESET),
  organizationName: "",
  country: "",
  vatNumber: INITIAL_VAT_PROTOTYPE_PRESET.vatNumber,
  addressStreet: "",
  addressHouseNumber: "",
  addressPostalCode: "",
  addressCity: "",
};

export function normalizeCustomerContext(
  ctx: Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  },
): CustomerContext {
  const { representativeName: _legacyName, ...rest } = ctx;
  const sanitized: Record<string, unknown> = { ...rest };
  const legacyAddress = typeof sanitized.address === "string" ? sanitized.address.trim() : "";
  delete sanitized.kycNotes;
  delete sanitized.address;

  const out: CustomerContext = { ...DEFAULT_CONTEXT, ...(sanitized as Partial<CustomerContext>) };

  if (
    _legacyName?.trim() &&
    !String(sanitized.representativeFirstName ?? "").trim() &&
    !String(sanitized.representativeLastName ?? "").trim()
  ) {
    const parts = _legacyName.trim().split(/\s+/);
    out.representativeFirstName = parts[0] ?? "";
    out.representativeLastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }

  if (
    legacyAddress &&
    !(out.addressStreet?.trim() ?? "") &&
    !(out.addressHouseNumber?.trim() ?? "") &&
    !(out.addressPostalCode?.trim() ?? "") &&
    !(out.addressCity?.trim() ?? "")
  ) {
    out.addressStreet = legacyAddress;
  }

  if (!out.representativeTitlePreset) {
    out.representativeTitlePreset = "none";
  }
  if (out.representativeTitle == null) {
    out.representativeTitle = "";
  }
  if (!out.representativeRolePreset) {
    out.representativeRolePreset = "managing_director";
  }
  if (!out.representativeRole?.trim()) {
    out.representativeRole =
      out.representativeRolePreset === "other"
        ? ""
        : roleLabelForPresetId(out.representativeRolePreset);
  }

  return out;
}

/** Safe context for render and writes: fills missing keys from persistence (first paint before effects). */
export function resolveFlowContext(
  raw: Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  },
): CustomerContext {
  const definedOnly = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined && v !== null),
  ) as Partial<CustomerContext> & {
    representativeName?: string;
    kycNotes?: string;
    address?: string;
  };
  return normalizeCustomerContext({
    ...DEFAULT_CONTEXT,
    ...definedOnly,
  });
}

export function onboardingReviewRequesterFromContext(
  context: CustomerContext,
): RequestPackageReviewRequesterPresentation {
  return {
    context: {
      requesterName: formatRequesterDisplayName(context),
      requesterEmail: context.representativeEmail,
      organizationName: context.organizationName,
      organizationDetails: (
        <>
          <p>{context.vatNumber}</p>
          <p>{formatPostalAddressDisplay(context)}</p>
        </>
      ),
    },
    sectionTitle: "Aanvrager en organisatie",
    requesterLabel: "Ingediend door",
    requesterEmailLabel: "E-mail",
    organizationLabel: "Organisatie",
  };
}

export function buildRows(
  context: CustomerContext,
  drafts: readonly CertificationRequestDraft[],
  includedDraftIds: readonly string[],
): RequestPackageRow[] {
  const included = drafts.filter((d) => includedDraftIds.includes(d.id));
  return [
    { id: "role", label: "Rol", value: context.representativeRole },
    { id: "country", label: "Herkomst", value: context.country },
    { id: "address", label: "Adres", value: formatPostalAddressDisplay(context) },
    ...included.map((draft, index) => ({
      id: draft.id,
      label: `Aanvraag ${index + 1}`,
      value: draft.productLabel ? `${draft.label} · ${draft.productLabel}` : draft.label,
    })),
  ];
}

export function stepIndex(step: OnboardingStep) {
  return ONBOARDING_STEPS.indexOf(step);
}

export function readInitialCompanyLookupPhase(): "idle" | "loading" | "ready" {
  if (typeof localStorage === "undefined") return "idle";
  try {
    const raw = localStorage.getItem(ONBOARDING_FLOW_STORAGE_KEY);
    if (!raw) return "idle";
    const parsed = JSON.parse(raw) as { step?: string };
    const s = parsed.step;
    return s === "company" || s === "kyc" ? "loading" : "idle";
  } catch {
    return "idle";
  }
}
