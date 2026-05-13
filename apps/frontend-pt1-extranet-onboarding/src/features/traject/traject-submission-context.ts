import {
  DEFAULT_ONBOARDING_FLOW_STATE,
  ONBOARDING_FLOW_STORAGE_KEY,
  clearOnboardingStorage,
  createLocalStorageOnboardingFlowPersistence,
  draftBelongsToTrajectRoot,
  hydrateOnboardingFlowStateFromStored,
  type CertificationRequestDraft,
  type CustomerContext,
  type OnboardingFlowApi,
  type OnboardingFlowState,
} from "@procertus-ui/ui-certification";

export { draftBelongsToTrajectRoot } from "@procertus-ui/ui-certification";

/**
 * Vanaf welk punt in de TrajectFlow het formulier is geopend. Een afwezige stempel betekent
 * dat de gebruiker vanuit de Wegwijzer-hero binnenkomt zonder eerder traject-context op te bouwen.
 */
export type TrajectEntryPoint = "wegwijzer-detail" | "triage";

/** Geldige waarden voor `?from=...` op een expert-call URL. */
export const TRAJECT_ENTRY_POINTS: readonly TrajectEntryPoint[] = ["wegwijzer-detail", "triage"];

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
 * Lees onboarding-state rechtstreeks uit localStorage (zonder provider).
 * **Voor gast-shell flows onder {@link OnboardingFlowProvider}:** gebruik
 * {@link useOnboardingFlowState} als bron van waarheid zodat geheugen en storage synchroon blijven.
 */
export function readOnboardingFlowSnapshot(): OnboardingFlowState {
  const port = createLocalStorageOnboardingFlowPersistence({
    storageKey: ONBOARDING_FLOW_STORAGE_KEY,
  });
  return hydrateOnboardingFlowStateFromStored(port.load());
}

/** Aantal unieke product-IDs in het pakket voor de opgegeven wegwijzer-route. */
export function countDistinctProductsForTrajectService(
  drafts: readonly CertificationRequestDraft[],
  serviceId: string,
): number {
  const seen = new Set<string>();
  for (const d of drafts) {
    if (!d.productId?.trim()) continue;
    if (draftBelongsToTrajectRoot(d, serviceId)) seen.add(d.productId);
  }
  return seen.size;
}

/**
 * Voor wegwijzer-keuzebalk en -kaarten: is er activiteit voor deze route, en zo ja
 * een weergaveteller (unieke producten, of 1 bij een niet-productgebonden placeholder).
 */
export function trajectRouteChoiceStats(
  drafts: readonly CertificationRequestDraft[],
  serviceId: string,
): { selected: boolean; amount?: number } {
  const productCount = countDistinctProductsForTrajectService(drafts, serviceId);
  const hasAny = drafts.some((d) => draftBelongsToTrajectRoot(d, serviceId));
  if (!hasAny) return { selected: false };
  if (productCount > 0) return { selected: true, amount: productCount };
  return { selected: true, amount: 1 };
}

/**
 * Wis de traject-breadcrumbs (serviceId, drafts) uit de gepersisteerde state, maar laat klant- en
 * registratiegegevens staan. Aangeroepen wanneer de gebruiker bewust uit een eerder traject stapt en
 * met een verse intentie opnieuw begint, bv. de hero "Plan een expert call" knop op de Wegwijzer.
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
    formalRequestPackageCommitted: false,
  });
}

/**
 * Volledige reset van de TrajectFlow + CustomerOnboardingFlow state. Gebruikt door de "Annuleren"
 * acties: gebruiker geeft expliciet aan dat hij niet verder kan of wil, dus alle gegevens worden
 * gewist en hij start opnieuw vanaf de Wegwijzer.
 *
 * Wist alle drie de gerelateerde localStorage keys. Geef optioneel een `OnboardingFlowApi` mee
 * (alleen relevant wanneer een provider gemount is, zoals in `CustomerOnboardingFlow`) zodat de
 * in-memory state ook resetten en de provider niets terugschrijft naar localStorage.
 */
export function resetTrajectFlow(api?: OnboardingFlowApi): void {
  if (api) api.setFlowState(DEFAULT_ONBOARDING_FLOW_STATE);
  clearOnboardingStorage();
}

