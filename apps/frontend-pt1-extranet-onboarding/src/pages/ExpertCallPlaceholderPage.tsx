import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Badge,
  Button,
  Calendar,
  DensityProvider,
  Field,
  FieldLabel,
  H4,
  Input,
  Separator,
} from "@procertus-ui/ui";
import { TrajectLayout } from "@procertus-ui/ui-certification";
import { APP_FOOTER } from "../layouts/footerConfig";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import {
  TRAJECT_ENTRY_POINT_QUERY_PARAM,
  buildTrajectSubmissionContext,
  isTrajectEntryPoint,
  readOnboardingFlowSnapshot,
  type TrajectEntryPoint,
  type TrajectSubmissionContext,
} from "../features/traject/traject-submission-context";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";
const TRIAGE_PATH = (serviceId: string) => `/welcome/aanvraag/${serviceId}`;

const ENTRY_POINT_LABEL: Record<TrajectEntryPoint, string> = {
  "wegwijzer-detail": "Vanuit certificaat-detail",
  triage: "Vanuit triage (informatieve aanvraag)",
};

const SESSION_HIGHLIGHTS = [
  "Eén uur live online, videogesprek met scherm delen",
  "Doorloop van de minimale vereisten en uw dossier",
  "Concrete inschatting van het te volgen traject",
] as const;

const TIME_SLOTS = [
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
] as const;

const SELECTION_FORMATTER = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function ExpertCallPlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const service = findWegwijzerService(serviceId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const formattedSelection =
    selectedDate && selectedSlot
      ? `${SELECTION_FORMATTER.format(selectedDate)} om ${selectedSlot}`
      : null;

  const fromParam = searchParams.get(TRAJECT_ENTRY_POINT_QUERY_PARAM);
  const entryPoint = isTrajectEntryPoint(fromParam) ? fromParam : undefined;

  /**
   * Snapshot van OnboardingFlowProvider state ten tijde van het renderen. We mounten geen provider:
   * deze pagina hoeft alleen te lezen.
   */
  const flowSnapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const submissionContext = useMemo<TrajectSubmissionContext>(
    () =>
      buildTrajectSubmissionContext({
        entryPoint,
        urlServiceId: serviceId,
        flowState: flowSnapshot,
      }),
    [entryPoint, serviceId, flowSnapshot],
  );
  const prefill = flowSnapshot.context;

  // /welcome/expert-call/:serviceId with an unknown id → fall back to overview.
  // /welcome/expert-call (no param) is the generic intake from the Hero banner.
  if (serviceId && !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const entry = service?.entry;
  const intro = entry
    ? `Eén uur live met een PROCERTUS-expert om de vereisten voor ${entry.label} en uw dossier door te nemen, voordat u een aanvraag start.`
    : "Eén uur live met een PROCERTUS-expert om uw vraag, uw dossier en de juiste route samen door te nemen.";

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else if (entry) {
      navigate(TRIAGE_PATH(entry.id));
    } else {
      navigate(WEGWIJZER_PATH);
    }
  };

  return (
    <DensityProvider density="operational">
      <TrajectLayout
        onSignInClick={() => navigate(LOGIN_PATH)}
        footer={APP_FOOTER}
        backAction={{ label: "Terug", onClick: handleBack }}
        title="Plan een expert call"
        description={intro}
      >
        <div className="flex flex-col gap-region">
          <PageSection title="Wat u kunt verwachten">
            <ul className="flex flex-col gap-component">
              {SESSION_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-component text-sm leading-normal"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="mt-0.5 size-5 shrink-0 text-accent-foreground"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PageSection>

          <PageSection
            title="Kies een moment"
            description="Sessies duren één uur en starten op het hele of halve uur."
          >
            <div className="flex flex-col gap-section md:flex-row md:items-stretch md:gap-0">
              <div className="flex flex-1 justify-center md:justify-start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-fit"
                />
              </div>
              <Separator orientation="vertical" className="hidden md:block" />
              <div className="flex max-h-80 flex-col gap-micro overflow-y-auto md:w-44 md:pl-section">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setSelectedSlot(slot)}
                      className="w-full justify-center"
                      disabled={!selectedDate}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </div>
            </div>
            {formattedSelection ? (
              <p className="text-sm text-muted-foreground">
                Uw expert call is gepland voor{" "}
                <span className="font-medium text-foreground">{formattedSelection}</span>.
              </p>
            ) : null}
          </PageSection>

          <PageSection title="Uw gegevens">
            <div className="grid grid-cols-1 gap-section sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="expert-call-firstname">Voornaam</FieldLabel>
                <Input
                  id="expert-call-firstname"
                  autoComplete="given-name"
                  defaultValue={prefill.representativeFirstName || undefined}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="expert-call-lastname">Achternaam</FieldLabel>
                <Input
                  id="expert-call-lastname"
                  autoComplete="family-name"
                  defaultValue={prefill.representativeLastName || undefined}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="expert-call-email">E-mailadres</FieldLabel>
                <Input
                  id="expert-call-email"
                  type="email"
                  autoComplete="email"
                  defaultValue={prefill.representativeEmail || undefined}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="expert-call-company">Bedrijfsnaam</FieldLabel>
                <Input
                  id="expert-call-company"
                  autoComplete="organization"
                  defaultValue={prefill.organizationName || undefined}
                />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">
              U ontvangt een agenda-uitnodiging met videolink zodra het moment is bevestigd.
            </p>
          </PageSection>

          <SubmissionContextSection context={submissionContext} />

          <div className="flex flex-wrap items-center justify-end gap-component">
            <Button type="button" variant="outline" size="lg" onClick={handleBack}>
              Terug
            </Button>
            <Button size="lg" disabled>
              Verzenden
            </Button>
          </div>
        </div>
      </TrajectLayout>
    </DensityProvider>
  );
}

