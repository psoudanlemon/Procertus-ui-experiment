import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight02Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  FilePlusIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  H2,
  H3,
} from "@procertus-ui/ui";
import { TrajectLayout, TrajectStoryFooter } from "@procertus-ui/ui-certification";
import { APP_FOOTER } from "../layouts/footerConfig";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import { TRAJECT_ENTRY_POINT_QUERY_PARAM } from "../features/traject/traject-submission-context";

const LOGIN_PATH = "/welcome/login";
const WEGWIJZER_PATH = "/welcome";
/**
 * Informatieve aanvraag krijgt een eigen route (`/welcome/info-request/:serviceId`). De `from=triage`
 * query stempelt de submissie zodat PROCERTUS weet dat de aanvrager al via de keuze gepasseerd is.
 */
const INFORMATIONAL_REQUEST_PATH = (serviceId: string) =>
  `/welcome/info-request/${serviceId}?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=triage`;
const FORMAL_REQUEST_PATH = "/welcome/start";
const EXPERT_CALL_PATH = (serviceId: string) =>
  `/welcome/expert-call/${serviceId}?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=triage`;

const CATEGORY_LABEL = {
  certification: "Productcertificatie",
  attest: "Attest",
  document: "Document",
  inspection: "Keuring",
} as const;

export function TriagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  if (!service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const { entry } = service;

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(`${WEGWIJZER_PATH}?service=${entry.id}`);
    }
  };

  return (
    <TrajectLayout
      onSignInClick={() => navigate(LOGIN_PATH)}
      footer={APP_FOOTER}
      kicker={CATEGORY_LABEL[entry.category]}
      title="Wat voor aanvraag wilt u graag indienen?"
      description="Kies een vrijblijvende informatieaanvraag voor een prijsopgave en advies, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen."
      bodyGap="section"
        actionBar={
          <TrajectStoryFooter
            onCancel={() => navigate(`${WEGWIJZER_PATH}?service=${entry.id}`)}
            onBack={handleBack}
          />
        }
      >
        <div className="flex flex-col gap-region">
          <div className="grid grid-cols-1 gap-region md:grid-cols-2">
            <TriageOptionCard
              tone="muted"
              icon={Mail01Icon}
              title="Informatieve aanvraag"
              description="Voor wie eerst wil afstemmen."
              bullets={[
                "Prijsopgave en advies op maat",
                "Geen verplichting tot opstart",
                "Reactie binnen enkele werkdagen",
                "Live sessie mogelijk tijdens het invullen",
              ]}
              cta="Start aanvraag"
              to={INFORMATIONAL_REQUEST_PATH(entry.id)}
            />
            <TriageOptionCard
              tone="primary"
              icon={FilePlusIcon}
              title="Formele aanvraag"
              description="Voor wie klaar is om in te dienen."
              bullets={[
                "Volledige aanvraagwizard",
                "Ontvankelijkheidsbeoordeling start meteen",
                "Dossier wordt actief opgevolgd",
                "Account pas nodig bij indiening",
              ]}
              cta="Start aanvraag"
              to={FORMAL_REQUEST_PATH}
            />
          </div>

          <Card
            className="relative flex cursor-pointer flex-col gap-component px-section py-section sm:flex-row sm:items-center sm:justify-between sm:gap-section"
            style={{ background: "var(--gradient-neutral)" }}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-micro">
              <H3>Liever eerst een expert spreken?</H3>
              <p className="text-sm leading-normal text-muted-foreground">
                Plan een live online sessie van één uur en doorloop de vereisten samen met een PROCERTUS-expert.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full bg-background group-hover/card:rounded-tl-[4px] group-hover/card:rounded-tr-[var(--cmd-deep)] group-hover/card:rounded-br-[4px] group-hover/card:rounded-bl-[var(--cmd-deep)] group-hover/card:bg-muted group-hover/card:text-foreground sm:w-auto sm:shrink-0"
            >
              <Link
                to={EXPERT_CALL_PATH(entry.id)}
                className="before:absolute before:inset-0 before:content-['']"
              >
                <HugeiconsIcon icon={Call02Icon} className="size-4" />
                Plan een gesprek
              </Link>
            </Button>
          </Card>
        </div>
    </TrajectLayout>
  );
}

type TriageOptionCardProps = {
  tone: "muted" | "primary";
  icon: typeof Mail01Icon;
  title: string;
  description: string;
  bullets: readonly string[];
  cta: string;
  to: string;
};

function TriageOptionCard({ tone, icon, title, description, bullets, cta, to }: TriageOptionCardProps) {
  const isPrimary = tone === "primary";
  return (
    <Card
      className={
        isPrimary
          ? "flex h-full flex-col gap-section py-section shadow-proc-md ring-2 ring-primary/30"
          : "flex h-full flex-col gap-section py-section shadow-proc-xs"
      }
    >
      <CardHeader className="!flex flex-row items-start gap-section px-section">
        <div
          className={
            isPrimary
              ? "flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
              : "flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
          }
        >
          <HugeiconsIcon icon={icon} className="size-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <H2>{title}</H2>
          <CardDescription className="text-sm leading-normal">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-section px-section">
        <ul className="flex flex-col gap-micro">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-micro text-sm leading-normal">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant={isPrimary ? "default" : "outline"} className="w-full justify-between">
          <Link to={to}>
            {cta}
            <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
