import type { OnboardingStep } from "./onboarding-types";

export type RegistrationStepChromeCopy = {
  title: string;
  description: string;
};

const DEFAULTS: Record<OnboardingStep, RegistrationStepChromeCopy> = {
  origin: {
    title: "Kies uw land of regio",
    description: "Uw keuze bepaalt welke gegevens we in de volgende stappen vragen.",
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
  innovationAttest: {
    title: "Innovatie-attest dossiergegevens",
    description:
      "Vul het innovatief product, de bewijsvoering en het project waarin het wordt toegepast in. Dit vervangt de productselectie uit het traject‑wizard voor deze aanvraag.",
  },
  metrologyAttest: {
    title: "Metrologie dossiergegevens",
    description:
      "Beschrijf uw laboratorium-/meetuitrusting en waar PROCERTUS moet interveniëren. Zo sluit deze intake aan op de metrologie-dienst zoals beschreven op procertus.be.",
  },
  companyLegalEntities: {
    title: "Certificatie en juridische entiteit",
    description:
      "Geeft aan of uw maatschappelijke zetel juridisch optreedt voor de productgebonden certificaties in dit dossier — zo niet, vult u per product een vestiging in (naam en adres, zonder apart btw-nummer). Meerdere certificatielijnen op hetzelfde product delen één vestiging.",
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
  registrationStep: OnboardingStep,
  override?: Partial<RegistrationStepChromeCopy> | undefined,
): RegistrationStepChromeCopy {
  return {
    ...DEFAULTS[registrationStep],
    ...override,
  };
}
