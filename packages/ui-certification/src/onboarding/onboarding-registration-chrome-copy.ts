import type { OnboardingStep } from "./onboarding-types";

export type RegistrationStepChromeCopy = {
  title: string;
  description: string;
};

const DEFAULTS: Record<Exclude<OnboardingStep, "request">, RegistrationStepChromeCopy> = {
  origin: {
    title: "Land of regio",
    description:
      "Kies waar uw organisatie gevestigd is. De volgende schermen sluiten daarop aan.",
  },
  customer: {
    title: "Registratie",
    description:
      "Vul eerst het identificatienummer van uw organisatie in (afhankelijk van het gekozen land). Daarna vult u de wettelijke vertegenwoordiger en een geldig e-mailadres in.",
  },
  company: {
    title: "Maatschappelijke zetel",
    description:
      "Na het opzoeken vult u de officiële gegevens van uw hoofdrechtspersoon in zoals gekoppeld aan uw organisatienummer: juridische naam, telefoon en adres.",
  },
  companyLegalEntities: {
    title: "Certificatie en juridische entiteit",
    description:
      "Geeft aan of uw maatschappelijke zetel juridisch optreedt voor de geselecteerde certificaties in dit dossier — zo niet, vult u per aanvraag een vestiging in (naam en adres, zonder apart btw-nummer).",
  },
  invoicing: {
    title: "Facturatie",
    description:
      "Facturatie-e-mail is verplicht. Standaard gelden de maatschappelijke zetel en de wettelijke vertegenwoordiger als factuurcontact; gebruik de blokken voor een vestiging op de factuur, een afwijkend postadres of een andere contactpersoon waar nodig.",
  },
  extras: {
    title: "Extra contacten",
    description:
      "Optioneel: een contact voor certificatie en inspectie, en eventueel een tweede (reserve)contact. U kunt deze stap overslaan.",
  },
  summary: {
    title: "Nazicht",
    description: "Controleer uw gegevens en aanvragen. Daarna kunt u uw registratie indienen.",
  },
};

export function mergeRegistrationChromeCopy(
  registrationStep:
    | "origin"
    | "customer"
    | "company"
    | "companyLegalEntities"
    | "invoicing"
    | "extras"
    | "summary",
  override?: Partial<RegistrationStepChromeCopy> | undefined,
): RegistrationStepChromeCopy {
  return {
    ...DEFAULTS[registrationStep],
    ...override,
  };
}
