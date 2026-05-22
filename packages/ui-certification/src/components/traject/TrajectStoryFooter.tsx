import { Button } from "@procertus-ui/ui";

/**
 * Gedeeld template voor de `actionBar`-slot van {@link TrajectLayout}.
 *
 * Twee modes vandaag:
 * - `decision`: keuze-scherm zoals Triage. Het body draagt de forward-actie
 *   (de keuze-kaarten); de footer heeft alleen escape-acties (Annuleren + Terug).
 * - `in-flow`: typische wizard-stap met expliciete primaire CTA rechts.
 *
 * De mode-set is opzettelijk een discriminated union zodat hij groeit met de
 * traject-architectuur. Wanneer de winkelmandje-redesign landt en de traject-
 * configuratie eindigt met "toevoegen aan mandje" ipv doorstromen naar de
 * triage, komt daar een mode bij (bv. `commit-to-cart`) zonder bestaande
 * consumers te breken.
 *
 * Labels gebruiken canonieke defaults uit `messages`. Per call-site mag een
 * specifiek label de actie scherper beschrijven voor de gebruiker (bv.
 * "Aanvraag verzenden" ipv "Bevestig" op de info-request submit).
 *
 * Layout:
 * - Mobile: 2-koloms grid. In `in-flow` zit primary "Verder" bovenaan op
 *   volledige breedte; "Annuleren" en "Terug" naast elkaar daaronder. In
 *   `decision` vormt "Annuleren" + "Terug" samen één rij.
 * - Desktop (md+): flex row. "Annuleren" links, "Terug" (+ in `in-flow` ook
 *   "Verder") samen rechts.
 */
const messages = {
  cancel: "Naar startpagina",
  back: "Terug",
  continue: "Bevestig",
} as const;

export type TrajectStoryFooterProps =
  | {
      mode: "decision";
      onCancel: () => void;
      onBack: () => void;
      cancelLabel?: string;
      backLabel?: string;
    }
  | {
      mode: "in-flow";
      onCancel: () => void;
      onBack: () => void;
      onContinue: () => void;
      continueDisabled?: boolean;
      cancelLabel?: string;
      backLabel?: string;
      continueLabel?: string;
    };

export function TrajectStoryFooter(props: TrajectStoryFooterProps) {
  const cancelLabel = props.cancelLabel ?? messages.cancel;
  const backLabel = props.backLabel ?? messages.back;

  return (
    <div className="grid w-full grid-cols-2 items-center gap-component md:flex md:flex-wrap">
      {props.mode === "in-flow" ? (
        <Button
          type="button"
          size="lg"
          className="col-span-2 h-12 w-full px-6 md:order-3 md:col-auto md:h-9 md:w-auto md:px-4"
          disabled={props.continueDisabled}
          onClick={props.onContinue}
        >
          {props.continueLabel ?? messages.continue}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="h-12 w-full px-6 md:order-1 md:col-auto md:h-9 md:w-auto md:px-4"
        onClick={props.onCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full px-6 md:order-2 md:ml-auto md:h-9 md:w-auto md:px-4"
        onClick={props.onBack}
      >
        {backLabel}
      </Button>
    </div>
  );
}
