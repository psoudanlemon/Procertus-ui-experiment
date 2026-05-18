import type { PersonPreferredLanguage } from "@procertus-ui/domain-certification";

/** Fixed onboarding choices; Dutch is the default ({@link coercePersonPreferredLanguage}). */
export const ONBOARDING_PERSON_LANGUAGE_OPTIONS: readonly {
  readonly code: PersonPreferredLanguage;
  readonly label: string;
}[] = [
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
];

export function onboardingPersonLanguageLabel(code: PersonPreferredLanguage): string {
  const hit = ONBOARDING_PERSON_LANGUAGE_OPTIONS.find((o) => o.code === code);
  return hit?.label ?? "Dutch";
}
