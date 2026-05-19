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
        title="Wat maakte deel uit van uw aanvraag"
        description="Certificaatinformaties uit uw mandje en eventueel een korte context die u hebt toegevoegd."
      >
        {snapshot.inquiries.length === 0 ? (
          <P className="m-0 text-sm text-muted-foreground">
            Bij verzenden stonden er geen lijnen in het mandje. PROCERTUS leest uw vrijblijvende
            vraag toch door en kan op basis daarvan bij u terugkomen.
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
            <p className="m-0 text-sm font-semibold text-foreground">Uw toelichting</p>
            <div className="max-h-40 overflow-y-auto rounded-md border border-dashed border-border/80 bg-muted/20 p-component text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {snapshot.submissionNote}
            </div>
          </div>
        ) : null}
      </PublicOverviewSection>

      <PublicOverviewSection
        title="Organisatie en context"
        description="PROCERTUS koppelt dit dossier aan de organisatie waarover u zich hier bij ons heeft geïdentificeerd."
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
                  "U wilt een afstemming met een expert; PROCERTUS neemt contact op voor een concreet moment."
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
        title="Onboarding naar het Klantenportaal"
        description="Deze personen verschijnen in uw organisatie in het Klantenportaal. Iedereen met een adres hieronder ontvangt een e‑mail om in te loggen en het account te bevestigen; daarbij wordt de geschikte PROCERTUS‑rol automatisch gekoppeld."
      >
        {snapshot.portalPersons.length === 0 ? (
          <P className="m-0 text-sm text-muted-foreground">
            Geen lijst met portalgebruikers opgeslagen in dit prototypescherm — u krijgt alsnog
            bericht bij het e‑mailadres dat u heeft achtergelaten tijdens uw aanvraag.
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
                      Geen automatische uitnodiging
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </PublicOverviewSection>

      <PublicOverviewSection title="Uw volgende stappen op het Klantenportaal">
        <ul className="m-0 flex list-disc flex-col gap-component ps-6 text-sm leading-relaxed text-muted-foreground">
          <li>
            Alle toegevoegde gebruikers ontvangen een e‑mail; volg daar de veilige link om uw
            wachtwoord of sterk MFA‑middel samen met PROCERTUS te activeren.
          </li>
          <li>
            Na aanmelden vindt u onder <strong className="text-foreground">Mijn profiel</strong> uw
            contactgegevens, organisatiegegevens en openstaande wijzigingsverzoeken.
          </li>
          <li>
            Alle door u ingediende <strong className="text-foreground">aanvragen</strong>{" "}
            verschijnen gescheiden onderaan het profiel, zodat u documenten kan aanvullen of de
            status kan volgen.
          </li>
          <li>
            Elk uitgenodigd teamlid krijgt de{" "}
            <strong className="text-foreground">rechten en zichtbare aanvragen</strong> die bij zijn
            of haar PROCERTUS‑rol passen. U hoeft daar zelf niet in te grijpen; later kunt u in
            gebruikersbeheer collega’s met dezelfde rollen toevoegen of intrekken.
          </li>
          <li>
            Bij vragen gebruikt u bij voorkeur de contactopties uit de kantelinformatie‑mail — daar
            staat ook welk dossier-ID PROCERTUS intern aan deze aanvraag hangt.
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
    <div data-density="operational" className="contents">
      {snapshot ? (
        <StatusPage
          innerColumnClassName="max-w-2xl"
          statusContentClassName="max-w-full"
          belowCardClassName="w-full items-stretch gap-region text-left"
          icon={CheckmarkCircle01Icon}
          heading="Aanvraag verzonden"
          description={
            <span className="text-base leading-relaxed text-muted-foreground">
              Hartelijk dank. We hebben{" "}
              <strong className="font-semibold text-foreground">
                uw vrijblijvende informatieaanvraag
              </strong>{" "}
              geregistreerd voor&nbsp;
              <strong className="font-semibold text-foreground">{snapshot.organizationName}</strong>
              . Hieronder ziet u wat werd meegestuurd en hoe collega’s het portaal in gebruik nemen.
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
          description="Bedankt voor uw aanvraag. Wij bekijken uw gegevens en nemen binnenkort met u contact op om deze verder te bespreken. Herlaadt u deze pagina, dan tonen we geen gekoppelde details meer — uw aanvraag is wel ontvangen."
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
