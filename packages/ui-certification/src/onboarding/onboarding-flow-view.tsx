import { useState } from "react";

import { OnboardingCompanyLegalEntitiesStep } from "../components/onboarding/company-step/OnboardingCompanyLegalEntitiesStep";
import { OnboardingCompanyZetelStep } from "../components/onboarding/company-step/OnboardingCompanyZetelStep";
import { OnboardingCustomerStep } from "../components/onboarding/customer-step/OnboardingCustomerStep";
import { OnboardingExtrasStep } from "../components/onboarding/extras-step/OnboardingExtrasStep";
import {
  OnboardingFloatingStepsMobileCardLead,
  OnboardingFloatingStepsNav,
} from "../components/onboarding/flow/OnboardingFloatingStepsNav";
import { OnboardingInnovationAttestStep } from "../components/onboarding/innovation-attest-step/OnboardingInnovationAttestStep";
import { OnboardingMetrologyStep } from "../components/onboarding/metrology-step/OnboardingMetrologyStep";
import { OnboardingInvoicingStep } from "../components/onboarding/invoicing-step/OnboardingInvoicingStep";
import { OnboardingOriginStep } from "../components/onboarding/origin-step/OnboardingOriginStep";
import { OnboardingShell } from "../components/onboarding/shell/OnboardingShell";
import { OnboardingSummaryStep } from "../components/onboarding/summary-step/OnboardingSummaryStep";
import { RegistrationProcessingDialog } from "../components/registration-processing-dialog";
import { STABLE_STEP_MIN_HEIGHT } from "./onboarding-constants";

import { cn, H1, P, StepLayout } from "@procertus-ui/ui";

import { mergeRegistrationChromeCopy } from "./onboarding-registration-chrome-copy";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import { registrationStepsSequence } from "./onboarding-registration-steps";
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
    drafts,
  } = props;

  const registrationChrome = mergeRegistrationChromeCopy(
    step,
    props.registrationChromeOverrides?.[step],
  );

  const [stepsSheetOpen, setStepsSheetOpen] = useState(false);

  const onStepChange = (index: number) => {
    const seq = registrationStepsSequence(drafts);
    const nextStep = seq[index];
    if (nextStep) {
      goToOnboardingStep(nextStep);
    }
  };

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
        <div className="flex w-full flex-col gap-region md:flex-row md:items-start md:gap-region">
          <div className="min-w-0 flex-1">
            <StepLayout
              hideHeader
              chromeStyle="card"
              className={cn("ms-auto me-0 w-full")}
              minHeight={STABLE_STEP_MIN_HEIGHT}
              stepKey={activeStep}
              variant="onboarding"
              title={registrationChrome.title}
              description={registrationChrome.description}
              backAction={backAction}
              primaryAction={primaryAction}
              cancelAction={cancelAction}
              mobileCardLead={
                steps.length > 0 ? (
                  <OnboardingFloatingStepsMobileCardLead
                    steps={steps}
                    activeStep={activeStep}
                    onOpenStepsSheet={() => setStepsSheetOpen(true)}
                    stepsSheetOpen={stepsSheetOpen}
                  />
                ) : undefined
              }
            >
              <div className="flex flex-col gap-micro">
                <H1>{registrationChrome.title}</H1>
                {registrationChrome.description ? (
                  <P className="text-base leading-[1.6] text-muted-foreground">
                    {registrationChrome.description}
                  </P>
                ) : null}
              </div>
              {step === "origin" ? (
                <OnboardingOriginStep
                  originFieldBase={rb.originFieldBase}
                  requestOrigin={requestOrigin}
                  setRequestOrigin={setRequestOrigin}
                />
              ) : null}
              {step === "customer" ? <OnboardingCustomerStep model={rb} /> : null}
              {step === "company" ? <OnboardingCompanyZetelStep model={rb} /> : null}
              {step === "innovationAttest" ? <OnboardingInnovationAttestStep /> : null}
              {step === "metrologyAttest" ? <OnboardingMetrologyStep /> : null}
              {step === "companyLegalEntities" ? (
                <OnboardingCompanyLegalEntitiesStep model={rb} />
              ) : null}
              {step === "invoicing" ? <OnboardingInvoicingStep model={rb} /> : null}
              {step === "extras" ? <OnboardingExtrasStep model={rb} /> : null}
              {step === "summary" ? <OnboardingSummaryStep model={rb} /> : null}
            </StepLayout>
          </div>

          <OnboardingFloatingStepsNav
            steps={steps}
            activeStep={activeStep}
            interactive
            onStepChange={onStepChange}
            sheetOpen={stepsSheetOpen}
            onSheetOpenChange={setStepsSheetOpen}
          />
        </div>
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
