import { ChoiceCard, ChoiceCardGroup } from "@procertus-ui/ui";

import {
  ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS,
  ONBOARDING_REQUEST_ORIGIN_IDS,
  ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS,
  type OnboardingRequestOrigin,
} from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";
import {
  DEFAULT_ONBOARDING_ORIGIN_STEP_COPY,
  type OnboardingOriginStepCopy,
} from "./onboarding-origin-step-copy";

export type OnboardingOriginStepProps = {
  copy?: Partial<OnboardingOriginStepCopy>;
  originFieldBase: string;
  requestOrigin: OnboardingRequestOrigin | "";
  setRequestOrigin: (origin: OnboardingRequestOrigin) => void;
};

export function OnboardingOriginStep({
  copy: copyOverrides,
  originFieldBase,
  requestOrigin,
  setRequestOrigin,
}: OnboardingOriginStepProps) {
  const copy = {
    ...DEFAULT_ONBOARDING_ORIGIN_STEP_COPY,
    ...copyOverrides,
  };

  return (
    <div className="space-y-4">
      <ChoiceCardGroup
        className="p-0"
        legend={copy.choiceGroupLegend}
        hint={copy.choiceGroupHint}
        layout="stack"
        name="onboarding-request-origin"
        value={requestOrigin}
        onValueChange={(v: string) => {
          if (ONBOARDING_REQUEST_ORIGIN_IDS.includes(v as OnboardingRequestOrigin)) {
            setRequestOrigin(v as OnboardingRequestOrigin);
          }
        }}
      >
        <div className="flex w-full min-w-0 flex-col gap-section">
          <div className="flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-3 md:gap-4">
            {ONBOARDING_REQUEST_ORIGIN_HERO_OPTIONS.map((opt) => (
              <div key={opt.id} className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col">
                <ChoiceCard
                  value={opt.id}
                  controlId={`${originFieldBase}-${opt.id}`}
                  title={
                    <span className="flex min-w-0 items-center gap-2">
                      <RequestOriginFlag origin={opt.id} />
                      <span>{opt.title}</span>
                    </span>
                  }
                  description={opt.description}
                  variant="elevated"
                  appearance="hero"
                  className="h-full"
                />
              </div>
            ))}
          </div>
          <div className="flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-3 md:gap-4">
            {ONBOARDING_REQUEST_ORIGIN_SECONDARY_OPTIONS.map((opt) => (
              <div key={opt.id} className="relative flex min-h-0 min-w-0 flex-1 basis-0 flex-col">
                <div className="pointer-events-none absolute top-3 right-3 z-10" aria-hidden>
                  <RequestOriginFlag origin={opt.id} compact />
                </div>
                <ChoiceCard
                  value={opt.id}
                  controlId={`${originFieldBase}-${opt.id}`}
                  title={opt.title}
                  description={opt.description}
                  variant="default"
                  appearance="default"
                  className="h-full pr-12"
                />
              </div>
            ))}
          </div>
        </div>
      </ChoiceCardGroup>
    </div>
  );
}
