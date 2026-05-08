import {
  ONBOARDING_FLOW_STORAGE_KEY,
  createLocalStorageOnboardingFlowPersistence,
  hydrateOnboardingFlowStateFromStored,
  type CertificationRequestDraft,
  type CustomerContext,
  type OnboardingFlowState,
} from "@procertus-ui/ui-certification";

/**
 * Vanaf welk punt in de TrajectFlow het formulier is geopend. Een afwezige stempel betekent
 * dat de gebruiker vanuit de Wegwijzer-hero binnenkomt zonder eerder traject-context op te bouwen.
 */
export type TrajectEntryPoint = "wegwijzer-detail" | "triage";

/** Geldige waarden voor `?from=...` op een expert-call URL. */
export const TRAJECT_ENTRY_POINTS: readonly TrajectEntryPoint[] = [
  "wegwijzer-detail",
  "triage",
];

export const TRAJECT_ENTRY_POINT_QUERY_PARAM = "from";

/**
 * Cumulatieve breadcrumbs die met een TrajectFlow-formulier worden meegestuurd. Velden zijn
 * optioneel: ze worden alleen ingevuld zodra de gebruiker het bijhorende punt in de flow heeft
 * bereikt. Een leeg object = "geen context, generieke aanvraag vanaf de hero".
 */
export type TrajectSubmissionContext = {
  entryPoint?: TrajectEntryPoint;
  /** Wegwijzer service id wanneer er al een specifiek certificaat in beeld is. */
  serviceId?: string;
  /** Geconfigureerde aanvraagpakketten uit de TrajectConfigureFlow wizard (alleen vanaf triage). */
  drafts?: CertificationRequestDraft[];
  /** Vrijblijvende informatieaanvraag vs. formele aanvraag, indien Triage al gepasseerd is. */
  intent?: "informational" | "formal";
  /** Klantgegevens uit de CustomerOnboardingFlow, indien beschikbaar (alleen na Nazicht-submit). */
  customer?: Pick<
    CustomerContext,
    | "representativeFirstName"
    | "representativeLastName"
    | "representativeEmail"
    | "organizationName"
  >;
};

export function isTrajectEntryPoint(value: string | null | undefined): value is TrajectEntryPoint {
  return value != null && TRAJECT_ENTRY_POINTS.includes(value as TrajectEntryPoint);
}

/**
 * Lees een snapshot van de OnboardingFlowProvider state direct uit localStorage zonder een
 * provider te mounten. Bedoeld voor pagina's die enkel willen zien "wat de gebruiker tot nu toe
 * deed" zonder zelf state-updates te doen.
 */
export function readOnboardingFlowSnapshot(): OnboardingFlowState {
  const port = createLocalStorageOnboardingFlowPersistence({
    storageKey: ONBOARDING_FLOW_STORAGE_KEY,
  });
  return hydrateOnboardingFlowStateFromStored(port.load());
}

/**
 * Wis de traject-breadcrumbs (serviceId, drafts) uit de gepersisteerde state. Aangeroepen wanneer
 * de gebruiker bewust uit een eerder traject stapt en met een verse intentie opnieuw begint, bv.
 * de hero "Plan een expert call" knop op de Wegwijzer.
 */
export function clearTrajectBreadcrumbs(): void {
  const port = createLocalStorageOnboardingFlowPersistence({
    storageKey: ONBOARDING_FLOW_STORAGE_KEY,
  });
  const stored = port.load();
  if (!stored) return;
  port.save({
    ...stored,
    trajectServiceId: "",
    drafts: [],
    summaryIncludedDraftIds: [],
  });
}

export type BuildTrajectSubmissionContextInput = {
  entryPoint: TrajectEntryPoint | undefined;
  /** ServiceId uit de URL param. Heeft voorrang op de id die in flowState staat. */
  urlServiceId?: string;
  flowState: OnboardingFlowState;
};

/** Stelt het context-pakket samen op basis van entry-point en de huidige flow state. */
export function buildTrajectSubmissionContext(
  input: BuildTrajectSubmissionContextInput,
): TrajectSubmissionContext {
  const { entryPoint, urlServiceId, flowState } = input;
  if (!entryPoint) {
    return {};
  }
  const ctx: TrajectSubmissionContext = { entryPoint };
  const serviceId = urlServiceId || flowState.trajectServiceId;
  if (serviceId) ctx.serviceId = serviceId;
  if (entryPoint === "triage") {
    if (flowState.drafts.length > 0) ctx.drafts = flowState.drafts;
    ctx.intent = "informational";
  }
  return ctx;
}
