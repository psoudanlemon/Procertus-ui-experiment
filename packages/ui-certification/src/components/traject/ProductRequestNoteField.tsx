import { Textarea, cn } from "@procertus-ui/ui";
import { useEffect, useId, useRef } from "react";

export const PRODUCT_REQUEST_NOTE_MAX_LENGTH = 2500;
/**
 * Verhoogde tekenlimiet voor het non-product-bound flow (bv. ATG, innovation-attest, metrology,
 * partijkeuring) waar de begeleidende brief het volledige dossier vormt.
 */
export const PRODUCT_REQUEST_NOTE_MAX_LENGTH_LONG = 10_000;

export type ProductRequestNoteFieldProps = {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  /**
   * Maximum aantal karakters. Default {@link PRODUCT_REQUEST_NOTE_MAX_LENGTH}
   * (2500). De browser dwingt dit af via `maxLength`; de teller in de footer-
   * rij is informatief.
   */
  maxLength?: number;
  /**
   * Wanneer `true` wordt het veld als verplicht gemarkeerd: `required`-attribuut
   * op de textarea, `aria-required` voor screenreaders, en de footer-rij toont
   * "Verplicht in te vullen" links. De pagina-laag is verantwoordelijk voor het
   * gaten van de submit-knop op basis van {@link isProductRequestNoteComplete}.
   */
  required?: boolean;
  /**
   * Initieel zichtbaar aantal regels in de textarea. Bepaalt de minimale
   * schrijfhoogte (`min-height` via inline `calc` zodat field-sizing-content
   * niet onder deze drempel duikt); via `field-sizing-content` groeit het
   * veld vanzelf verder mee met de inhoud. Default `6`.
   */
  rows?: number;
  /**
   * Wanneer `true` (default) wikkelen we de textarea + footer in een
   * rounded-border container met focus-within ring. Zet op `false` voor een
   * "flush"-variant zonder border, zonder radius en zonder interne padding —
   * handig wanneer de wikkelende sectie-card zelf al de chrome levert.
   */
  bordered?: boolean;
  /**
   * Auto-focus de textarea bij mount. Default `true` zodat de gebruiker meteen
   * kan beginnen typen wanneer hij op de validatiepagina landt; zet op `false`
   * voor demo-omgevingen waar focus de scroll zou kapen.
   */
  autoFocus?: boolean;
  /** Override voor het textarea-id (handig voor `aria-labelledby` van een externe heading). */
  id?: string;
  /** ID(s) van de zichtbare label-heading buiten dit component (bv. een sectie-h2). */
  "aria-labelledby"?: string;
};

/**
 * Minimum aantal niet-witspace karakters voor een verplichte begeleidende
 * brief. Voorkomt dat de gebruiker met een puntje of een woordje door de
 * required-check kan glippen.
 */
export const PRODUCT_REQUEST_NOTE_MIN_LENGTH = 5;

/**
 * Of de waarde voldoet aan het verplicht-criterium: tenminste
 * {@link PRODUCT_REQUEST_NOTE_MIN_LENGTH} niet-witspace karakters wanneer
 * `required` op `true` staat.
 */
export function isProductRequestNoteComplete(value: string, required: boolean): boolean {
  if (!required) return true;
  return value.trim().length >= PRODUCT_REQUEST_NOTE_MIN_LENGTH;
}

/**
 * Toelichtingsveld bovenaan het aanvraag-validatiescherm. Levert een auto-
 * groeiende textarea (via `field-sizing-content`) in een gedeelde
 * rounded-border-container met een footer-rij eronder: links de
 * Verplicht/Optioneel-status, rechts de live karakterteller. De zichtbare
 * label hoort bij de wikkelende sectie-h2; koppel die met `aria-labelledby`.
 */
export function ProductRequestNoteField({
  className,
  placeholder = "Beschrijf hier de context van uw aanvraag: voorgeschiedenis (eerdere keuringen, geplande wijzigingen aan de productie, …), bijzondere omstandigheden of een specifieke vraag voor de auditor die uw dossier moet weten.",
  value,
  onChange,
  maxLength = PRODUCT_REQUEST_NOTE_MAX_LENGTH,
  required = false,
  rows = 6,
  bordered = true,
  autoFocus = true,
  id,
  "aria-labelledby": ariaLabelledBy,
}: ProductRequestNoteFieldProps) {
  const fallbackId = useId();
  const textareaId = id ?? `product-request-note-${fallbackId}`;
  const counterId = `${textareaId}-counter`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const el = textareaRef.current;
    if (!el) return;
    // Op mount: focus de textarea, maar zet hem niet in de viewport-scroll
    // queue als hij al zichtbaar is. `preventScroll` voorkomt dat de pagina
    // springt wanneer de gebruiker landt boven het veld.
    el.focus({ preventScroll: true });
  }, [autoFocus]);
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= Math.max(50, Math.round(maxLength * 0.05));
  const trimmedLength = value.trim().length;
  const belowMinimum = required && trimmedLength < PRODUCT_REQUEST_NOTE_MIN_LENGTH;
  const tooShort = belowMinimum && trimmedLength > 0;
  const statusText = required
    ? tooShort
      ? `Minstens ${PRODUCT_REQUEST_NOTE_MIN_LENGTH} tekens vereist.`
      : "Verplicht in te vullen."
    : "Optioneel.";

  return (
    <div
      className={cn(
        "flex flex-col transition-colors",
        bordered &&
          "rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className,
      )}
    >
      <Textarea
        id={textareaId}
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        rows={rows}
        required={required}
        aria-required={required || undefined}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={counterId}
        placeholder={placeholder}
        style={{ minHeight: `calc(${rows} * 1.5em + 1.25rem)` }}
        className={cn(
          "rounded-none border-0 bg-transparent shadow-none dark:bg-transparent",
          bordered
            ? "pb-0 focus-visible:border-0 focus-visible:ring-0"
            : "px-0 py-0 focus-visible:ring-0",
        )}
      />
      <div
        id={counterId}
        className={cn(
          "flex items-center justify-between gap-component pt-1 text-xs text-muted-foreground",
          bordered ? "px-3 pb-2.5" : "px-0 pb-0",
        )}
      >
        <span className={cn(tooShort && "text-destructive-foreground")}>{statusText}</span>
        <span
          aria-live="polite"
          className={cn(
            "tabular-nums",
            (isNearLimit || belowMinimum) && "text-destructive-foreground",
          )}
        >
          {value.length.toLocaleString("nl-BE")} / {maxLength.toLocaleString("nl-BE")}
        </span>
      </div>
    </div>
  );
}
