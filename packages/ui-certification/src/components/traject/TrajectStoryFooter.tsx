import { Button } from "@procertus-ui/ui";

/**
 * Gedeeld template voor de `actionBar`-slot van {@link TrajectLayout} in storybook-omgevingen.
 * Houdt de visuele baseline (button-groottes en spacing) gelijk tussen flow-stories zodat
 * elke nieuwe traject-pagina vanuit dezelfde footer-vorm vertrekt en alleen labels of
 * extra slots hoeft aan te passen.
 */
export type TrajectStoryFooterProps = {
  onBack?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
};

export function TrajectStoryFooter({
  onBack,
  onContinue,
  backLabel = "Terug",
  continueLabel = "Bevestig selectie",
  continueDisabled = false,
}: TrajectStoryFooterProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="h-12 px-6 md:h-9 md:px-4"
        onClick={onBack}
        disabled={onBack == null}
      >
        {backLabel}
      </Button>
      <Button
        type="button"
        size="lg"
        className="h-12 px-6 md:h-9 md:px-4"
        disabled={continueDisabled || onContinue == null}
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    </>
  );
}
