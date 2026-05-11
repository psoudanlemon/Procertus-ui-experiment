import { Button } from "@procertus-ui/ui";

/**
 * Gedeeld template voor de `actionBar`-slot van {@link TrajectLayout} in storybook-omgevingen.
 * Houdt de visuele baseline gelijk tussen flow-stories.
 *
 * Contract voor consumenten:
 * - Latere stap: bedraad `onCancel` (ghost, links, springt naar de wegwijzer) én `onBack`
 *   (outline, gaat naar de vorige stap binnen de flow).
 * - Eerste stap: laat `onCancel` weg. De ghost-knop verdwijnt dan en `onBack` neemt de
 *   "terug naar het vorige scherm"-rol over (typisch terug naar de wegwijzer).
 *
 * Elke knop wordt verborgen wanneer zijn handler ontbreekt; layout-positionering blijft
 * behouden via de `justify-between`-rij van TrajectLayout en een lege left-edge placeholder.
 */
export type TrajectStoryFooterProps = {
  onCancel?: () => void;
  onBack?: () => void;
  onContinue?: () => void;
  cancelLabel?: string;
  backLabel?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
};

export function TrajectStoryFooter({
  onCancel,
  onBack,
  onContinue,
  cancelLabel = "Annuleren",
  backLabel = "Terug",
  continueLabel = "Bevestig selectie",
  continueDisabled = false,
}: TrajectStoryFooterProps) {
  return (
    <>
      {onCancel ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 px-6 md:h-9 md:px-4"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      ) : (
        <span aria-hidden />
      )}
      <div className="flex items-center gap-component">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 px-6 md:h-9 md:px-4"
            onClick={onBack}
          >
            {backLabel}
          </Button>
        ) : null}
        {onContinue ? (
          <Button
            type="button"
            size="lg"
            className="h-12 px-6 md:h-9 md:px-4"
            disabled={continueDisabled}
            onClick={onContinue}
          >
            {continueLabel}
          </Button>
        ) : null}
      </div>
    </>
  );
}
