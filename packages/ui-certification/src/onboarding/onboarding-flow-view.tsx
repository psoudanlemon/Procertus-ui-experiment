import { OnboardingCompanyStep } from "../components/onboarding/company-step/OnboardingCompanyStep";
import { OnboardingCustomerStep } from "../components/onboarding/customer-step/OnboardingCustomerStep";
import { OnboardingExtrasStep } from "../components/onboarding/extras-step/OnboardingExtrasStep";
import { OnboardingInvoicingStep } from "../components/onboarding/invoicing-step/OnboardingInvoicingStep";
import { OnboardingOriginStep } from "../components/onboarding/origin-step/OnboardingOriginStep";
import { OnboardingRequestStep } from "../components/onboarding/request-step/OnboardingRequestStep";
import { OnboardingShell } from "../components/onboarding/shell/OnboardingShell";
import { OnboardingSummaryStep } from "../components/onboarding/summary-step/OnboardingSummaryStep";
import { RegistrationProcessingDialog } from "../components/registration-processing-dialog";
import { STABLE_STEP_MIN_HEIGHT } from "../components/certification-request-wizard/use-certification-request-wizard-view";
import { OnboardingStepper, StepLayout } from "@procertus-ui/ui-lib";

import { mergeRegistrationChromeCopy } from "./onboarding-registration-chrome-copy";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import type { OnboardingStep } from "./onboarding-types";
import { ONBOARDING_STEPS } from "./onboarding-types";
import { useOnboardingRegistrationLayoutModel } from "./use-onboarding-registration-layout-model";

export function OnboardingFlowView(props: OnboardingFlowViewProps) {
  const rb = useOnboardingRegistrationLayoutModel(props);

  const {
    step,
    certificationPhaseTitle,
    certificationPhaseDescription,
    registrationPhaseTitle,
    registrationPhaseDescription,
    onSignInClick,
    certificationWizardProps,
    registrationSubmitOpen,
    onRegistrationSubmitOpenChange,
    registrationProgress,
    registrationStepIndex,
    registrationSimulationLabels,
    steps,
    activeStep,
    goToOnboardingStep,
    primaryAction,
    backAction,
    cancelAction,
    requestOrigin,
    setRequestOrigin,
  } = props;

  if (step === "request") {
    return (
      <OnboardingRequestStep
        pageTitle={certificationPhaseTitle}
        pageDescription={certificationPhaseDescription}
        onSignInClick={onSignInClick}
        certificationWizardProps={certificationWizardProps}
      />
    );
  }

  const chromeStep = step as Exclude<OnboardingStep, "request">;
  const registrationChrome = mergeRegistrationChromeCopy(
    chromeStep,
    props.registrationChromeOverrides?.[chromeStep],
  );

  return (
    <>
      <OnboardingShell
        pageTitle={registrationPhaseTitle}
        pageDescription={registrationPhaseDescription}
        onSignInClick={onSignInClick}
      >
        <StepLayout
          className="w-full"
          minHeight={STABLE_STEP_MIN_HEIGHT}
          variant="onboarding"
          stepper={
            <OnboardingStepper
              steps={steps}
              activeStep={activeStep}
              onStepChange={(index) => {
                const nextStep = ONBOARDING_STEPS[index];
                if (nextStep) {
                  goToOnboardingStep(nextStep);
                }
              }}
              interactive
            />
          }
          title={registrationChrome.title}
          description={registrationChrome.description}
          backAction={backAction}
          primaryAction={primaryAction}
          cancelAction={cancelAction}
        >
          {step === "origin" ? (
            <OnboardingOriginStep
              originFieldBase={rb.originFieldBase}
              requestOrigin={requestOrigin}
              setRequestOrigin={setRequestOrigin}
            />
          ) : null}
          {step === "customer" ? <OnboardingCustomerStep model={rb} /> : null}
          {step === "company" ? <OnboardingCompanyStep model={rb} /> : null}
          {step === "invoicing" ? <OnboardingInvoicingStep model={rb} /> : null}
          {step === "extras" ? <OnboardingExtrasStep model={rb} /> : null}
          {step === "summary" ? <OnboardingSummaryStep model={rb} /> : null}
        </StepLayout>
      </OnboardingShell>

      <RegistrationProcessingDialog
        open={registrationSubmitOpen}
        onOpenChange={onRegistrationSubmitOpenChange}
        progress={registrationProgress}
        activeStepIndex={registrationStepIndex}
        steps={registrationSimulationLabels}
      />
    </>
  );
}

export {
  OnboardingCompanyPrefillSkeleton,
  OnboardingContextField,
} from "../components/onboarding/shared/onboarding-shared-fields";
