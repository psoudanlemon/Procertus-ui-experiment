import { Button } from "@procertus-ui/ui";

/**
 * Gedeeld template voor de `actionBar`-slot van {@link TrajectLayout} in storybook-omgevingen.
 * Houdt de visuele baseline gelijk tussen flow-stories.
 *
 * Contract voor consumenten:
 * - Latere stap: bedraad `onCancel` (ghost, springt naar de wegwijzer) én `onBack`
 *   (outline, gaat naar de vorige stap binnen de flow).
 * - Eerste stap: laat `onCancel` weg. De ghost-knop verdwijnt dan en `onBack` neemt de
 *   "terug naar het vorige scherm"-rol over (typisch terug naar de wegwijzer).
 *
 * Layout:
 * - Mobile: 2-koloms grid. Primary "Verder" bovenaan op volledige breedte, met daaronder
 *   "Annuleren" (links) en "Terug" (rechts) naast elkaar. Op de eerste stap vult "Terug"
 *   de hele tweede rij.
 * - Desktop (md+): flex row. "Annuleren" links, "Terug" + "Verder" samen rechts.
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
  const backSpanWhenSolo = onCancel == null ? "col-span-2 md:col-auto" : "";
  return (
    <div className="grid w-full grid-cols-2 items-center gap-component md:flex">
      {onContinue ? (
        <Button
          type="button"
          size="lg"
          className="col-span-2 h-12 w-full px-6 md:order-3 md:col-auto md:h-9 md:w-auto md:px-4"
          disabled={continueDisabled}
          onClick={onContinue}
        >
          {continueLabel}
        </Button>
      ) : null}
      {onCancel ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 w-full px-6 md:order-1 md:h-9 md:w-auto md:px-4"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      ) : null}
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={`h-12 w-full px-6 md:order-2 md:ml-auto md:h-9 md:w-auto md:px-4 ${backSpanWhenSolo}`}
          onClick={onBack}
        >
          {backLabel}
        </Button>
      ) : null}
    </div>
  );
}
