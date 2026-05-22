/**
 * Publieke "Bedankt voor je aanvraag" bevestigingspagina voor submissions
 * waar PROCERTUS de gebruiker contact moet laten houden via het Klantenportaal.
 *
 * Wraps `StatusPage` uit `ui-lib` en toont:
 *   • een lead met de organisatienaam en de "ontvangen op"-timestamp;
 *   • een sectie "Volg je dossier op" met een verwijzing naar My PROCERTUS
 *     en een tabel met de uitgenodigde contactpersonen (e-mail + rol).
 *
 * De default-copy is afgestemd op de informatieaanvraag-flow. Heading,
 * lead, sectie-titel/-beschrijving en de actieknoppen zijn overschrijfbaar
 * zodat de registratie-bevestigingspagina dezelfde compositie kan hergebruiken
 * met haar eigen copy en CTA-paar (Klantenportaal + mailbox).
 */
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  H2,
  P,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@procertus-ui/ui";
import { StatusPage, type StatusPageAction } from "@procertus-ui/ui-lib";

export type InfoRequestSubmittedPortalPerson = {
  email: string;
  roleLabel: string;
  invitedToPortal: boolean;
};

export type InfoRequestSubmittedSnapshot = {
  submittedAt: string;
  organizationName: string;
  portalPersons: readonly InfoRequestSubmittedPortalPerson[];
};

export type InfoRequestSubmittedPanelProps = {
  snapshot: InfoRequestSubmittedSnapshot;
  /** Pagina-heading. Default "Bedankt voor je aanvraag". */
  heading?: string;
  /**
   * Override van de lead-paragraaf onder de heading. Default vermeldt
   * "vrijblijvende informatieaanvraag" + organisatienaam + ontvangen-op
   * timestamp en sluit af met de behandelingszin.
   */
  description?: ReactNode;
  /** Override van de sectietitel onder de lead. Default "Volg je dossier op". */
  sectionTitle?: string;
  /**
   * Override van de prozaregel boven de uitgenodigden-tabel. Default verwijst
   * naar `loginUrl` via een "My PROCERTUS"-link.
   */
  sectionDescription?: ReactNode;
  /**
   * Override van de actieknoppen onderaan de lead. Default toont één
   * "Terug naar startpagina"-knop als `onBack` gezet is. Wanneer `actions`
   * wordt doorgegeven heeft die voorrang en wordt `onBack` genegeerd.
   */
  actions?: StatusPageAction[];
  onBack?: () => void;
  /**
   * Doel van de "My PROCERTUS"-link in de default-sectiebeschrijving. Volgt
   * dezelfde conventie als `loginUrl` in de PublicHeader en OnboardingShell.
   * Default "/login" mapt op de bestaande guest login route. Wordt genegeerd
   * wanneer `sectionDescription` zelf overschreven wordt.
   */
  loginUrl?: string;
};

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

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-section rounded-xl border border-border bg-card p-section text-card-foreground text-left shadow-none">
      <div className="flex flex-col gap-micro">
        <H2 className="m-0 tracking-tight">{title}</H2>
        {description ? (
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">{description}</P>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FollowUpSection({
  snapshot,
  title,
  description,
  loginUrl,
}: {
  snapshot: InfoRequestSubmittedSnapshot;
  title: string;
  description?: ReactNode;
  loginUrl: string;
}) {
  const invited = snapshot.portalPersons.filter((p) => p.invitedToPortal);
  const resolvedDescription = description ?? (
    <>
      Tijdens je aanvraag gaf je enkele personen op als contactpersoon. Zij ontvangen per e-mail
      een uitnodiging voor{" "}
      <a
        href={loginUrl}
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        My PROCERTUS
      </a>
      , waar ze het dossier en relevante documenten steeds kunnen raadplegen.
    </>
  );

  return (
    <Section title={title} description={resolvedDescription}>
      {invited.length === 0 ? (
        <P className="m-0 text-sm text-muted-foreground">
          Geen uitnodigingen verstuurd. Je krijgt bericht op het e-mailadres uit je aanvraag.
        </P>
      ) : (
        <Table containerClassName="">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-auto px-0 pb-micro">E-mailadres</TableHead>
              <TableHead className="h-auto px-0 pb-micro text-right">Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invited.map((p) => (
              <TableRow key={`${p.email}-${p.roleLabel}`} className="hover:bg-transparent">
                <TableCell className="px-0 py-component">
                  <span className="flex items-center gap-component">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="font-medium text-foreground">{p.email}</span>
                  </span>
                </TableCell>
                <TableCell className="px-0 py-component text-right text-xs text-muted-foreground">
                  {p.roleLabel}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Section>
  );
}

export function InfoRequestSubmittedPanel({
  snapshot,
  heading = "Bedankt voor je aanvraag",
  description,
  sectionTitle = "Volg je dossier op",
  sectionDescription,
  actions,
  onBack,
  loginUrl = "/login",
}: InfoRequestSubmittedPanelProps) {
  const submittedLabel = formatSubmittedWhen(snapshot.submittedAt);
  const resolvedDescription = description ?? (
    <span className="text-base leading-relaxed text-muted-foreground">
      We ontvingen{" "}
      <strong className="font-semibold text-foreground">je vrijblijvende informatieaanvraag</strong>{" "}
      voor&nbsp;
      <strong className="font-semibold text-foreground">{snapshot.organizationName}</strong>
      {submittedLabel ? (
        <>
          {" "}
          op{" "}
          <strong className="font-semibold text-foreground">{submittedLabel}</strong>
        </>
      ) : null}
      . We behandelen je aanvraag zo snel mogelijk en nemen contact op indien er vragen zijn.
    </span>
  );

  const resolvedActions: StatusPageAction[] =
    actions ??
    (onBack
      ? [
          {
            label: "Terug naar startpagina",
            onClick: onBack,
            variant: "default",
            icon: ArrowLeft01Icon,
          },
        ]
      : []);

  return (
    <StatusPage
      innerColumnClassName="max-w-2xl"
      statusContentClassName="max-w-full"
      belowCardClassName="w-full items-stretch gap-region text-left"
      icon={CheckmarkCircle01Icon}
      heading={heading}
      description={resolvedDescription}
      actions={resolvedActions}
    >
      <FollowUpSection
        snapshot={snapshot}
        title={sectionTitle}
        description={sectionDescription}
        loginUrl={loginUrl}
      />
    </StatusPage>
  );
}