/** Eerste wint — concept-ids zijn uniek bedoeld; voorkomt dubbele merges (bv. bundel+pakket). */
function dedupeDraftsById(list: CertificationRequestDraft[]): CertificationRequestDraft[] {
  const seen = new Set<string>();
  const out: CertificationRequestDraft[] = [];
  for (const d of list) {
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    out.push(d);
  }
  return out;
}

/** Niet-productgebonden aanvragen: maximaal één per certificaat-route (`entryId`). */
function dedupeStandaloneInquiriesByEntryId(
  list: CertificationRequestDraft[],
): CertificationRequestDraft[] {
  const seenEntry = new Set<string>();
  const out: CertificationRequestDraft[] = [];
  for (const d of list) {
    const productBound = Boolean(d.productId?.trim() || d.productLabel?.trim());
    if (!productBound) {
      if (seenEntry.has(d.entryId)) continue;
      seenEntry.add(d.entryId);
    }
    out.push(d);
  }
  return out;
}

/**
 * Zuivere merge van traject-handoff in een bestaande {@link OnboardingFlowState}.
 * Gebruik via {@link useOnboardingFlowState}.`setFlowState` zodat de provider en
 * localStorage synchroon blijven; alleen {@link persistTrajectHandoff} schrijft nog
 * rechtstreeks naar storage wanneer er geen provider is.
 */
export function reduceTrajectHandoffState(
  stored: OnboardingFlowState,
  input: {
    drafts: CertificationRequestDraft[];
    serviceId: string;
    replaceAll?: boolean;
  },
): OnboardingFlowState {
  const tagRoot = (d: CertificationRequestDraft): CertificationRequestDraft => ({
    ...d,
    trajectRootServiceId: d.trajectRootServiceId ?? input.serviceId,
  });
  const incoming = input.drafts.map(tagRoot);

  const mergedDraftsRaw =
    input.replaceAll === true
      ? incoming
      : [
          ...stored.drafts.filter((d) => !draftBelongsToTrajectRoot(d, input.serviceId)),
          ...incoming,
        ];
  const mergedDrafts = dedupeStandaloneInquiriesByEntryId(dedupeDraftsById(mergedDraftsRaw));

  const prevDraftIds = new Set(stored.drafts.map((d) => d.id));
  const mergedIds = new Set(mergedDrafts.map((d) => d.id));
  const prevSel = stored.summaryIncludedDraftIds ?? Array.from(prevDraftIds);
  const keptSelection = prevSel.filter((id) => mergedIds.has(id));
  const brandNewIds = incoming.map((d) => d.id).filter((id) => !prevDraftIds.has(id));
  const nextSummaryIncluded = Array.from(new Set([...keptSelection, ...brandNewIds]));

  return {
    ...stored,
    drafts: mergedDrafts,
    trajectServiceId: input.serviceId,
    summaryIncludedDraftIds: nextSummaryIncluded,
  };
}

/**
 * Schrijft de wizard-output (drafts + service id) door naar de OnboardingFlow-state in
 * localStorage. CustomerOnboardingFlow leest deze state bij het mounten en kan zo doorgaan
 * vanaf de "origin"-stap met de samengestelde aanvraagpakketten.
 *
 * Standaard **wordt samengevoegd** met bestaande drafts: alles wat bij dezelfde
 * `trajectRootServiceId` / route hoort wordt vervangen door `drafts`, andere routes blijven staan.
 * Zet `replaceAll: true` voor een volledige vervanging (Zelden; bv. tests).
 *
 * Binnen de app: liever `setFlowState(prev => reduceTrajectHandoffState(prev, input))` zodat
 * {@link OnboardingFlowProvider} de single source of truth blijft.
 */
export function persistTrajectHandoff(input: {
  drafts: CertificationRequestDraft[];
  serviceId: string;
  replaceAll?: boolean;
}): void {
  const port = createLocalStorageOnboardingFlowPersistence({
    storageKey: ONBOARDING_FLOW_STORAGE_KEY,
  });
  const stored = hydrateOnboardingFlowStateFromStored(port.load());
  port.save(reduceTrajectHandoffState(stored, input));
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
    if (flowState.formalRequestPackageCommitted) ctx.intent = "formal";
    else ctx.intent = "informational";
  }
  return ctx;
}
