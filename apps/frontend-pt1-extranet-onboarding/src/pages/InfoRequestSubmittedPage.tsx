import {
  ArrowLeft01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { P } from "@procertus-ui/ui";
import { StatusPage } from "@procertus-ui/ui-lib";
import { useLayoutEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PublicOverviewSection } from "../components/PublicOverviewSection";
import {
  readInfoRequestSubmittedSnapshot,
  type InfoRequestSubmittedSnapshot,
} from "../features/info-request/info-request-submitted-snapshot";

const START_PATH = "/welcome";

function formatSubmittedWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SubmittedPageBody(props: { snapshot: InfoRequestSubmittedSnapshot }) {
  const { snapshot } = props;
  const submittedLabel = formatSubmittedWhen(snapshot.submittedAt);

  return (
    <>
      <PublicOverviewSection
        title="Dit stuurde je in"
        description="De certificaten uit je mandje, samen met de toelichting die je hebt toegevoegd."
      >
        {snapshot.inquiries.length === 0 ? (
          <P className="m-0 text-sm text-muted-foreground">
            Je mandje was leeg bij verzending. PROCERTUS leest je vraag toch door en komt op basis
            daarvan bij je terug.
          </P>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-component p-0">
            {snapshot.inquiries.map((line, idx) => (
              <li
                key={`${line.label}-${idx}`}
                className="flex flex-col gap-micro rounded-lg border border-border/80 bg-muted/40 px-component py-micro sm:flex-row sm:items-baseline sm:justify-between sm:gap-component"
              >
                <span className="font-medium text-foreground">{line.label}</span>
                {line.productHint ? (
                  <span className="text-sm text-muted-foreground">{line.productHint}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Los van een catalogusproduct
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {snapshot.submissionNote.trim().length > 0 ? (
          <div className="flex flex-col gap-micro border-t border-border/60 pt-section">
            <p className="m-0 text-sm font-semibold text-foreground">Je toelichting</p>
            <div className="max-h-40 overflow-y-auto rounded-md border border-dashed border-border/80 bg-muted/20 p-component text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {snapshot.submissionNote}
            </div>
          </div>
        ) : null}
      </PublicOverviewSection>

      <PublicOverviewSection
        title="Organisatie en context"
        description="PROCERTUS koppelt dit dossier aan de organisatie waarmee je je hier hebt geïdentificeerd."
      >
        <dl className="m-0 grid gap-section text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-micro">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Kanaal
            </dt>
            <dd className="font-medium text-foreground">{snapshot.serviceLabel}</dd>
          </div>
          <div className="flex flex-col gap-micro">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Organisatie / bedrijf
            </dt>
            <dd className="font-medium text-foreground">{snapshot.organizationName}</dd>
          </div>
          {snapshot.scheduling?.wantsExpertCall ? (
            <div className="flex flex-col gap-micro sm:col-span-2">
              <dt className="flex items-center gap-micro text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <HugeiconsIcon icon={Calendar01Icon} className="size-3.5 shrink-0" aria-hidden />
                Expertgesprek
              </dt>
              <dd className="flex flex-wrap items-center gap-micro text-muted-foreground">
                {snapshot.scheduling.preferenceLabel ? (
                  <>
                    Voorkeursmoment:&nbsp;
                    <span className="font-medium text-foreground">
                      {snapshot.scheduling.preferenceLabel}
                    </span>
                  </>
                ) : (
                  "Je wil afstemmen met een expert. PROCERTUS neemt contact op voor een concreet moment."
                )}
              </dd>
            </div>
          ) : null}
          {submittedLabel ? (
            <div className="flex flex-col gap-micro sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ontvangen
              </dt>
              <dd className="text-muted-foreground">{submittedLabel}</dd>
            </div>
          ) : null}
        </dl>
      </PublicOverviewSection>

      <PublicOverviewSection
        title="Je teamleden in het Klantenportaal"
        description="Iedereen met een e-mailadres hieronder krijgt een uitnodiging om zich aan te melden. De juiste PROCERTUS-rol wordt automatisch gekoppeld."
      >
        {snapshot.portalPersons.length === 0 ? (
          <P className="m-0 text-sm text-muted-foreground">
            Er zijn geen portaalgebruikers opgeslagen. Je krijgt alsnog bericht op het e-mailadres
            dat je hebt achtergelaten tijdens je aanvraag.
          </P>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-component p-0">
            {snapshot.portalPersons.map((p) => (
              <li
                key={`${p.email}-${p.roleLabel}`}
                className="flex flex-col gap-component rounded-xl border border-border bg-background/60 p-component sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 gap-micro">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="mt-1 size-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="m-0 truncate font-semibold text-foreground">{p.fullName}</p>
                    <p className="m-0 text-sm leading-relaxed text-muted-foreground">
                      Rol: <span className="font-medium text-foreground">{p.roleLabel}</span>
                    </p>
                    <p className="m-0 truncate text-sm text-muted-foreground">{p.email}</p>
                  </div>
                </div>
                <div className="shrink-0 self-start sm:text-right">
                  {p.invitedToPortal ? (
                    <span className="inline-flex items-center gap-micro rounded-full border border-emerald-500/30 bg-emerald-500/10 px-micro py-micro text-xs font-medium text-emerald-950 dark:border-emerald-400/35 dark:bg-emerald-500/15 dark:text-emerald-100">
                      <HugeiconsIcon icon={Mail01Icon} className="size-3 shrink-0" aria-hidden />
                      Uitnodiging verzonden
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted/50 px-micro py-micro text-xs font-medium text-muted-foreground">
                      Geen uitnodiging
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </PublicOverviewSection>

      <PublicOverviewSection title="Je volgende stappen op het Klantenportaal">
        <ul className="m-0 flex list-disc flex-col gap-component ps-6 text-sm leading-relaxed text-muted-foreground">
          <li>
            Iedereen die je toevoegde, krijgt een e-mail. Via de veilige link activeer je samen met
            PROCERTUS je wachtwoord of MFA.
          </li>
          <li>
            Onder <strong className="text-foreground">Mijn profiel</strong> vind je je contact- en
            organisatiegegevens en openstaande wijzigingsverzoeken.
          </li>
          <li>
            Alle <strong className="text-foreground">aanvragen</strong> die je indient, vind je
            onderaan je profiel. Daar vul je documenten aan en volg je de status.
          </li>
          <li>
            Elk uitgenodigd teamlid krijgt automatisch de{" "}
            <strong className="text-foreground">rechten en aanvragen</strong> die bij zijn of haar
            PROCERTUS-rol passen. Later voeg je in gebruikersbeheer zelf collega’s toe of pas je
            rechten aan.
          </li>
          <li>
            Vragen? Gebruik bij voorkeur de contactopties uit de bevestigingsmail. Daarin staat ook
            het dossier-ID dat PROCERTUS aan deze aanvraag koppelt.
          </li>
        </ul>
      </PublicOverviewSection>
    </>
  );
}

export function InfoRequestSubmittedPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  const snapshot = useMemo(() => {
    if (serviceId == null || serviceId.trim() === "") return null;
    return readInfoRequestSubmittedSnapshot(serviceId);
  }, [serviceId]);

  return (
    <div data-density="spacious" className="contents">
      {snapshot ? (
        <StatusPage
          innerColumnClassName="max-w-2xl"
          statusContentClassName="max-w-full"
          belowCardClassName="w-full items-stretch gap-region text-left"
          icon={CheckmarkCircle01Icon}
          heading="Aanvraag verzonden"
          description={
            <span className="text-base leading-relaxed text-muted-foreground">
              Bedankt! We hebben{" "}
              <strong className="font-semibold text-foreground">
                je vrijblijvende informatieaanvraag
              </strong>{" "}
              geregistreerd voor&nbsp;
              <strong className="font-semibold text-foreground">{snapshot.organizationName}</strong>
              . Hieronder zie je wat werd meegestuurd en hoe collega’s het portaal in gebruik nemen.
            </span>
          }
          actions={[
            {
              label: "Terug naar startpagina",
              onClick: () => navigate(START_PATH),
              variant: "default",
              icon: ArrowLeft01Icon,
            },
          ]}
        >
          <SubmittedPageBody snapshot={snapshot} />
        </StatusPage>
      ) : (
        <StatusPage
          icon={CheckmarkCircle01Icon}
          heading="Aanvraag verzonden"
          description="Bedankt voor je aanvraag. We bekijken je gegevens en nemen snel contact met je op. Herlaad je deze pagina, dan zijn de gekoppelde details niet meer zichtbaar. Je aanvraag is wel ontvangen."
          actions={[
            {
              label: "Terug naar startpagina",
              onClick: () => navigate(START_PATH),
              variant: "default",
              icon: ArrowLeft01Icon,
            },
          ]}
        />
      )}
    </div>
  );
}
