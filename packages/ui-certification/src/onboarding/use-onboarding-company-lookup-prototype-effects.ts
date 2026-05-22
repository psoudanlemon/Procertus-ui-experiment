import { useEffect } from "react";

import {
  enrichRegistrationContext,
  findVatPrototypePreset,
  registrationIsoCodeFromDutchCountryLabel,
  VAT_PROTOTYPE_PRESETS,
} from "./lib/vatPrototypePresets";
import {
  customerContextAfterPrototypePresetChange,
  mergeCustomerContextDeep,
  prototypeOptionalDemoContextPatch,
  resolveFlowContext,
} from "./onboarding-flow-helpers";
import type { CustomerContext, OnboardingStep } from "./onboarding-types";
import { firmaCountryLabelLockedForOrigin } from "./onboarding-request-origin";
import { useOnboardingFlowContext } from "./onboarding-flow-provider";

/**
 * Prototype VAT lookup simulation and origin-locked firma country while the user is on the
 * company (zetel) registration step. Call from the route-bound screen that owns the step URL —
 * not from the session layout or bare {@link OnboardingFlowProvider}.
 *
 * @param surfaceStep Pass `null` when the URL is about to redirect (avoid spurious mock runs).
 */
export function useOnboardingCompanyLookupPrototypeEffects(surfaceStep: OnboardingStep | null) {
  const {
    flowState,
    setFlowState,
    companyLookupPhase,
    setCompanyLookupPhase,
    setLookupProgress,
    setLookupStepIndex,
  } = useOnboardingFlowContext();

  const { requestOrigin, prototypeVatPresetId } = flowState;

  /** Entering company step always restarts mock lookup UI. */
  useEffect(() => {
    if (surfaceStep !== "company") return;
    setCompanyLookupPhase("loading");
    setLookupProgress(0);
    setLookupStepIndex(-1);
  }, [surfaceStep, setCompanyLookupPhase, setLookupProgress, setLookupStepIndex]);

  /** Mock company enrichment while on company step. */
  useEffect(() => {
    if (surfaceStep !== "company") return;
    const preset = findVatPrototypePreset(prototypeVatPresetId) ?? VAT_PROTOTYPE_PRESETS[0];
    if (!preset) return;

    const timeoutIds: number[] = [];
    const scheduleLookup = (delayMs: number, fn: () => void) => {
      timeoutIds.push(window.setTimeout(fn, delayMs));
    };

    scheduleLookup(200, () => {
      setLookupProgress(25);
      setLookupStepIndex(0);
    });
    scheduleLookup(900, () => {
      setLookupProgress(55);
      setLookupStepIndex(1);
    });
    scheduleLookup(1700, () => {
      setLookupProgress(85);
      setLookupStepIndex(2);
    });
    scheduleLookup(2500, () => {
      setFlowState((prev) => {
        const baseContext = resolveFlowContext(
          prev.context as Partial<CustomerContext> & {
            representativeName?: string;
            kycNotes?: string;
            address?: string;
          },
        );
        const enriched = enrichRegistrationContext({
          vatNumber: baseContext.vatNumber,
          representativeEmail: baseContext.representativeEmail,
          preset,
          firmaCountryLocked: firmaCountryLabelLockedForOrigin(requestOrigin) != null,
        });
        const { hints, ...enrichedFields } = enriched;
        const mergedCore = resolveFlowContext({
          ...baseContext,
          ...enrichedFields,
        });
        const withPrototypeOptionals = resolveFlowContext(
          mergeCustomerContextDeep(
            mergedCore,
            prototypeOptionalDemoContextPatch(mergedCore, preset),
          ),
        );
        return {
          ...prev,
          companyFieldHints: hints,
          context: withPrototypeOptionals,
        };
      });
      setLookupProgress(100);
      setCompanyLookupPhase("ready");
    });

    return () => timeoutIds.forEach((id) => window.clearTimeout(id));
  }, [
    surfaceStep,
    prototypeVatPresetId,
    requestOrigin,
    setFlowState,
    setLookupProgress,
    setLookupStepIndex,
    setCompanyLookupPhase,
  ]);

  useEffect(() => {
    if (surfaceStep !== "company" || companyLookupPhase !== "ready") return;
    const locked = firmaCountryLabelLockedForOrigin(requestOrigin);
    if (!locked) return;
    const iso = registrationIsoCodeFromDutchCountryLabel(locked);
    setFlowState((prev) => {
      if (prev.context.country === locked && prev.context.addressCountryCode === iso) {
        return prev;
      }
      return {
        ...prev,
        context: resolveFlowContext({
          ...prev.context,
          country: locked,
          addressCountryCode: iso,
        }),
      };
    });
  }, [surfaceStep, companyLookupPhase, requestOrigin, setFlowState]);
}
