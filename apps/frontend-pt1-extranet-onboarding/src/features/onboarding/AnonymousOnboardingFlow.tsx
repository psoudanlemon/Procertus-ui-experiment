import { Alert01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Progress,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardList,
  cn,
} from "@procertus-ui/ui";
import procertusLogo from "@procertus-ui/ui/assets/Procertus logo.svg";
import {
  DraftCardDescription,
  RequestPackageReview,
  sortDraftsByIntentAndProduct,
} from "@procertus-ui/ui-certification";
import type {
  RequestPackageReviewRequesterPresentation,
  RequestPackageRow,
} from "@procertus-ui/ui-certification";
import { PrototypeCard } from "@procertus-ui/ui-pt1-prototype";
import {
  OnboardingStepper,
  SelectChoiceCard,
  SelectChoiceCardGroup,
  StepLayout,
} from "@procertus-ui/ui-lib";
import type { OnboardingStepperStep, StepLayoutAction } from "@procertus-ui/ui-lib";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  REGISTRATION_SUBMIT_REDIRECT_DELAY_MS,
  registrationSimulationStepLabels,
} from "./registrationSubmitSimulation";
import { Navigate, useNavigate } from "react-router-dom";

import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import {
  CertificationRequestWizard,
  type CertificationWizardDraft,
} from "../certification-wizard/CertificationRequestWizard";
import {
  REPRESENTATIVE_ROLE_PRESETS,
  REPRESENTATIVE_TITLE_PRESETS,
  roleLabelForPresetId,
  titleLabelForPresetId,
} from "./registrationPersonOptions";
import {
  companyFormFieldsPrefilledByMockLookup,
  companyFormFieldsResolvedThroughLookupStep,
  DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  enrichRegistrationContext,
  findVatPrototypePreset,
  getPersonContextFieldsForPrototypePreset,
  isVatIdentifierPlausible,
  REGISTRATION_COUNTRY_OPTIONS,
  VAT_LOOKUP_OUTCOME_LABELS,
  VAT_PROTOTYPE_PRESETS,
  vatLookupSimulationStepsForPreset,
  type CompanyFormFieldKey,
  type RegistrationEnrichmentHints,
  type VatLookupMockOutcome,
} from "./vatPrototypePresets";
import {
  ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY,
  readOnboardingRegistrationCompletePayload,
  writeOnboardingRegistrationCompletePayload,
} from "./onboardingRegistrationCompleteSession";

/** Standalone status page (no onboarding shell) after mock registratie-indiening. */
export const ONBOARDING_REGISTRATION_COMPLETE_PATH = "/registratie-voltooid";

const ONBOARDING_STEPS = ["request", "customer", "company", "review", "summary"] as const;

type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

type CustomerContext = {
  representativeFirstName: string;
  representativeLastName: string;
  /** Preset id: none, mr, mrs, …, other */
  representativeTitlePreset: string;
  /** Effective title (from preset or free text / override) */
  representativeTitle: string;
  representativeEmail: string;
  /** Preset id for role; `other` means user must type `representativeRole` */
  representativeRolePreset: string;
  /** Required: label from preset or custom text */
  representativeRole: string;
  organizationName: string;
  country: string;
  vatNumber: string;
  addressStreet: string;
  addressHouseNumber: string;
  addressPostalCode: string;
  addressCity: string;
};

const INITIAL_VAT_PROTOTYPE_PRESET =
  findVatPrototypePreset(DEFAULT_VAT_PROTOTYPE_PRESET_ID) ?? VAT_PROTOTYPE_PRESETS[0]!;

const DEFAULT_CONTEXT: CustomerContext = {
  ...getPersonContextFieldsForPrototypePreset(INITIAL_VAT_PROTOTYPE_PRESET),
  organizationName: "",
  country: "",
  vatNumber: INITIAL_VAT_PROTOTYPE_PRESET.vatNumber,
  addressStreet: "",
  addressHouseNumber: "",
  addressPostalCode: "",
  addressCity: "",
};

function formatRequesterDisplayName(context: CustomerContext): string {
  const title = context.representativeTitle?.trim() ?? "";
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [title, first, last].filter(Boolean).join(" ");
}

function formatRequesterStepperLabel(context: CustomerContext): string {
  const first = context.representativeFirstName?.trim() ?? "";
  const last = context.representativeLastName?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ") || "Vertegenwoordiger";
}

function formatPostalAddressDisplay(context: CustomerContext): string {
  const line1 = [context.addressStreet?.trim(), context.addressHouseNumber?.trim()]
    .filter(Boolean)
    .join(" ");
  const line2 = [context.addressPostalCode?.trim(), context.addressCity?.trim()]
    .filter(Boolean)
    .join(" ");
  return [line1, line2].filter(Boolean).join(", ") || "—";
}

function hasStructuredPostalAddress(context: CustomerContext): boolean {
  return (
    (context.addressStreet?.trim() ?? "").length > 0 &&
    (context.addressHouseNumber?.trim() ?? "").length > 0 &&
    (context.addressPostalCode?.trim() ?? "").length > 0 &&
    (context.addressCity?.trim() ?? "").length > 0
  );
}

