import { stepIndex } from "../onboarding-flow-helpers";
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
  const fromIdx = stepIndex(activeStep);
  const toIdx = stepIndex(nextStep);
  const backward = toIdx < fromIdx;

  const companyIdx = stepIndex("company");
  const legalIdx = stepIndex("companyLegalEntities");
  const invoicingIdx = stepIndex("invoicing");
  const extrasIdx = stepIndex("extras");

  let companyZetelStepCompleted = prev.companyZetelStepCompleted;
  let companyLegalEntitiesStepCompleted = prev.companyLegalEntitiesStepCompleted;
  let invoicingStepCompleted = prev.invoicingStepCompleted;
  let extrasStepCompleted = prev.extrasStepCompleted;
  let companyFieldHints = prev.companyFieldHints;

  if (toIdx <= companyIdx) {
    companyZetelStepCompleted = false;
    companyLegalEntitiesStepCompleted = false;
    invoicingStepCompleted = false;
    extrasStepCompleted = false;
    if (nextStep === "company") {
      companyFieldHints = {};
    }
  } else if (backward && toIdx <= legalIdx) {
    companyLegalEntitiesStepCompleted = false;
    invoicingStepCompleted = false;
    extrasStepCompleted = false;
  } else if (backward && toIdx <= invoicingIdx) {
    invoicingStepCompleted = false;
    extrasStepCompleted = false;
  } else if (backward && toIdx <= extrasIdx) {
    extrasStepCompleted = false;
  }

  if (activeStep === "company" && nextStep === "companyLegalEntities") {
    companyZetelStepCompleted = true;
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
    companyLegalEntitiesStepCompleted,
    invoicingStepCompleted,
    extrasStepCompleted,
    companyFieldHints,
  };
}
