import { Mail01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import {
  deriveRegistrationCompleteSummary,
  InfoRequestSubmittedPanel,
  readOnboardingRegistrationCompletePayload,
  type InfoRequestSubmittedSnapshot,
  type OnboardingRegistrationCompletePayload,
  type RegistrationCompleteSummary,
} from "@procertus-ui/ui-certification";
import {
  useMockPrototypeIsAuthenticated,
  usePrototypeOverlayOnMount,
  type PrototypeOverlayOptions,
} from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { FORMAL_ONBOARDING_PATH } from "../routes/formal-request-routing";
import { PUBLIC_GUEST_LOGIN_PATH } from "../routes/guestPaths";

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

function toSnapshot(summary: RegistrationCompleteSummary): InfoRequestSubmittedSnapshot {
  return {
    submittedAt: summary.completedAtIso,
    organizationName: summary.organizationName,
    portalPersons: summary.portalPersons.map((p) => ({
      email: p.email,
      roleLabel: p.roleLabel,
      invitedToPortal: p.invitedToPortal,
    })),
  };
}

/**
 * Full-view success page after dossier-submit. Hergebruikt het
 * `InfoRequestSubmittedPanel` met registratie-specifieke copy en een
 * primary/secondary CTA-paar (Klantenportaal + mailbox) in lijn met het
 * 3.12-design feedback item.
 */
export function OnboardingRegistrationCompletePage() {
  const navigate = useNavigate();
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  const [payload] = useState<OnboardingRegistrationCompletePayload | null>(() =>
    readOnboardingRegistrationCompletePayload(),
  );

  const summary = useMemo(
    () => (payload == null ? null : deriveRegistrationCompleteSummary(payload)),
    [payload],
  );

  usePrototypeOverlayOnMount(registrationOverlay, []);

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  if (isAuthenticated) return <Navigate to="/" replace />;

  if (!payload || summary == null) return <Navigate to={FORMAL_ONBOARDING_PATH} replace />;

  const snapshot = toSnapshot(summary);
  const inquiryCount = summary.includedInquiryCount;
  const inquiryWord = inquiryCount === 1 ? "conceptaanvraag" : "conceptaanvragen";

  return (
    <div data-density="spacious" className="contents">
      <InfoRequestSubmittedPanel
        snapshot={snapshot}
        heading="Je account is klaar"
        description={
          <span className="text-base leading-relaxed text-muted-foreground">
            We registreerden{" "}
            <strong className="font-semibold text-foreground">{inquiryCount}</strong>{" "}
            {inquiryWord} voor{" "}
            <strong className="font-semibold text-foreground">{summary.organizationName}</strong>.
            Activeer je portaaltoegang via de uitnodigingsmail om je dossiers op te volgen.
          </span>
        }
        sectionDescription={
          <>
            Tijdens je registratie gaf je enkele personen op als contactpersoon. Zij ontvangen per
            e-mail een uitnodiging voor{" "}
            <a
              href={PUBLIC_GUEST_LOGIN_PATH}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              My PROCERTUS
            </a>
            , waar ze het dossier en relevante documenten steeds kunnen raadplegen.
          </>
        }
        actions={[
          {
            label: "Ga naar Klantenportaal",
            onClick: () => navigate(PUBLIC_GUEST_LOGIN_PATH),
            variant: "default",
            icon: UserCircleIcon,
          },
          {
            label: "Open mijn mailbox",
            href: "mailto:",
            variant: "outline",
            icon: Mail01Icon,
          },
        ]}
        loginUrl={PUBLIC_GUEST_LOGIN_PATH}
      />
    </div>
  );
}
