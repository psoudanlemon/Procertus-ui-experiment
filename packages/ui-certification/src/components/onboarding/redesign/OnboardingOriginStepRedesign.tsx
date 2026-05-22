/**
 * Redesign-variant van de "Land of regio" step (3.5):
 *
 * - Alle vier opties (BE, NL, EU, buiten Europa) krijgen *dezelfde* visuele tier
 *   in een 2-koloms grid; geen splitsing meer tussen hero- en secondary-cards.
 * - Vlag staat als `leading`-icon vooraan de tekst, niet als subtiele chip
 *   rechtsboven, zodat de identiteit van elke optie direct leesbaar is.
 * - Radio-control staat trailing (rechts) zodat tekst + vlag samen één
 *   visuele eenheid vormen aan de linkerkant.
 *
 * Niet gebruikt in productie, leeft alleen in redesign-stories.
 */
import { ChoiceCard, ChoiceCardGroup, type ChoiceVariant } from "@procertus-ui/ui";

import {
  ONBOARDING_REQUEST_ORIGIN_IDS,
  ONBOARDING_REQUEST_ORIGIN_OPTIONS,
  type OnboardingRequestOrigin,
} from "../../../onboarding/onboarding-request-origin";
import { RequestOriginFlag } from "../../../onboarding/onboarding-request-origin-flag";

export type OnboardingOriginStepRedesignProps = {
  originFieldBase: string;
  requestOrigin: OnboardingRequestOrigin | "";
  setRequestOrigin: (origin: OnboardingRequestOrigin) => void;
};

/**
 * Visuele hiërarchie: de drie waarschijnlijke opties (BE/NL/EU) krijgen de
 * `elevated`-glow, Wereldwijd is `faded` als minst waarschijnlijke optie.
 */
const VARIANT_BY_ORIGIN: Record<OnboardingRequestOrigin, ChoiceVariant> = {
  be: "elevated",
  nl: "elevated",
  eu: "elevated",
  other: "faded",
};

/**
 * Kortere titels in het redesign. De productie-constante {@link ONBOARDING_REQUEST_ORIGIN_OPTIONS}
 * blijft onaangetast tot het ontwerp wordt goedgekeurd.
 */
const TITLE_BY_ORIGIN: Record<OnboardingRequestOrigin, string> = {
  be: "België",
  nl: "Nederland",
  eu: "Europa",
  other: "Wereldwijd",
};

const DESCRIPTION_BY_ORIGIN: Record<OnboardingRequestOrigin, string> = {
  be: "Het bedrijf waarvoor u de certificaten wil aanvragen is gevestigd in België.",
  nl: "Het bedrijf waarvoor u de certificaten wil aanvragen is gevestigd in Nederland.",
  eu: "Het bedrijf waarvoor u de certificaten wil aanvragen is gevestigd in een ander Europees land.",
  other: "Het bedrijf waarvoor u de certificaten wil aanvragen is gevestigd buiten Europa.",
};

export function OnboardingOriginStepRedesign({
  originFieldBase,
  requestOrigin,
  setRequestOrigin,
}: OnboardingOriginStepRedesignProps) {
  return (
    <ChoiceCardGroup
      layout="stack"
      className="gap-section"
      name="onboarding-request-origin-redesign"
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
          title={TITLE_BY_ORIGIN[opt.id]}
          description={DESCRIPTION_BY_ORIGIN[opt.id]}
          leading={opt.id === "other" ? undefined : <RequestOriginFlag origin={opt.id} compact />}
          variant={VARIANT_BY_ORIGIN[opt.id]}
          controlPosition="trailing"
        />
      ))}
    </ChoiceCardGroup>
  );
}
