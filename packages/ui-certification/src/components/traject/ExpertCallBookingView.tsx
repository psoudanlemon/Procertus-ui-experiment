import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Calendar,
  Field,
  FieldLabel,
  H3,
  Input,
  Separator,
} from "@procertus-ui/ui";
import { useEffect, useMemo, useState } from "react";

const SESSION_HIGHLIGHTS = [
  "Eén uur live online, videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00"] as const;

type FormState = {
  selectedDate: Date | undefined;
  selectedSlot: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

type PersistedShape = {
  selectedDate: string | null;
  selectedSlot: string | null;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

function serialize(state: FormState): PersistedShape {
  return {
    selectedDate: state.selectedDate ? state.selectedDate.toISOString() : null,
    selectedSlot: state.selectedSlot ?? null,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    company: state.company,
  };
}

function deserialize(raw: PersistedShape): FormState {
  let selectedDate: Date | undefined = undefined;
  if (raw.selectedDate) {
    const d = new Date(raw.selectedDate);
    if (!Number.isNaN(d.getTime())) selectedDate = d;
  }
  return {
    selectedDate,
    selectedSlot: raw.selectedSlot ?? undefined,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    email: raw.email ?? "",
    company: raw.company ?? "",
  };
}

function readPersistedState(storageKey: string | undefined): FormState | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    return deserialize(JSON.parse(raw) as PersistedShape);
  } catch {
    return null;
  }
}

function writePersistedState(storageKey: string | undefined, state: FormState) {
  if (!storageKey || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(serialize(state)));
  } catch {
    // Storage may be unavailable (private mode, quota) — fail silently.
  }
}

export type ExpertCallBookingViewProps = {
  /**
   * Optionele callback die meeleeft met de selectie van datum + tijdslot, zodat
   * een parent (bv. een TrajectLayout action bar) de Verzenden-knop kan
   * activeren wanneer de view "indien-klaar" is.
   */
  onCanSubmitChange?: (canSubmit: boolean) => void;
  /** Optionele prefill voor de contactgegevens-sectie. */
  prefill?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
  };
  /** Optioneel prefix voor input-ids zodat meerdere instances geen conflicten geven. */
  idPrefix?: string;
  /**
   * Optionele sessionStorage-sleutel. Wanneer gezet, persisteert de view zijn
   * formulier-state onder die sleutel zodat terug-navigatie de eerder ingevulde
   * gegevens herstelt. Geef per route (en service) een unieke sleutel mee.
   */
  storageKey?: string;
};

/**
 * Gedeelde view voor het informatieve-aanvraag / expert-call boekflow scherm:
 * highlights, kalender + tijdslots, contactgegevens. Wordt gebruikt door zowel
 * de Storybook-story als de live `/welcome/info-request` en `/welcome/expert-call`
 * routes.
 *
 * Wanneer `storageKey` gezet is, wordt elke wijziging synchroon naar
 * sessionStorage geschreven; bij re-mount (bv. nadat de gebruiker terug-navigeert
 * en weer naar deze pagina komt) wordt diezelfde state opnieuw ingeladen.
 */
export function ExpertCallBookingView({
  onCanSubmitChange,
  prefill,
  idPrefix = "expert-call",
  storageKey,
}: ExpertCallBookingViewProps) {
  const initial = useMemo<FormState>(() => {
    const persisted = readPersistedState(storageKey);
    if (persisted) return persisted;
    return {
      selectedDate: undefined,
      selectedSlot: undefined,
      firstName: prefill?.firstName ?? "",
      lastName: prefill?.lastName ?? "",
      email: prefill?.email ?? "",
      company: prefill?.company ?? "",
    };
    // We bewust geen prefill in deps: prefill is een nieuw object per render bij
    // parent re-renders, en de initial-snapshot mag maar één keer berekend worden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const [state, setState] = useState<FormState>(initial);

  const update = (patch: Partial<FormState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      writePersistedState(storageKey, next);
      return next;
    });
  };

  useEffect(() => {
    onCanSubmitChange?.(state.selectedDate != null && state.selectedSlot != null);
  }, [state.selectedDate, state.selectedSlot, onCanSubmitChange]);

  return (
    <div className="flex flex-col gap-section">
      <section className="flex flex-col gap-component">
        <H3>Wat u kunt verwachten</H3>
        <ul className="flex flex-col gap-component">
          {SESSION_HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-start gap-component text-sm leading-normal">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="mt-0.5 size-5 shrink-0 text-accent-foreground"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-component">
        <div className="flex flex-col gap-micro">
          <H3>Kies een moment</H3>
          <p className="text-sm text-muted-foreground">
            Sessies duren één uur en starten op het hele of halve uur.
          </p>
        </div>
        <div className="flex flex-col gap-section md:flex-row md:items-stretch md:gap-0">
          <div className="flex flex-1 justify-center md:justify-start">
            <Calendar
              mode="single"
              selected={state.selectedDate}
              onSelect={(date) => update({ selectedDate: date })}
              className="w-fit"
            />
          </div>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="flex max-h-80 flex-col gap-micro overflow-y-auto md:w-44 md:pl-section">
            {TIME_SLOTS.map((slot) => {
              const isSelected = state.selectedSlot === slot;
              return (
                <Button
                  key={slot}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => update({ selectedSlot: slot })}
                  className="w-full justify-center"
                  disabled={!state.selectedDate}
                >
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-component">
        <H3>Uw gegevens</H3>
        <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-firstname`}>Voornaam</FieldLabel>
            <Input
              id={`${idPrefix}-firstname`}
              autoComplete="given-name"
              value={state.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-lastname`}>Achternaam</FieldLabel>
            <Input
              id={`${idPrefix}-lastname`}
              autoComplete="family-name"
              value={state.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-email`}>E-mailadres</FieldLabel>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-company`}>Bedrijfsnaam</FieldLabel>
            <Input
              id={`${idPrefix}-company`}
              autoComplete="organization"
              value={state.company}
              onChange={(e) => update({ company: e.target.value })}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
