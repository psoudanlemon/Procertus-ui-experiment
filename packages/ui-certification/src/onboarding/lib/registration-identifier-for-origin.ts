import type { OnboardingRequestOrigin } from "../onboarding-request-origin";

import { isVatIdentifierPlausible } from "./vatPrototypePresets";

export type RegistrationIdentifierFieldMeta = {
  label: string;
  description: string;
  placeholder: string;
};

export function registrationIdentifierFieldMeta(
  origin: OnboardingRequestOrigin,
): RegistrationIdentifierFieldMeta {
  switch (origin) {
    case "be":
      return {
        label: "KBO- of btw-nummer",
        description:
          "Belgisch ondernemingsnummer: tien cijfers (vaak genoteerd als 0123.456.789). Btw-nummer: BE gevolgd door tien cijfers. Spaties en punten zijn toegelaten.",
        placeholder: "BE0403.107.223",
      };
    case "nl":
      return {
        label: "KVK- of btw-nummer",
        description:
          "KVK: precies acht cijfers. Nederlands btw-nummer: NL, negen cijfers, de letter B en twee cijfers (bijv. NL123456789B01).",
        placeholder: "12345678 of NL001234567B01",
      };
    case "eu":
      return {
        label: "Btw- of ondernemingsnummer",
        description:
          "Officieel nummer van uw lidstaat, meestal het nationaal btw-nummer inclusief landcode (bijv. DE…, FR…, IT…).",
        placeholder: "DE123456789",
      };
    case "other":
      return {
        label: "Btw- of ondernemingsnummer",
        description:
          "Het registratie- of btw-identificatienummer zoals het in uw land wordt uitgegeven.",
        placeholder: "",
      };
  }
}

function normalizeLoose(raw: string): string {
  return raw.replace(/[\s.\-_/]/g, "").toUpperCase();
}

function isValidBelgiumIdentifier(raw: string): boolean {
  const u = raw.trim().toUpperCase();
  const noSpace = u.replace(/\s/g, "");
  const stripped = noSpace.startsWith("BE") ? noSpace.slice(2) : noSpace;
  const digits = stripped.replace(/\./g, "").replace(/\D/g, "");
  return digits.length === 10 && /^\d{10}$/.test(digits);
}

function isValidNetherlandsIdentifier(raw: string): boolean {
  const compact = raw.trim().toUpperCase().replace(/\s/g, "");
  if (/^NL\d{9}B\d{2}$/.test(compact)) return true;
  const digitsOnly = compact.replace(/\D/g, "");
  return digitsOnly.length === 8 && /^\d{8}$/.test(digitsOnly);
}

function isValidEuMemberVat(raw: string): boolean {
  const compact = normalizeLoose(raw);
  if (compact.length < 8) return false;
  if (!/^[A-Z]{2}/.test(compact)) return false;
  const tail = compact.slice(2).replace(/[^A-Z0-9]/g, "");
  return tail.length >= 6 && /^[A-Z0-9]+$/.test(tail);
}

/**
 * Structural check for the organisation identifier before company lookup, aligned with
 * {@link registrationIdentifierFieldMeta} per {@link OnboardingRequestOrigin}.
 */
export function isRegistrationIdentifierValidForOrigin(
  raw: string,
  origin: OnboardingRequestOrigin,
): boolean {
  switch (origin) {
    case "be":
      return isValidBelgiumIdentifier(raw);
    case "nl":
      return isValidNetherlandsIdentifier(raw);
    case "eu":
      return isValidEuMemberVat(raw);
    case "other":
      return isVatIdentifierPlausible(raw) && normalizeLoose(raw).length >= 6;
  }
}

/**
 * Structural validation message for live UI feedback. Empty input returns `null` (no error).
 * Does not call external APIs.
 */
export function registrationIdentifierStructuralIssue(
  raw: string,
  origin: OnboardingRequestOrigin,
): string | null {
  if (!raw.trim()) return null;
  if (isRegistrationIdentifierValidForOrigin(raw, origin)) return null;
  switch (origin) {
    case "be":
      return "Gebruik tien cijfers voor het KBO, of BE gevolgd door tien cijfers voor het btw-nummer.";
    case "nl":
      return "Gebruik acht cijfers voor het KVK-nummer, of een NL-btw-nummer (NL, negen cijfers, B en twee cijfers).";
    case "eu":
      return "Begin met een tweeletterige landcode en een geldig nationaal nummer (vaak uw btw-nummer).";
    case "other":
      return "Het nummer is te kort of heeft een ongeldig formaat; controleer uw registratie- of btw-nummer.";
  }
}
