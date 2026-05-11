/** Standalone status page (no onboarding shell) after mock registratie-indiening. */
export const ONBOARDING_REGISTRATION_COMPLETE_PATH = "/registratie-voltooid";

export const COUNTRY_SELECT_NONE = "__registration_country_none__";

/**
 * Prototype onboarding: allow advancing registration/company steps without full validation, and
 * merge {@link prototypeOptionalDemoContextPatch} after mock company enrich.
 */
export const ONBOARDING_PROTOTYPE_RELAX_STEP_VALIDATION = true;

export const CERTIFICATION_PHASE_TITLE = "Start je certificatieaanvraag";
export const CERTIFICATION_PHASE_DESCRIPTION =
  "Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een conceptaanvraag hebt samengesteld.";
export const REGISTRATION_PHASE_TITLE = "Registratie — formeel dossier";
/** Used when onboarding state has nog geen wegwijzerlabel of drafts om te laten uitstralen */
export const REGISTRATION_PHASE_DESCRIPTION =
  "Na een korte keuze voor land of regio vullen we de volgende stappen daarop aan: uw contactpersoon, ondernemingsnummer en bedrijfsadres.";
