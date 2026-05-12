import { OnboardingCompanyLegalEntitiesStep } from "../components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep";
import { OnboardingCompanyZetelStep } from "../components/onboarding/company-step/OnboardingCompanyZetelStep";
import { OnboardingCustomerStep } from "../components/onboarding/customer-step/OnboardingCustomerStep";
import { OnboardingExtrasStep } from "../components/onboarding/extras-step/OnboardingExtrasStep";
import { OnboardingInvoicingStep } from "../components/onboarding/invoicing-step/OnboardingInvoicingStep";
import { OnboardingOriginStep } from "../components/onboarding/origin-step/OnboardingOriginStep";
import { OnboardingShell } from "../components/onboarding/shell/OnboardingShell";
import { OnboardingSummaryStep } from "../components/onboarding/summary-step/OnboardingSummaryStep";
import { RegistrationProcessingDialog } from "../components/registration-processing-dialog";
import { STABLE_STEP_MIN_HEIGHT } from "./onboarding-constants";
import { StepLayout, StepLayoutStepper } from "@procertus-ui/ui";

import { mergeRegistrationChromeCopy } from "./onboarding-registration-chrome-copy";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import { ONBOARDING_STEPS } from "./onboarding-types";
import { useOnboardingRegistrationLayoutModel } from "./use-onboarding-registration-layout-model";

export function OnboardingFlowView(props: OnboardingFlowViewProps) {
  const rb = useOnboardingRegistrationLayoutModel(props);

  const {
    step,
    registrationPhaseTitle,
    registrationPhaseDescription,
    onSignInClick,
    signInUrl,
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
    registryHeaderLeadingActions,
    registryHeaderTrailingActions,
    languages,
    activeLanguage,
    onLanguageChange,
    guestLanguagePlacement,
    embeddedRegistryShell,
  } = props;

  const registrationChrome = mergeRegistrationChromeCopy(
    step,
    props.registrationChromeOverrides?.[step],
  );

  return (
    <>
      <OnboardingShell
        embedded={embeddedRegistryShell}
        pageTitle={registrationPhaseTitle}
        pageDescription={registrationPhaseDescription}
        onSignInClick={onSignInClick}
        headerLeadingActions={registryHeaderLeadingActions}
        headerTrailingActions={registryHeaderTrailingActions}
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={onLanguageChange}
        loginUrl={signInUrl}
        guestLanguagePlacement={guestLanguagePlacement}
      >
        <StepLayout
          chromeStyle="banded"
          className="w-full"
          minHeight={STABLE_STEP_MIN_HEIGHT}
          variant="onboarding"
          stepper={
            <StepLayoutStepper
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
          {step === "company" ? <OnboardingCompanyZetelStep model={rb} /> : null}
          {step === "companyLegalEntities" ? (
            <OnboardingCompanyLegalEntitiesStep model={rb} />
          ) : null}
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