/**
 * Toont welke breadcrumbs uit de TrajectFlow met deze submissie meegestuurd worden. Read-only,
 * bedoeld voor zichtbaarheid in de prototype zodat reviewers kunnen valideren dat hero / detail /
 * triage entry-points elk de juiste hoeveelheid context dragen.
 */
function SubmissionContextSection({ context }: { context: TrajectSubmissionContext }) {
  const hasAny = Object.keys(context).length > 0;
  const serviceLabel = context.serviceId
    ? (findWegwijzerService(context.serviceId)?.entry.label ?? context.serviceId)
    : null;
  const intentLabel =
    context.intent === "informational"
      ? "Informatieve aanvraag"
      : context.intent === "formal"
        ? "Formele aanvraag"
        : null;

  return (
    <PageSection
      title="Bijgevoegde context"
      description="Breadcrumbs uit de TrajectFlow die met deze aanvraag worden meegestuurd."
    >
      {hasAny ? (
        <div className="flex flex-wrap items-center gap-micro">
          {context.entryPoint ? (
            <Badge variant="secondary">{ENTRY_POINT_LABEL[context.entryPoint]}</Badge>
          ) : null}
          {serviceLabel ? <Badge variant="outline">{serviceLabel}</Badge> : null}
          {context.drafts && context.drafts.length > 0 ? (
            <Badge variant="outline">
              {context.drafts.length} concept{context.drafts.length === 1 ? "" : "en"}
            </Badge>
          ) : null}
          {intentLabel ? <Badge variant="outline">{intentLabel}</Badge> : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Geen voorafgaande context, deze aanvraag start vanaf de Wegwijzer-startpagina.
        </p>
      )}
    </PageSection>
  );
}

type PageSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

function PageSection({ title, description, children }: PageSectionProps) {
  const hasHeader = Boolean(title || description);
  return (
    <section className="flex flex-col gap-component">
      {hasHeader ? (
        <header className="flex flex-col gap-micro">
          {title ? <H4 className="leading-none">{title}</H4> : null}
          {description ? (
            <p className="text-sm leading-normal text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
