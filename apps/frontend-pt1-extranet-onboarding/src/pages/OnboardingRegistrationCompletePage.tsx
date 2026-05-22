import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Mail01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  P,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import {
  deriveRegistrationCompleteSummary,
  clearOnboardingStorage,
  readOnboardingRegistrationCompletePayload,
  type OnboardingRegistrationCompletePayload,
  type RegistrationCompleteSummary,
} from "@procertus-ui/ui-certification";
import { StatusPage } from "@procertus-ui/ui-lib";
import {
  useMockPrototypeIsAuthenticated,
  usePrototypeOverlayOnMount,
  type PrototypeOverlayOptions,
} from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { PublicOverviewSection } from "../components/PublicOverviewSection";
import { FORMAL_ONBOARDING_PATH } from "../routes/formal-request-routing";

function registrationOverlay(): PrototypeOverlayOptions {
  return {
    placement: "top-right",
    overlayAriaLabel: "Open productvraag (prototype)",
    demoBadgeLabel: "Vraag",
    demoBadgeTitle:
      "Product- en procesvraag voor de klant — geen definitieve regels voor dit scherm.",
    title: "Wanneer mag de gebruiker het portaal gebruiken?",
    description: (
      <>
        Kan iemand na registratie direct verder met zijn login op het portaal? Of willen we eerst
        een beoordeling of goedkeuring van de aanvraag?
      </>
    ),
    notice:
      "Indien eerst controle: moet dan eerst zowel het gebruikersprofiel, organisatieprofiel en certificatieaanvraag beoordeeld worden? Of beslist de PROCERTUS-admin zelf wanneer de gebruiker het portaal kan gebruiken, los van de goedkeuring van de aanvragen?",
  };
}

