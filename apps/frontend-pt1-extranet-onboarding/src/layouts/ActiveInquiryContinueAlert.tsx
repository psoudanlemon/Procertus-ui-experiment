import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription, AlertTitle, Button } from "@procertus-ui/ui";
import {
  deriveFormalOnboardingResumeStep,
  effectiveIncludedCertificationDraftIds,
  useOnboardingFlowState,
} from "@procertus-ui/ui-certification";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { FORMAL_ONBOARDING_PATH, formalOnboardingStepPath } from "../routes/formal-request-routing";

/**
 * Shown on guest “intake” pages when the session already has certification inquiries selected,
 * so users know they can continue the in‑progress request instead of only browsing.
 */
export function ActiveInquiryContinueAlert() {
  const location = useLocation();
  const { flowState, resolvedContext } = useOnboardingFlowState();

  const includedCount = useMemo(
    () =>
      effectiveIncludedCertificationDraftIds(
        flowState.drafts,
        flowState.summaryIncludedDraftIds,
      ).length,
    [flowState.drafts, flowState.summaryIncludedDraftIds],
  );

  const continuePath = useMemo(() => {
    const step = deriveFormalOnboardingResumeStep(flowState, resolvedContext);
    return formalOnboardingStepPath(step);
  }, [flowState, resolvedContext]);

  if (includedCount === 0) {
    return null;
  }

  if (location.pathname.startsWith(FORMAL_ONBOARDING_PATH)) {
    return null;
  }

  return (
    <Alert className="border-primary/25 bg-primary/5">
      <AlertTitle>Actieve aanvraag met onderzoeken</AlertTitle>
      <AlertDescription className="flex flex-col gap-component sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm leading-normal">
          U hebt een lopende aanvraag met{" "}
          {includedCount === 1
            ? "één geselecteerd certificatieonderzoek"
            : `${includedCount} geselecteerde certificatieonderzoeken`}
          . U kunt deze aanvraag op elk moment verderzetten.
        </span>
        <Button variant="default" size="sm" className="shrink-0 gap-micro" asChild>
          <Link to={continuePath}>
            Ga verder met aanvraag
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" aria-hidden />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
