import {
  Button,
  Calendar,
  Card,
  CardContent,
  Checkbox,
  Field,
  FieldLabel,
  H3,
  Input,
} from "@procertus-ui/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const TIME_SLOTS = buildQuarterHourSlots(9, 17);

function buildQuarterHourSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 15, 30, 45]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

type FormState = {
  selectedDate: Date | undefined;
  selectedSlot: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  phone: string;
  company: string;
  wantsExpertCall: boolean;
};

/** Serializable mirror written to sessionStorage and optionally forwarded to hosts (onboarding snapshot). */
export type ExpertCallBookingPersistedSnapshot = {
  selectedDate: string | null;
  selectedSlot: string | null;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  phone: string;
  company: string;
  wantsExpertCall: boolean;
};

function serialize(state: FormState): ExpertCallBookingPersistedSnapshot {
  return {
    selectedDate: state.selectedDate ? state.selectedDate.toISOString() : null,
    selectedSlot: state.selectedSlot ?? null,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    jobTitle: state.jobTitle,
    phone: state.phone,
    company: state.company,
    wantsExpertCall: state.wantsExpertCall,
  };
}

function deserialize(raw: ExpertCallBookingPersistedSnapshot): FormState {
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
    jobTitle: raw.jobTitle ?? "",
    phone: raw.phone ?? "",
    company: raw.company ?? "",
    wantsExpertCall: raw.wantsExpertCall ?? false,
  };
}

function readPersistedState(storageKey: string | undefined): FormState | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    return deserialize(JSON.parse(raw) as ExpertCallBookingPersistedSnapshot);
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
    jobTitle?: string;
    phone?: string;
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
  /**
   * Wanneer `true` wordt de "Wenst u een call met een van onze experts?"-checkbox
   * weggelaten en is de agenda permanent zichtbaar. Gebruik dit op de expert-call
   * variant, waar de keuze voor een call al impliciet is.
   */
  alwaysShowSchedule?: boolean;
  /**
   * Wanneer `true` wordt de kaart met kalender en tijdslots getoond zodat de gebruiker
   * zelf een moment kiest. Standaard `false`: alleen contactgegevens (en eventueel de
   * checkbox om interesse in een expert call te tonen wanneer `alwaysShowSchedule` uit staat).
   */
  showSelfServiceScheduling?: boolean;
  /** Elke wijziging aan formulier-state wordt hier geserialiseerd doorgegeven (bv. onboarding snapshot). */
  onPersistedSnapshotChange?: (snapshot: ExpertCallBookingPersistedSnapshot) => void;
};

