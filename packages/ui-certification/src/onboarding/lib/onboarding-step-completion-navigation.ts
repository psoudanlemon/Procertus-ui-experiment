import { registrationStepsSequenceForFlowState } from "../onboarding-registration-steps";
import type { OnboardingFlowState } from "../onboarding-types";
import type { OnboardingStep } from "../onboarding-types";

/** Snapshot fields updated when navigating between registration steps (Verder / stepper / Terug). */
export type StepCompletionNavigationFields = Pick<
  OnboardingFlowState,
  | "companyZetelStepCompleted"
  | "companyLegalEntitiesStepCompleted"
  | "invoicingStepCompleted"
  | "extrasStepCompleted"
  | "companyFieldHints"
  | "innovationAttestInquiry"
  | "metrologyInquiry"
>;

/**
 * Derives persisted “stap bevestigd” flags after navigating from `activeStep` to `nextStep`.
 * Context‑only validators can worden `true` vóór **Verder**; deze vlaggen houden resume in lijn met de UI‑flow.
 */
export function stepCompletionStateAfterNavigation(
  prev: OnboardingFlowState,
  activeStep: OnboardingStep,
  nextStep: OnboardingStep,
): StepCompletionNavigationFields {
  const seq = registrationStepsSequenceForFlowState(prev);
  const fromIdx = seq.indexOf(activeStep);
  const toIdx = seq.indexOf(nextStep);
  const backward = toIdx < fromIdx;

  const companyIdx = seq.indexOf("company");
  const innovationIdx = seq.indexOf("innovationAttest");
  const metrologyIdx = seq.indexOf("metrologyAttest");
  const legalIdx = seq.indexOf("companyLegalEntities");
  const invoicingIdx = seq.indexOf("invoicing");
  const extrasIdx = seq.indexOf("extras");
  const skippedLegalEntitiesStep = legalIdx < 0;

  let companyZetelStepCompleted = prev.companyZetelStepCompleted;
  let innovationAttestStepCompleted = prev.innovationAttestInquiry.stepCompleted;
  let metrologyStepCompleted = prev.metrologyInquiry.stepCompleted;
  let companyLegalEntitiesStepCompleted = prev.companyLegalEntitiesStepCompleted;
  let invoicingStepCompleted = prev.invoicingStepCompleted;
  let extrasStepCompleted = prev.extrasStepCompleted;
  let companyFieldHints = prev.companyFieldHints;

  if (toIdx <= companyIdx) {
    companyZetelStepCompleted = false;
    innovationAttestStepCompleted = false;
    metrologyStepCompleted = false;
    companyLegalEntitiesStepCompleted = false;
    invoicingStepCompleted = false;
    extrasStepCompleted = false;
    if (nextStep === "company") {
      companyFieldHints = {};
    }
  } else if (backward) {
    if (metrologyIdx >= 0 && toIdx <= metrologyIdx) {
      metrologyStepCompleted = false;
      if (!skippedLegalEntitiesStep) {
        companyLegalEntitiesStepCompleted = false;
      }
      invoicingStepCompleted = false;
      extrasStepCompleted = false;
    }
    if (innovationIdx >= 0 && toIdx <= innovationIdx) {
      innovationAttestStepCompleted = false;
      if (metrologyIdx >= 0 && metrologyIdx > innovationIdx) {
        metrologyStepCompleted = false;
      }
      if (!skippedLegalEntitiesStep) {
        companyLegalEntitiesStepCompleted = false;
      }
      invoicingStepCompleted = false;
      extrasStepCompleted = false;
    } else if (legalIdx >= 0 && toIdx <= legalIdx) {
      companyLegalEntitiesStepCompleted = false;
      invoicingStepCompleted = false;
      extrasStepCompleted = false;
    } else if (toIdx <= invoicingIdx) {
      invoicingStepCompleted = false;
      extrasStepCompleted = false;
    } else if (toIdx <= extrasIdx) {
      extrasStepCompleted = false;
    }
  }

  if (
    activeStep === "company" &&
    (nextStep === "innovationAttest" ||
      nextStep === "metrologyAttest" ||
      nextStep === "companyLegalEntities" ||
      nextStep === "invoicing")
  ) {
    companyZetelStepCompleted = true;
    if (nextStep === "invoicing" && skippedLegalEntitiesStep) {
      companyLegalEntitiesStepCompleted = true;
    }
  }
  if (activeStep === "innovationAttest" && nextStep === "metrologyAttest") {
    innovationAttestStepCompleted = true;
  }
  if (activeStep === "innovationAttest" && nextStep === "companyLegalEntities") {
    innovationAttestStepCompleted = true;
  }
  if (activeStep === "innovationAttest" && nextStep === "invoicing" && skippedLegalEntitiesStep) {
    innovationAttestStepCompleted = true;
    companyLegalEntitiesStepCompleted = true;
  }
  if (activeStep === "metrologyAttest" && nextStep === "companyLegalEntities") {
    metrologyStepCompleted = true;
  }
  if (activeStep === "metrologyAttest" && nextStep === "invoicing" && skippedLegalEntitiesStep) {
    metrologyStepCompleted = true;
    companyLegalEntitiesStepCompleted = true;
  }
  if (activeStep === "companyLegalEntities" && nextStep === "invoicing") {
    companyLegalEntitiesStepCompleted = true;
  }
  if (activeStep === "invoicing" && nextStep === "extras") {
    invoicingStepCompleted = true;
  }
  if (activeStep === "invoicing" && nextStep === "summary") {
    invoicingStepCompleted = true;
    extrasStepCompleted = true;
  }
  if (activeStep === "extras" && nextStep === "summary") {
    extrasStepCompleted = true;
  }

  return {
    companyZetelStepCompleted,
    innovationAttestInquiry: {
      ...prev.innovationAttestInquiry,
      stepCompleted: innovationAttestStepCompleted,
    },
    metrologyInquiry: {
      ...prev.metrologyInquiry,
      stepCompleted: metrologyStepCompleted,
    },
    companyLegalEntitiesStepCompleted,
    invoicingStepCompleted,
    extrasStepCompleted,
    companyFieldHints,
  };
}