function formatCompletedWhen(iso: string): string {
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

function digitalFollowBrief(entryId: string): string {
  switch (entryId) {
    case "innovation-attest":
      return "We volgen je dossier inhoudelijk op. Documenten bewaar je onder je dossier in het Klantenportaal.";
    case "metrology":
      return "De planning van kalibratie en inspectie verloopt grotendeels digitaal. Je krijgt een melding zodra er actie nodig is.";
    case "atg":
      return "Je productattesten en aanvullende documenten beheer je in het dossier.";
    case "partijkeuring":
      return "We sturen je aanvraag door naar de gekozen controledienst. De status volg je onder je aanvragen.";
    default:
      return "Documenten, vragen en statusupdates vind je onder je aanvragen in het Klantenportaal.";
  }
}

function RegistrationCompleteSections(props: {
  summary: RegistrationCompleteSummary;
  payloadPresent: Pick<OnboardingRegistrationCompletePayload, "includedInquiryCount">;
}) {
  const { summary, payloadPresent } = props;
  const completedLabel = formatCompletedWhen(summary.completedAtIso);

  return (
    <>
      <PublicOverviewSection
        title="Je ingediende aanvragen en wat eerst volgt"
        description="Alles wat op je nazicht stond onder “ingesloten bij indiening”, vind je hier terug. Elke aanvraag krijgt een dossier-ID in je portaal voor uploads en correspondentie."
      >
        {summary.inquiries.length === 0 ? (
          <P className="m-0 text-sm text-muted-foreground">
            Het overzicht is hier niet meer beschikbaar (bijvoorbeeld na een herlading van de
            pagina). Je diende{" "}
            <span className="font-medium text-foreground">
              {payloadPresent.includedInquiryCount}{" "}
              {payloadPresent.includedInquiryCount === 1
                ? "conceptaanvraag"
                : "conceptaanvragen"}
            </span>
            {" "}in. Zodra je de uitnodigingsmail opent, vind je elk traject terug onder je
            aanvragen in het Klantenportaal.
          </P>
        ) : (
          <div className="flex w-full min-w-0 flex-col gap-section">
            <p className="sr-only">
              Overzicht van bij indiening geselecteerde certificaat- en intake-lijnen,
              productcontext en digitaal vervolg via het Klantenportaal per rij.
            </p>
            <Table
              containerClassName="overflow-x-auto rounded-lg border border-border/60"
              className="w-full table-fixed text-xs leading-snug"
            >
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[22%] min-w-0 whitespace-normal font-semibold text-foreground">
                    Soort aanvraag
                  </TableHead>
                  <TableHead className="w-[36%] min-w-0 whitespace-normal font-semibold text-foreground">
                    Product · context
                  </TableHead>
                  <TableHead className="min-w-0 whitespace-normal font-semibold text-foreground">
                    Digitaal vervolg (Klantenportaal)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.inquiries.map((line) => (
                  <TableRow key={line.id} className="align-top hover:bg-transparent">
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word font-medium text-foreground">
                      {line.label}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word text-muted-foreground">
                      {line.productHint ??
                        "Niet gekoppeld aan een product uit de PROCERTUS-catalogus."}
                    </TableCell>
                    <TableCell className="min-w-0 whitespace-normal wrap-break-word text-muted-foreground">
                      {digitalFollowBrief(line.entryId)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="m-0 text-xs leading-relaxed text-muted-foreground">
              Elke aanvraag krijgt een eigen dossier in het portaal. PROCERTUS verwittigt je zodra
              er actie nodig is, bijvoorbeeld bij bewijsstukken die je moet aanleveren of bij
              goedkeuringsmijlpalen.
            </p>
          </div>
        )}

        {summary.submissionNote.trim().length > 0 ? (
          <div className="flex flex-col gap-micro border-t border-border/60 pt-section">
            <p className="m-0 text-sm font-semibold text-foreground">Begeleidende toelichting</p>
            <div className="max-h-40 overflow-y-auto rounded-md border border-dashed border-border/80 bg-background/70 p-component text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {summary.submissionNote}
            </div>
          </div>
        ) : null}
      </PublicOverviewSection>

      <PublicOverviewSection
        title="Je teamleden in het Klantenportaal"
        description="Iedereen hieronder krijgt een uitnodiging om zich aan te melden. Bij activatie wordt automatisch de juiste rol toegekend (kwaliteit, facturatie, certificatie, enz.). Collega's die hier nog niet vermeld staan, kun je later vanuit je beheer uitnodigen."
      >
        <ul className="m-0 flex list-none flex-col gap-component p-0">
          {summary.portalPersons.map((p) => (
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
                    Rol:&nbsp;<span className="font-medium text-foreground">{p.roleLabel}</span>
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
                  <span className="inline-flex items-center rounded-full border border-muted-foreground/35 bg-muted/50 px-micro py-micro text-xs font-medium text-muted-foreground">
                    Geen uitnodiging
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </PublicOverviewSection>

      <PublicOverviewSection title="Volgende stappen, meteen na deze melding">
        <ul className="m-0 flex list-disc flex-col gap-component ps-6 text-sm leading-relaxed text-muted-foreground">
          <li>
            Check je mailbox en volg de persoonlijke uitnodigingslink naar het Klantenportaal. Open
            die link niet in een privévenster, want daar worden cookies geblokkeerd.
          </li>
          <li>
            In je profiel vind je je contact-, organisatie- en adresgegevens en eventueel open
            vragenlijsten.
          </li>
          <li>
            Onder <strong className="text-foreground">Mijn aanvragen</strong> staat elk ingediend
            traject met de volgende documentdeadlines, bijvoorbeeld CE-labelfoto’s, SDS-bewijsstukken
            of productieschema’s.
          </li>
          <li>
            PROCERTUS verwittigt je bij elke statuswijziging, zoals een nieuwe bewijsvraag, een
            geplande audit of een conceptattest. Tot je actie nodig is, blijft het dossier
            alleen-lezen.
          </li>
          <li>
            Volgen collega’s hetzelfde traject mee? Voeg ze later zelf toe onder{" "}
            <strong className="text-foreground">Gebruikers &amp; rollen</strong>, zodra je je eerste
            login hebt afgerond.
          </li>
        </ul>
        {completedLabel ? (
          <P className="m-0 border-t border-border/60 pt-section text-xs text-muted-foreground">
            Registratie afgesloten op {completedLabel}&nbsp;(server-tijd, Europe/Brussel).
          </P>
        ) : null}
      </PublicOverviewSection>
    </>
  );
}

function RegistrationCompleteLeadCard(props: {
  summary: RegistrationCompleteSummary;
  children: ReactNode;
}) {
  const nav = useNavigate();
  usePrototypeOverlayOnMount(registrationOverlay, []);

  return (
    <>
      <StatusPage
        icon={Mail01Icon}
        innerColumnClassName="max-w-2xl"
        statusContentClassName="max-w-full"
        belowCardClassName="w-full items-stretch gap-region text-left"
        heading="Je account is klaar"
        description={
          <div className="flex flex-col gap-section">
            <p className="m-0 text-base font-normal tracking-tight text-foreground/95">
              We bevestigen het dossier van{" "}
              <strong className="font-semibold text-foreground">
                {props.summary.organizationName}
              </strong>
              . Je hoofdcontact is{" "}
              <strong className="font-semibold text-foreground">
                {props.summary.representativeEmail}
              </strong>
              . Je registreerde in totaal{" "}
              <strong className="font-semibold text-foreground">
                {props.summary.includedInquiryCount}
              </strong>{" "}
              {props.summary.includedInquiryCount === 1
                ? "conceptaanvraag bij PROCERTUS"
                : "conceptaanvragen bij PROCERTUS"}
              . Onderaan dit scherm vind je de volledige uitsplitsing en wat er digitaal op volgt.
            </p>
            <div className="flex flex-wrap items-start gap-micro rounded-xl border border-primary/25 bg-primary/5 px-component py-component text-left">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                aria-hidden
                className="mt-0.5 size-6 shrink-0 text-primary"
              />
              <p className="m-0 text-sm leading-relaxed text-muted-foreground">
                <strong className="font-medium text-foreground">
                  Activeer je portaaltoegang via e-mail.
                </strong>{" "}
                Elk dossier krijgt een dossier-ID in je Klantenportaal. Zonder activering heb je
                daar nog geen zicht op, maar je dossier is wel bij PROCERTUS geregistreerd.
              </p>
            </div>
          </div>
        }
        actions={[]}
      >
        {props.children}
        <>
          <div className="flex flex-col gap-section border-t border-border/60 pt-section">
            <p className="m-0 text-sm font-medium leading-relaxed text-foreground">
              Volgende stap: check je mailbox
            </p>
            <p className="m-0 text-sm leading-relaxed text-muted-foreground">
              Zoek in je hoofdmailbox (en eventueel in spam of doorgestuurde adressen) naar de
              bevestigingsmails van{" "}
              <strong className="text-foreground underline-offset-4">PROCERTUS</strong>. Zodra je
              account klaarstaat, volg je elke dossierstatus online. Tot je activeert, is er nog
              geen login.
            </p>
            <ButtonGroup className="flex-wrap items-center gap-component">
              <Button asChild variant="link" className="text-sm text-muted-foreground">
                <Link to="/">
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 shrink-0" aria-hidden />
                  Terug
                </Link>
              </Button>
              <ButtonGroupSeparator
                orientation="vertical"
                className="mx-0.5 h-4 min-h-4 bg-border"
              />
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground"
                onClick={() => {
                  clearOnboardingStorage();
                  nav("/", { replace: true });
                }}
              >
                <HugeiconsIcon icon={RefreshIcon} className="size-4 shrink-0" aria-hidden />
                Reset sessie‑gegevens
              </Button>
            </ButtonGroup>
          </div>
        </>
      </StatusPage>
    </>
  );
}

/**
 * Full-view success page after dossier-submit (modal ends here). Uses stored flow snapshot list for rich UX summary.
 */
export function OnboardingRegistrationCompletePage() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  const [payload] = useState<OnboardingRegistrationCompletePayload | null>(() =>
    readOnboardingRegistrationCompletePayload(),
  );

  const summary = useMemo(
    () => (payload == null ? null : deriveRegistrationCompleteSummary(payload)),
    [payload],
  );

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  if (isAuthenticated) return <Navigate to="/" replace />;

  if (!payload || summary == null) return <Navigate to={FORMAL_ONBOARDING_PATH} replace />;

  return (
    <div data-density="operational" className="contents">
      <RegistrationCompleteLeadCard summary={summary}>
        <RegistrationCompleteSections summary={summary} payloadPresent={payload} />
      </RegistrationCompleteLeadCard>
    </div>
  );
}