/**
 * Gedeelde view voor het informatieve-aanvraag / expert-call boekflow scherm:
 * highlights, optioneel kalender + tijdslots (`showSelfServiceScheduling`), contactgegevens. Wordt gebruikt door zowel
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
  alwaysShowSchedule = false,
  showSelfServiceScheduling = false,
  onPersistedSnapshotChange,
}: ExpertCallBookingViewProps) {
  const initial = useMemo<FormState>(() => {
    const persisted = readPersistedState(storageKey);
    const expertFlowActive = alwaysShowSchedule && showSelfServiceScheduling;
    if (persisted) {
      return expertFlowActive ? { ...persisted, wantsExpertCall: true } : persisted;
    }
    return {
      selectedDate: new Date(),
      selectedSlot: undefined,
      firstName: prefill?.firstName ?? "",
      lastName: prefill?.lastName ?? "",
      email: prefill?.email ?? "",
      jobTitle: prefill?.jobTitle ?? "",
      phone: prefill?.phone ?? "",
      company: prefill?.company ?? "",
      wantsExpertCall: expertFlowActive,
    };
    // We bewust geen prefill in deps: prefill is een nieuw object per render bij
    // parent re-renders, en de initial-snapshot mag maar één keer berekend worden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, alwaysShowSchedule, showSelfServiceScheduling]);

  const [state, setState] = useState<FormState>(initial);

  useEffect(() => {
    onPersistedSnapshotChange?.(serialize(state));
  }, [state, onPersistedSnapshotChange]);

  const update = (patch: Partial<FormState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      writePersistedState(storageKey, next);
      return next;
    });
  };

  const hasRequiredContact =
    state.firstName.trim() !== "" && state.lastName.trim() !== "" && state.email.trim() !== "";

  const hasMoment = state.selectedDate != null && state.selectedSlot != null;

  const canSubmit = showSelfServiceScheduling
    ? hasRequiredContact && (!state.wantsExpertCall || hasMoment)
    : hasRequiredContact;

  useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const slotScrollRef = useRef<HTMLDivElement>(null);
  const [slotFadeMask, setSlotFadeMask] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!state.wantsExpertCall) return;
    const el = slotScrollRef.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollHeight - el.clientHeight;
      if (overflow <= 1) {
        setSlotFadeMask(undefined);
        return;
      }
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop >= overflow - 1;
      const topStop = atTop ? "0" : "1rem";
      const topStart = atTop ? "black 0" : "transparent 0";
      const bottomStop = atBottom ? "100%" : "calc(100% - 1rem)";
      const bottomEnd = atBottom ? "black 100%" : "transparent 100%";
      setSlotFadeMask(
        `linear-gradient(to bottom, ${topStart}, black ${topStop}, black ${bottomStop}, ${bottomEnd})`,
      );
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [state.wantsExpertCall]);

  const contactCard = (
    <Card>
      <CardContent>
        <section className="flex flex-col gap-section">
          <div className="flex flex-col gap-micro">
            <H3>Uw gegevens</H3>
            <p className="text-sm text-muted-foreground">
              Vul uw contactgegevens in zodat wij u kunnen bereiken.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-firstname`}>Voornaam</FieldLabel>
              <Input
                id={`${idPrefix}-firstname`}
                autoComplete="given-name"
                required
                aria-required="true"
                value={state.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-lastname`}>Achternaam</FieldLabel>
              <Input
                id={`${idPrefix}-lastname`}
                autoComplete="family-name"
                required
                aria-required="true"
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
                required
                aria-required="true"
                value={state.email}
                onChange={(e) => update({ email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-phone`}>Telefoonnummer</FieldLabel>
              <Input
                id={`${idPrefix}-phone`}
                type="tel"
                autoComplete="tel"
                placeholder="Optioneel"
                value={state.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-jobtitle`}>Functie</FieldLabel>
              <Input
                id={`${idPrefix}-jobtitle`}
                autoComplete="organization-title"
                placeholder="Optioneel"
                value={state.jobTitle}
                onChange={(e) => update({ jobTitle: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-company`}>Bedrijfsnaam</FieldLabel>
              <Input
                id={`${idPrefix}-company`}
                autoComplete="organization"
                placeholder="Optioneel"
                value={state.company}
                onChange={(e) => update({ company: e.target.value })}
              />
            </Field>
          </div>
          {alwaysShowSchedule || !showSelfServiceScheduling ? null : (
            <Field orientation="horizontal" className="mt-component">
              <Checkbox
                id={`${idPrefix}-wants-call`}
                checked={state.wantsExpertCall}
                onCheckedChange={(checked) => update({ wantsExpertCall: checked === true })}
              />
              <FieldLabel htmlFor={`${idPrefix}-wants-call`} className="text-sm font-normal">
                Wenst u een call met een van onze experts?
              </FieldLabel>
            </Field>
          )}
        </section>
      </CardContent>
    </Card>
  );

  const scheduleCard = (
    <Card>
      <CardContent>
        <section className="flex flex-col gap-section">
          <div className="flex flex-col gap-micro">
            <H3>Kies een moment</H3>
            <p className="text-sm text-muted-foreground">
              Tijdslots zijn beschikbaar elk kwartier tussen 09:00 en 17:00.
            </p>
          </div>
          <div className="flex flex-col gap-section sm:grid sm:grid-cols-[auto_1fr] sm:items-stretch sm:gap-section">
            <Calendar
              mode="single"
              selected={state.selectedDate}
              onSelect={(date) => update({ selectedDate: date })}
              className="!w-full rounded-lg border border-border p-section [--cell-size:--spacing(9)] sm:!w-fit"
              classNames={{
                week: "mt-micro flex w-full gap-micro",
                weekdays: "flex gap-micro",
              }}
            />
            <div className="@container sm:relative">
              <div
                ref={slotScrollRef}
                className="max-h-72 overflow-y-auto pr-micro sm:absolute sm:inset-0 sm:max-h-none"
                style={
                  slotFadeMask
                    ? { maskImage: slotFadeMask, WebkitMaskImage: slotFadeMask }
                    : undefined
                }
              >
                <div className="grid grid-cols-2 gap-component @xs:grid-cols-3 @sm:grid-cols-4">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = state.selectedSlot === slot;
                    return (
                      <Button
                        key={slot}
                        type="button"
                        variant={isSelected ? "default" : "secondary"}
                        onClick={() => update({ selectedSlot: isSelected ? undefined : slot })}
                        className="w-full cursor-pointer justify-center transition-none hover:!rounded-md"
                        disabled={!state.selectedDate}
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );

  if (alwaysShowSchedule) {
    return (
      <div className="flex flex-col gap-component">
        {showSelfServiceScheduling ? scheduleCard : null}
        {contactCard}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-component">
      {contactCard}
      <AnimatePresence initial={false}>
        {showSelfServiceScheduling && state.wantsExpertCall ? (
          <motion.div
            key="moment"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden rounded-xl"
          >
            <div className="p-px">{scheduleCard}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
