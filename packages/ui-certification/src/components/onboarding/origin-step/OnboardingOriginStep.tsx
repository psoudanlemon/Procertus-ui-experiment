import { ChoiceCard, ChoiceCardGroup, type ChoiceVariant } from "@procertus-ui/ui";

import {
  ONBOARDING_REQUEST_ORIGIN_IDS,
  ONBOARDING_REQUEST_ORIGIN_OPTIONS,
  type OnboardingRequestOrigin,
} from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";

export type OnboardingOriginStepProps = {
  originFieldBase: string;
  requestOrigin: OnboardingRequestOrigin | "";
  setRequestOrigin: (origin: OnboardingRequestOrigin) => void;
};

/**
 * Visuele hiërarchie: de drie waarschijnlijke opties (BE/NL/EU) krijgen de
 * `elevated`-glow; Wereldwijd is `faded` als minst waarschijnlijke geval.
 */
const VARIANT_BY_ORIGIN: Record<OnboardingRequestOrigin, ChoiceVariant> = {
  be: "elevated",
  nl: "elevated",
  eu: "elevated",
  other: "faded",
};

export function OnboardingOriginStep({
  originFieldBase,
  requestOrigin,
  setRequestOrigin,
}: OnboardingOriginStepProps) {
  return (
    <ChoiceCardGroup
      layout="stack"
      className="gap-section"
      name="onboarding-request-origin"
      value={requestOrigin}
      onValueChange={(v: string) => {
        if (ONBOARDING_REQUEST_ORIGIN_IDS.includes(v as OnboardingRequestOrigin)) {
          setRequestOrigin(v as OnboardingRequestOrigin);
        }
      }}
    >
      {ONBOARDING_REQUEST_ORIGIN_OPTIONS.map((opt) => (
        <ChoiceCard
          key={opt.id}
          value={opt.id}
          controlId={`${originFieldBase}-${opt.id}`}
          title={opt.title}
          description={opt.description}
          leading={opt.id === "other" ? undefined : <RequestOriginFlag origin={opt.id} compact />}
          variant={VARIANT_BY_ORIGIN[opt.id]}
          controlPosition="trailing"
        />
      ))}
    </ChoiceCardGroup>
  );
}
