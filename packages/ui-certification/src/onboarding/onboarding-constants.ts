/** Standalone status page (no onboarding shell) after mock registratie-indiening. */
export const ONBOARDING_REGISTRATION_COMPLETE_PATH = "/registratie-voltooid";

/**
 * Stable card height for onboarding step pages so they don't shrink to content height between
 * steps. Resolves to `calc(100svh - 12rem)` via the `--min-height-stable-step` token.
 */
export const STABLE_STEP_MIN_HEIGHT = "min-h-stable-step";

export const COUNTRY_SELECT_NONE = "__registration_country_none__";

/**
 * Prototype onboarding: allow advancing the **maatschappelijke zetel** step without full validation;
 * registratie always requires complete legal representative (and VAT id). Also used when merging
 * {@link prototypeOptionalDemoContextPatch} after mock company enrich.
 */
export const ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION = true;

export const CERTIFICATION_PHASE_TITLE = "Start je certificatieaanvraag";
export const CERTIFICATION_PHASE_DESCRIPTION =
  "Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een conceptaanvraag hebt samengesteld.";
export const REGISTRATION_PHASE_TITLE = "Start traject voor certificatie";
/** Vaste shell‑tekst voor de formele registratiefase (geen dynamische echo van label of concepten). */
export const REGISTRATION_PHASE_DESCRIPTION =
  "Nadat we alle nodige informatie verzameld hebben, kunt u uw traject insturen en zal u kunnen aanmelden op het PROCERTUS klantenportaal.";