function normalizeCustomerContext(
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

/** Safe context for render and writes: fills missing keys from persistance (first paint before effects). */
function resolveFlowContext(
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

const COUNTRY_SELECT_NONE = "__registration_country_none__";
const ONBOARDING_FLOW_STORAGE_KEY = "pt1:onboarding-flow-state";
const CERTIFICATION_REQUEST_STORAGE_KEY = "pt1:certification-request-store";
const ONBOARDING_CERTIFICATION_SESSION_ID = "pt1:onboarding:certification-request";

type AnonymousOnboardingFlowState = {
  step: OnboardingStep;
  drafts: CertificationWizardDraft[];
  /** Draft ids included in the submission package on the summary step (all drafts stay listed; toggling updates the left overview only). */
  summaryIncludedDraftIds?: string[];
  context: CustomerContext;
  wizardInitialStep: "intent" | "drafts";
  /** Prototype: which canned VAT scenario is selected (production: free-text VAT only). */
  prototypeVatPresetId: string;
  /** Helper copy under company-step fields after mock enrichment; cleared when the user edits that field. */
  companyFieldHints: RegistrationEnrichmentHints;
};

const DEFAULT_ONBOARDING_FLOW_STATE: AnonymousOnboardingFlowState = {
  step: "request",
  drafts: [],
  summaryIncludedDraftIds: [],
  context: DEFAULT_CONTEXT,
  wizardInitialStep: "intent",
  prototypeVatPresetId: DEFAULT_VAT_PROTOTYPE_PRESET_ID,
  companyFieldHints: {},
};

function stepIndex(step: OnboardingStep) {
  return ONBOARDING_STEPS.indexOf(step);
}

function onboardingReviewRequesterFromContext(
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

function buildRows(
  context: CustomerContext,
  drafts: readonly CertificationWizardDraft[],
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

const CERTIFICATION_PHASE_TITLE = "Start je certificatieaanvraag";
const CERTIFICATION_PHASE_DESCRIPTION =
  "Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een conceptaanvraag hebt samengesteld.";
const REGISTRATION_PHASE_TITLE = "Registratie";
const REGISTRATION_PHASE_DESCRIPTION =
  "Vertegenwoordiger, e-mail en ondernemingsnummer. Land leiden we af uit uw gevalideerde nummer; ontbrekende bedrijfsgegevens proberen we aan te vullen via een serverside koppeling op het volledige e-maildomein.";

function readInitialCompanyLookupPhase(): "idle" | "loading" | "ready" {
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

function AnonymousOnboardingShell({
  pageTitle,
  pageDescription,
  children,
}: {
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-svh bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-border/70 pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <img
                src={procertusLogo}
                alt="PROCERTUS, certification that builds trust"
                className="h-16 w-auto dark:hidden"
              />
              <img
                src={procertusLogo}
                alt="PROCERTUS, certification that builds trust"
                className="hidden h-16 w-auto brightness-0 invert dark:block"
              />
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {pageTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {pageDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="justify-center"
                onClick={() => navigate("/welcome")}
              >
                Aanmelden
              </Button>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function ContextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  description,
}: {
  id: keyof CustomerContext;
  label: string;
  value: string;
  onChange: (id: keyof CustomerContext, value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  description?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(event) => onChange(id, event.target.value)}
        />
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
    </Field>
  );
}

const COMPANY_FORM_FIELD_LABELS: Record<CompanyFormFieldKey, string> = {
  organizationName: "Bedrijfsnaam",
  country: "Land",
  addressStreet: "Straat",
  addressHouseNumber: "Huisnummer",
  addressPostalCode: "Postcode",
  addressCity: "Plaats",
};

function CompanyPrefillFormSkeleton({
  prefilledKeys,
  resolvedKeys,
}: {
  prefilledKeys: ReadonlySet<CompanyFormFieldKey>;
  resolvedKeys: ReadonlySet<CompanyFormFieldKey>;
}) {
  const FieldSkeleton = ({ field }: { field: CompanyFormFieldKey }) => {
    const label = COMPANY_FORM_FIELD_LABELS[field];
    if (!prefilledKeys.has(field)) {
      return (
        <Field>
          <FieldLabel>{label}</FieldLabel>
          <FieldContent>
            <div className="flex h-9 items-center rounded-md border border-dashed border-border/60 bg-muted/10 px-3 text-xs text-muted-foreground">
              Handmatig invullen
            </div>
          </FieldContent>
        </Field>
      );
    }
    const resolved = resolvedKeys.has(field);
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <Skeleton
            className={cn("h-9 w-full rounded-md", resolved ? "bg-muted/70" : "animate-pulse")}
          />
        </FieldContent>
      </Field>
    );
  };

  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Velden die automatisch worden ingevuld"
    >
      <FieldSkeleton field="organizationName" />
      <FieldSkeleton field="country" />
      <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
        <FieldSkeleton field="addressStreet" />
        <FieldSkeleton field="addressHouseNumber" />
        <FieldSkeleton field="addressPostalCode" />
        <FieldSkeleton field="addressCity" />
      </div>
    </div>
  );
}

const ADDRESS_DETAIL_KEYS: (keyof CustomerContext)[] = [
  "addressStreet",
  "addressHouseNumber",
  "addressPostalCode",
  "addressCity",
];

export function AnonymousOnboardingFlow() {
  const navigate = useNavigate();
  const [registrationSubmitOpen, setRegistrationSubmitOpen] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [registrationStepIndex, setRegistrationStepIndex] = useState(-1);
  const [flowState, setFlowState] = useLocalStorageState(
    ONBOARDING_FLOW_STORAGE_KEY,
    DEFAULT_ONBOARDING_FLOW_STATE,
  );
  const {
    drafts,
    step,
    wizardInitialStep,
    prototypeVatPresetId,
    companyFieldHints,
    summaryIncludedDraftIds,
  } = flowState;
  const context = useMemo(() => resolveFlowContext(flowState.context), [flowState.context]);
  const companyHints = companyFieldHints ?? {};

  const effectiveSummaryIncludedDraftIds = useMemo(() => {
    const ids = drafts.map((d) => d.id);
    if (summaryIncludedDraftIds === undefined) return ids;
    return summaryIncludedDraftIds.filter((id) => ids.includes(id));
  }, [drafts, summaryIncludedDraftIds]);

  const registrationSimulationLabels = useMemo(
    () => registrationSimulationStepLabels(effectiveSummaryIncludedDraftIds.length),
    [effectiveSummaryIncludedDraftIds.length],
  );

  useEffect(() => {
    if (!registrationSubmitOpen) return;
    let cancelled = false;
    const timeoutIds: number[] = [];
    const schedule = (delayMs: number, fn: () => void) => {
      timeoutIds.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, delayMs),
      );
    };
    schedule(150, () => {
      setRegistrationProgress(12);
      setRegistrationStepIndex(0);
    });
    schedule(750, () => {
      setRegistrationProgress(34);
      setRegistrationStepIndex(1);
    });
    schedule(1400, () => {
      setRegistrationProgress(56);
      setRegistrationStepIndex(2);
    });
    schedule(2100, () => {
      setRegistrationProgress(78);
      setRegistrationStepIndex(3);
    });
    schedule(2900, () => {
      if (!cancelled) {
        setRegistrationProgress(100);
      }
    });
    schedule(2900 + REGISTRATION_SUBMIT_REDIRECT_DELAY_MS, () => {
      if (!cancelled) {
        navigate(ONBOARDING_REGISTRATION_COMPLETE_PATH);
      }
    });
    return () => {
      cancelled = true;
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [registrationSubmitOpen, navigate]);

  const countrySelectOptions = useMemo(() => {
    const c = context.country?.trim();
    if (c && !REGISTRATION_COUNTRY_OPTIONS.includes(c)) {
      return [...REGISTRATION_COUNTRY_OPTIONS, c].sort((a, b) => a.localeCompare(b, "nl"));
    }
    return REGISTRATION_COUNTRY_OPTIONS;
  }, [context.country]);

  const countrySelectValue = useMemo(() => {
    const t = context.country?.trim() ?? "";
    return t && countrySelectOptions.includes(t) ? t : COUNTRY_SELECT_NONE;
  }, [context.country, countrySelectOptions]);

  const activeStep = stepIndex(step);
  const hasDrafts = drafts.length > 0;
  const hasCustomerContext =
    (context.representativeFirstName?.trim() ?? "").length > 0 &&
    (context.representativeLastName?.trim() ?? "").length > 0 &&
    (context.representativeEmail?.trim() ?? "").length > 0 &&
    (context.representativeRole?.trim() ?? "").length > 0 &&
    isVatIdentifierPlausible(context.vatNumber ?? "");
  const hasCompanyContext =
    (context.organizationName?.trim() ?? "").length > 0 &&
    (context.country?.trim() ?? "").length > 0 &&
    hasStructuredPostalAddress(context);
  const steps: OnboardingStepperStep[] = useMemo(
    () => [
      {
        id: "request",
        title: "Aanvraag",
        description:
          step !== "request" && drafts.length > 0
            ? `${drafts.length} concept${drafts.length === 1 ? "" : "en"} vastgelegd`
            : drafts.length > 0
              ? `${drafts.length} concepten`
              : "Start zonder account",
        available: true,
      },
      {
        id: "customer",
        title: "Registratie",
        description: formatRequesterStepperLabel(context),
        available: hasDrafts,
      },
      {
        id: "company",
        title: "Bedrijfsgegevens",
        description: context.organizationName || "Uit BTW-nummer",
        available: hasDrafts && hasCustomerContext,
      },
      {
        id: "summary",
        title: "Versturen",
        description: "Annvraag controleren",
        available: hasDrafts && hasCustomerContext && hasCompanyContext,
      },
    ],
    [context, drafts.length, hasCompanyContext, hasCustomerContext, hasDrafts, step],
  );

  const updateContext = (id: keyof CustomerContext, value: string) => {
    setFlowState((prev) => {
      const nextHints = { ...prev.companyFieldHints };
      if (id === "organizationName" || id === "country") {
        delete nextHints[id];
      }
      if (ADDRESS_DETAIL_KEYS.includes(id)) {
        delete nextHints.addressStreet;
      }
      return {
        ...prev,
        companyFieldHints: nextHints,
        context: resolveFlowContext({ ...prev.context, [id]: value }),
      };
    });
  };

  /** Normalize context from storage (missing keys, legacy `representativeName`, step/preset fixes). */
  useEffect(() => {
    setFlowState((prev) => {
      const fixes: Partial<AnonymousOnboardingFlowState> = {};
      let migratedStep = prev.step;
      if ((migratedStep as string) === "kyc") migratedStep = "company";
      if ((migratedStep as string) === "profile") migratedStep = "summary";
      if ((migratedStep as string) === "activation") migratedStep = "summary";
      if (!ONBOARDING_STEPS.includes(migratedStep)) migratedStep = "request";
      if (migratedStep !== prev.step) {
        fixes.step = migratedStep;
      }
      if (prev.summaryIncludedDraftIds === undefined && prev.drafts.length > 0) {
        fixes.summaryIncludedDraftIds = prev.drafts.map((d) => d.id);
      }
      if (!prev.prototypeVatPresetId) {
        fixes.prototypeVatPresetId = DEFAULT_VAT_PROTOTYPE_PRESET_ID;
      }
      if (prev.companyFieldHints === undefined) {
        fixes.companyFieldHints = {};
      }
      const nextContext = resolveFlowContext(
        prev.context as Partial<CustomerContext> & {
          representativeName?: string;
          kycNotes?: string;
          address?: string;
        },
      );
      if (JSON.stringify(nextContext) !== JSON.stringify(prev.context)) {
        fixes.context = nextContext;
      }
      return Object.keys(fixes).length === 0 ? prev : { ...prev, ...fixes };
    });
  }, [setFlowState]);

  const activeVatPreset = useMemo(
    () => findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0],
    [prototypeVatPresetId],
  );

  const vatLookupStepLabels = useMemo(
    () => vatLookupSimulationStepsForPreset(activeVatPreset),
    [activeVatPreset],
  );

  const [companyLookupPhase, setCompanyLookupPhase] = useState<"idle" | "loading" | "ready">(
    readInitialCompanyLookupPhase,
  );
  const [lookupProgress, setLookupProgress] = useState(0);
  const [lookupStepIndex, setLookupStepIndex] = useState(-1);

  useEffect(() => {
    if (step !== "company") return;
    const preset = findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0];
    if (!preset) return;

    const timeoutIds: number[] = [];
    const scheduleLookup = (delayMs: number, fn: () => void) => {
      timeoutIds.push(window.setTimeout(fn, delayMs));
    };

    scheduleLookup(150, () => {
      setLookupProgress(12);
      setLookupStepIndex(0);
    });
    scheduleLookup(700, () => {
      setLookupProgress(30);
      setLookupStepIndex(1);
    });
    scheduleLookup(1300, () => {
      setLookupProgress(48);
      setLookupStepIndex(2);
    });
    scheduleLookup(1900, () => {
      setLookupProgress(64);
      setLookupStepIndex(3);
    });
    scheduleLookup(2500, () => {
      setLookupProgress(80);
      setLookupStepIndex(4);
    });
    scheduleLookup(3300, () => {
      setFlowState((prev) => {
        const baseContext = resolveFlowContext(
          prev.context as Partial<CustomerContext> & {
            representativeName?: string;
            kycNotes?: string;
            address?: string;
          },
        );
        const enriched = enrichRegistrationContext({
          vatNumber: baseContext.vatNumber,
          representativeEmail: baseContext.representativeEmail,
          preset,
        });
        const { hints, ...enrichedFields } = enriched;
        return {
          ...prev,
          companyFieldHints: hints,
          context: resolveFlowContext({
            ...baseContext,
            ...enrichedFields,
          }),
        };
      });
      setLookupProgress(100);
      setCompanyLookupPhase("ready");
    });

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [step, prototypeVatPresetId, setFlowState]);

  const companyPrefillFieldKeys = useMemo(
    () =>
      companyFormFieldsPrefilledByMockLookup({
        vatNumber: context.vatNumber,
        representativeEmail: context.representativeEmail,
        preset: activeVatPreset,
      }),
    [activeVatPreset, context.representativeEmail, context.vatNumber],
  );

  const completedCompanySimulationStepIndex = useMemo(() => {
    if (companyLookupPhase === "ready" || lookupProgress >= 100) return 4;
    if (lookupStepIndex <= 0) return -1;
    return Math.min(lookupStepIndex - 1, 4);
  }, [companyLookupPhase, lookupProgress, lookupStepIndex]);

  const companyFieldsResolvedInSimulation = useMemo(
    () =>
      companyFormFieldsResolvedThroughLookupStep(completedCompanySimulationStepIndex, {
        vatNumber: context.vatNumber,
        representativeEmail: context.representativeEmail,
        preset: activeVatPreset,
      }),
    [
      activeVatPreset,
      completedCompanySimulationStepIndex,
      context.representativeEmail,
      context.vatNumber,
    ],
  );

  const vatNumberForDisplay = context.vatNumber.trim();
  const emailForDisplay = context.representativeEmail.trim();

  const goToOnboardingStep = (nextStep: OnboardingStep) => {
    const targetIndex = stepIndex(nextStep);
    if (steps[targetIndex]?.available === false) {
      return;
    }
    if (nextStep === "company") {
      setCompanyLookupPhase("loading");
      setLookupProgress(0);
      setLookupStepIndex(-1);
    }
    if (nextStep === "request") {
      setFlowState((prev) => ({
        ...prev,
        step: nextStep,
        wizardInitialStep: prev.drafts.length > 0 ? "drafts" : "intent",
      }));
      return;
    }
    setFlowState((prev) => ({
      ...prev,
      step: nextStep,
      ...(nextStep === "company" ? { companyFieldHints: {} } : {}),
    }));
  };

  const registrationCompleteRedirect = useMemo(
    () => readOnboardingRegistrationCompletePayload(),
    [],
  );
  if (registrationCompleteRedirect) {
    return <Navigate to={ONBOARDING_REGISTRATION_COMPLETE_PATH} replace />;
  }

  if (step === "request") {
    return (
      <AnonymousOnboardingShell
        pageTitle={CERTIFICATION_PHASE_TITLE}
        pageDescription={CERTIFICATION_PHASE_DESCRIPTION}
      >
        <CertificationRequestWizard
          mode="onboarding"
          initialDrafts={drafts}
          initialStep={wizardInitialStep}
          backendKind="localStorage"
          storageKey={CERTIFICATION_REQUEST_STORAGE_KEY}
          sessionId={ONBOARDING_CERTIFICATION_SESSION_ID}
          reviewRequester={onboardingReviewRequesterFromContext(context)}
          onCancel={() => navigate("/welcome")}
          onComplete={(nextDrafts) => {
            setFlowState((prev) => {
              const prevDraftIds = new Set(prev.drafts.map((d) => d.id));
              const nextIds = nextDrafts.map((d) => d.id);
              const baseSel = prev.summaryIncludedDraftIds ?? Array.from(prevDraftIds);
              const keptSelection = baseSel.filter(
                (id) => nextIds.includes(id) && prevDraftIds.has(id),
              );
              const newDraftIds = nextIds.filter((id) => !prevDraftIds.has(id));
              const nextSummaryIncluded = Array.from(new Set([...keptSelection, ...newDraftIds]));
              return {
                ...prev,
                drafts: nextDrafts,
                wizardInitialStep: "drafts",
                step: "customer",
                summaryIncludedDraftIds: nextSummaryIncluded,
              };
            });
          }}
        />
      </AnonymousOnboardingShell>
    );
  }

  const primaryAction: StepLayoutAction =
    step === "customer"
      ? {
          label: "Verder",
          onClick: () => goToOnboardingStep("company"),
          disabled: !hasCustomerContext,
        }
      : step === "company"
        ? {
            label: "Verder",
            onClick: () => setFlowState((prev) => ({ ...prev, step: "summary" })),
            disabled: !hasCompanyContext || companyLookupPhase !== "ready",
          }
        : step === "summary"
          ? {
              label: "Versturen",
              onClick: () => {
                const certificationStoreRaw =
                  typeof localStorage !== "undefined"
                    ? localStorage.getItem(ONBOARDING_CERTIFICATION_STORE_STORAGE_KEY)
                    : null;
                writeOnboardingRegistrationCompletePayload({
                  representativeEmail: context.representativeEmail.trim(),
                  organizationName: context.organizationName.trim(),
                  includedInquiryCount: effectiveSummaryIncludedDraftIds.length,
                  flowStateSnapshot: flowState,
                  certificationStoreRaw,
                });
                setRegistrationProgress(0);
                setRegistrationStepIndex(-1);
                setRegistrationSubmitOpen(true);
              },
              disabled:
                !hasDrafts ||
                effectiveSummaryIncludedDraftIds.length === 0 ||
                registrationSubmitOpen,
            }
          : { label: "Doorgaan", onClick: () => {}, disabled: true };

  return (
    <>
      <AnonymousOnboardingShell
        pageTitle={REGISTRATION_PHASE_TITLE}
        pageDescription={REGISTRATION_PHASE_DESCRIPTION}
      >
        <StepLayout
          className="w-full"
          variant="onboarding"
          stepper={
            <OnboardingStepper
              steps={steps}
              activeStep={activeStep}
              onStepChange={(index) => {
                const nextStep = ONBOARDING_STEPS[index];
                if (nextStep) {
                  goToOnboardingStep(nextStep);
                }
              }}
              interactive
            />
          }
          title={
            step === "customer"
              ? "Uw gegevens"
              : step === "company"
                ? "Bedrijf en adres"
                : "Samenvatting"
          }
          description={
            step === "customer"
              ? "Wie registreert en het btw- of ondernemingsnummer van uw organisatie."
              : step === "company"
                ? "We combineren uw nummer met openbare registers en, waar dat onvoldoende is, met gegevens over de onderneming achter uw e-maildomein (serverside)."
                : "Controleer uw gegevens en de aanvragen voordat u indient."
          }
          stepLabel={`Onboarding · stap ${activeStep + 1} van ${steps.length}`}
          backAction={{
            label: step === "customer" ? "Terug" : "Terug",
            onClick: () => {
              const previous = ONBOARDING_STEPS[Math.max(0, activeStep - 1)];
              setFlowState((prev) => ({ ...prev, step: previous }));
            },
          }}
          primaryAction={primaryAction}
        >
          {step === "customer" ? (
            <div className="space-y-6">
              <PrototypeCard
                title="Prototype"
                description={
                  <>
                    In deze demo kiest u een voorbeeldnummer uit de lijst. In de echte toepassing
                    typt u uw eigen nummer in; we controleren of het geldig is opgebouwd vóór we
                    gegevens ophalen. Bij een ander voorbeeld worden naam, titel, rol en het
                    demo-e-mailadres automatisch aangepast; bedrijfsgegevens worden leeggemaakt tot
                    na de mock-lookup.
                  </>
                }
                notice={
                  activeVatPreset.demoSupplementsOrgAddressFromEmailDomain ? (
                    <>
                      <span className="font-medium text-foreground">
                        Dit voorbeeld (FR / DE / VS):
                      </span>{" "}
                      het register levert geen bedrijfsnaam noch vestigingsadres uit het nummer. In
                      de demo worden die gegevens — als uw e-maildomein in de mock voorkomt —
                      serverside ingevuld op basis van het{" "}
                      <span className="font-medium text-foreground">registratiedomein</span> van uw
                      e-mail (niet enkel het land uit de TLD).
                    </>
                  ) : undefined
                }
              >
                <Field>
                  <FieldLabel htmlFor="prototype-vat-preset">
                    Voorbeeld btw- / ondernemingsnummer
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={prototypeVatPresetId}
                      onValueChange={(id) => {
                        const preset = findVatPrototypePreset(id) ?? VAT_PROTOTYPE_PRESETS[0];
                        if (!preset) return;
                        setFlowState((prev) => ({
                          ...prev,
                          prototypeVatPresetId: id,
                          companyFieldHints: {},
                          context: resolveFlowContext({
                            ...prev.context,
                            ...getPersonContextFieldsForPrototypePreset(preset),
                            vatNumber: preset.vatNumber,
                            organizationName: "",
                            country: "",
                            addressStreet: "",
                            addressHouseNumber: "",
                            addressPostalCode: "",
                            addressCity: "",
                          }),
                        }));
                      }}
                    >
                      <SelectTrigger
                        id="prototype-vat-preset"
                        className="h-auto min-h-9 w-full py-2 whitespace-normal"
                      >
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {VAT_PROTOTYPE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </PrototypeCard>
              <ContextField
                id="vatNumber"
                label="Btw- of ondernemingsnummer"
                value={context.vatNumber}
                onChange={updateContext}
                readOnly
              />
              <div className="grid gap-4 md:grid-cols-2">
                <ContextField
                  id="representativeFirstName"
                  label="Voornaam"
                  value={context.representativeFirstName}
                  onChange={updateContext}
                />
                <ContextField
                  id="representativeLastName"
                  label="Achternaam"
                  value={context.representativeLastName}
                  onChange={updateContext}
                />
              </div>
              <Field>
                <FieldLabel htmlFor="representativeEmail">E-mail</FieldLabel>
                <FieldContent>
                  <Input
                    id="representativeEmail"
                    type="email"
                    autoComplete="email"
                    value={context.representativeEmail}
                    onChange={(event) => updateContext("representativeEmail", event.target.value)}
                  />
                </FieldContent>
              </Field>
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="representativeTitlePreset">Titel</FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        REPRESENTATIVE_TITLE_PRESETS.some(
                          (p) => p.id === context.representativeTitlePreset,
                        )
                          ? context.representativeTitlePreset
                          : "none"
                      }
                      onValueChange={(id) => {
                        if (id === "other") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeTitlePreset: id,
                            }),
                          }));
                          return;
                        }
                        if (id === "none") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeTitlePreset: id,
                              representativeTitle: "",
                            }),
                          }));
                          return;
                        }
                        const label = titleLabelForPresetId(id);
                        setFlowState((prev) => ({
                          ...prev,
                          context: resolveFlowContext({
                            ...prev.context,
                            representativeTitlePreset: id,
                            representativeTitle: label,
                          }),
                        }));
                      }}
                    >
                      <SelectTrigger id="representativeTitlePreset" className="w-full">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPRESENTATIVE_TITLE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                {context.representativeTitlePreset === "other" ? (
                  <Field>
                    <FieldLabel htmlFor="representativeTitle">Titel (vrij)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="representativeTitle"
                        value={context.representativeTitle}
                        onChange={(event) =>
                          updateContext("representativeTitle", event.target.value)
                        }
                        placeholder="Bv. lic., doctor honoris causa"
                      />
                      <FieldDescription>Vul uw titel.</FieldDescription>
                    </FieldContent>
                  </Field>
                ) : null}
              </div>
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="representativeRolePreset">
                    Rol binnen de organisatie
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        REPRESENTATIVE_ROLE_PRESETS.some(
                          (p) => p.id === context.representativeRolePreset,
                        )
                          ? context.representativeRolePreset
                          : "managing_director"
                      }
                      onValueChange={(id) => {
                        if (id === "other") {
                          setFlowState((prev) => ({
                            ...prev,
                            context: resolveFlowContext({
                              ...prev.context,
                              representativeRolePreset: id,
                              representativeRole: "",
                            }),
                          }));
                          return;
                        }
                        const label = roleLabelForPresetId(id);
                        setFlowState((prev) => ({
                          ...prev,
                          context: resolveFlowContext({
                            ...prev.context,
                            representativeRolePreset: id,
                            representativeRole: label,
                          }),
                        }));
                      }}
                    >
                      <SelectTrigger id="representativeRolePreset" className="w-full">
                        <SelectValue placeholder="Kies" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPRESENTATIVE_ROLE_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                {context.representativeRolePreset === "other" ? (
                  <Field>
                    <FieldLabel htmlFor="representativeRole">Functieomschrijving</FieldLabel>
                    <FieldContent>
                      <Input
                        id="representativeRole"
                        value={context.representativeRole}
                        onChange={(event) =>
                          updateContext("representativeRole", event.target.value)
                        }
                        placeholder="Bv. projectleider extern"
                      />
                      <FieldDescription>Verplicht: beschrijf uw rol.</FieldDescription>
                    </FieldContent>
                  </Field>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "company" ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Btw-nummer
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {vatNumberForDisplay || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      E-mail
                    </p>
                    <p className="mt-1 break-all text-sm text-foreground">
                      {emailForDisplay || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {companyLookupPhase === "loading" ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">Bezig met ophalen</span>
                      <span className="tabular-nums text-muted-foreground">
                        {Math.round(lookupProgress)}%
                      </span>
                    </div>
                    <Progress
                      value={lookupProgress}
                      className="h-2"
                      aria-label="Voortgang gegevensophaling"
                    />
                  </div>
                  <ul className="space-y-2.5" aria-live="polite">
                    {vatLookupStepLabels.map((item, index) => {
                      const done = lookupStepIndex > index;
                      const active = lookupStepIndex === index;
                      return (
                        <li
                          key={item.id}
                          className={cn(
                            "flex gap-3 text-sm transition-colors",
                            done || active ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 size-2 shrink-0 rounded-full",
                              done
                                ? "bg-primary"
                                : active
                                  ? "bg-primary animate-pulse"
                                  : "bg-muted-foreground/30",
                            )}
                            aria-hidden
                          />
                          <span>{item.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <CompanyPrefillFormSkeleton
                    prefilledKeys={companyPrefillFieldKeys}
                    resolvedKeys={companyFieldsResolvedInSimulation}
                  />
                </div>
              ) : null}

              {companyLookupPhase === "ready" && activeVatPreset ? (
                <>
                  <Alert variant="warning">
                    <HugeiconsIcon icon={Alert01Icon} aria-hidden className="size-4 shrink-0" />
                    <AlertTitle className="flex flex-wrap items-center gap-2">
                      <span>{activeVatPreset.outcomeLabel}</span>
                      <Badge variant="warning">
                        {
                          VAT_LOOKUP_OUTCOME_LABELS[
                            activeVatPreset.mock.outcome as VatLookupMockOutcome
                          ]
                        }
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>{activeVatPreset.outcomeMessage}</AlertDescription>
                  </Alert>
                  {activeVatPreset.demoSupplementsOrgAddressFromEmailDomain ? (
                    <PrototypeCard
                      title="Aanvulling via e-maildomein"
                      description={
                        <>
                          Voor dit scenario komt de{" "}
                          <span className="font-medium text-foreground">bedrijfsnaam</span> en het{" "}
                          <span className="font-medium text-foreground">volledige adres</span> niet
                          uit het btw-/ondernemingsregister in de demo. Ze worden hier ingevuld via
                          het <span className="font-medium text-foreground">registratiedomein</span>{" "}
                          van het e-mailadres dat u eerder opgaf (serverside mock). Controleer de
                          velden; bij een generiek mailboxdomein blijven ze leeg tot u ze zelf
                          invult.
                        </>
                      }
                      cardContentClassName="hidden"
                    >
                      {null}
                    </PrototypeCard>
                  ) : null}
                  <div className="grid gap-4 md:grid-cols-2">
                    <ContextField
                      id="organizationName"
                      label="Bedrijfsnaam"
                      value={context.organizationName}
                      onChange={updateContext}
                      placeholder="Zoals geregistreerd"
                      description={companyHints.organizationName}
                    />
                    <Field>
                      <FieldLabel htmlFor="country">Land</FieldLabel>
                      <FieldContent>
                        <Select
                          value={countrySelectValue}
                          onValueChange={(v) =>
                            updateContext("country", v === COUNTRY_SELECT_NONE ? "" : v)
                          }
                        >
                          <SelectTrigger id="country" className="w-full">
                            <SelectValue placeholder="Kies een land" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={COUNTRY_SELECT_NONE}>Kies een land</SelectItem>
                            {countrySelectOptions.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {companyHints.country ? (
                          <FieldDescription>{companyHints.country}</FieldDescription>
                        ) : null}
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
                      <ContextField
                        id="addressStreet"
                        label="Straat"
                        value={context.addressStreet}
                        onChange={updateContext}
                        placeholder="Straatnaam"
                        description={companyHints.addressStreet}
                      />
                      <ContextField
                        id="addressHouseNumber"
                        label="Huisnummer"
                        value={context.addressHouseNumber}
                        onChange={updateContext}
                        placeholder="Bv. 12 of 12B"
                      />
                      <ContextField
                        id="addressPostalCode"
                        label="Postcode"
                        value={context.addressPostalCode}
                        onChange={updateContext}
                        placeholder="Post- of postcode"
                      />
                      <ContextField
                        id="addressCity"
                        label="Plaats"
                        value={context.addressCity}
                        onChange={updateContext}
                        placeholder="Gemeente of stad"
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {step === "summary" ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)]">
              <RequestPackageReview
                title="Coordinated intake"
                description="Klantcontext, validatiecontext en aanvraagset worden samen ingediend."
                requester={onboardingReviewRequesterFromContext(context)}
                rows={buildRows(context, drafts, effectiveSummaryIncludedDraftIds)}
                notice={
                  drafts.length > 0 && effectiveSummaryIncludedDraftIds.length < drafts.length ? (
                    <Badge variant="secondary">
                      {effectiveSummaryIncludedDraftIds.length} van {drafts.length} in aanvraag
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {drafts.length} certificatievragen in aanvraag
                    </Badge>
                  )
                }
              />
              <Card className="w-full max-w-3xl overflow-hidden lg:max-w-none">
                <CardHeader>
                  <CardTitle>Aanvragen</CardTitle>
                  <CardDescription>
                    Pas uw selectie van certificatieaanvragen nog aan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {drafts.length === 0 ? (
                    <>
                      <p className="m-0 text-sm text-muted-foreground" role="status">
                        Geen conceptaanvragen.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => goToOnboardingStep("request")}
                      >
                        Aanvraag wijzigen
                      </Button>
                    </>
                  ) : (
                    <>
                      <SelectChoiceCardGroup selectionMode="multiple">
                        <CardList
                          items={sortDraftsByIntentAndProduct(drafts)}
                          widthClass="@min-[40rem]:grid-cols-1"
                        >
                          {(draft) => (
                            <SelectChoiceCard
                              key={draft.id}
                              selectionMode="multiple"
                              value={draft.id}
                              controlId={`onboarding-summary-draft-${draft.id}`}
                              title={draft.label}
                              description={<DraftCardDescription draft={draft} />}
                              checked={effectiveSummaryIncludedDraftIds.includes(draft.id)}
                              onCheckedChange={(checked) => {
                                setFlowState((prev) => {
                                  const ids = prev.drafts.map((d) => d.id);
                                  const base = prev.summaryIncludedDraftIds ?? [...ids];
                                  const next = checked
                                    ? Array.from(new Set([...base, draft.id]))
                                    : base.filter((id) => id !== draft.id);
                                  return { ...prev, summaryIncludedDraftIds: next };
                                });
                              }}
                              emphasis="primary"
                            />
                          )}
                        </CardList>
                      </SelectChoiceCardGroup>
                      <div className="border-t border-border/60 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => goToOnboardingStep("request")}
                        >
                          Aanvraag wijzigen
                        </Button>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          Ga terug naar de wizard om aanvragen toe te voegen, te verwijderen of
                          opnieuw samen te stellen.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </StepLayout>
      </AnonymousOnboardingShell>

      <Dialog
        open={registrationSubmitOpen}
        onOpenChange={(next) => {
          if (next) setRegistrationSubmitOpen(true);
        }}
      >
        <DialogContent showCloseButton={false} className="max-w-lg gap-5 sm:max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle>Registratie verwerken</DialogTitle>
            <DialogDescription className="text-pretty">
              Even geduld: we slaan uw gegevens en aanvragen op en bereiden uw account voor (demo).
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <HugeiconsIcon
              icon={Loading03Icon}
              className="mt-0.5 size-8 shrink-0 animate-spin text-primary"
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0 text-left text-sm leading-relaxed text-muted-foreground">
              <p className="m-0 font-medium text-foreground">Registratie wordt voltooid</p>
              <p className="mt-1 m-0">
                Prototype: we simuleren het aanmaken van uw account, het opslaan van uw gegevens en
                het koppelen van uw aanvragen.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">Voortgang</span>
              <span className="tabular-nums text-muted-foreground">
                {Math.round(registrationProgress)}%
              </span>
            </div>
            <Progress
              value={registrationProgress}
              className="h-2"
              aria-label="Voortgang registratie"
            />
          </div>
          <ul
            className="max-h-[min(40vh,16rem)] space-y-2.5 overflow-y-auto text-left pr-1"
            aria-live="polite"
          >
            {registrationSimulationLabels.map((item, index) => {
              const done = registrationStepIndex > index;
              const active = registrationStepIndex === index;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex gap-3 text-sm transition-colors",
                    done || active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-2 shrink-0 rounded-full",
                      done
                        ? "bg-primary"
                        : active
                          ? "animate-pulse bg-primary"
                          : "bg-muted-foreground/30",
                    )}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
