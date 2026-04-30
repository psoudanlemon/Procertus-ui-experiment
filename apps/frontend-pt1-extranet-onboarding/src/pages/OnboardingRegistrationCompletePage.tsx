import { ArrowLeft01Icon, Mail01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, ButtonGroup, ButtonGroupSeparator } from "@procertus-ui/ui";
import { StatusPage } from "@procertus-ui/ui-lib";
import {
  useMockPrototypeIsAuthenticated,
  usePrototypeOverlayOnMount,
  type PrototypeOverlayOptions,
} from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  clearAnonymousOnboardingStorage,
  readOnboardingRegistrationCompletePayload,
  type OnboardingRegistrationCompletePayload,
} from "@procertus-ui/ui-certification";

const registrationCompleteOverlay = (): PrototypeOverlayOptions => ({
  placement: "top-right",
  overlayAriaLabel: "Open productvraag (prototype)",
  demoBadgeLabel: "Vraag",
  demoBadgeTitle: "Product- en procesvraag voor de klant — geen definitieve regels voor dit scherm.",
  title: "Wanneer mag de gebruiker het portaal gebruiken?",
  description: (
    <>
      Kan iemand na registratie direct verder met zijn login op het portaal? Of willen we eerst
      een beoordeling of goedkeuring van de aanvraag?
    </>
  ),
  notice:
    "Indien eerst controle: moet dan eerst zowel het gebruikersprofiel, organisatieprofiel en certificatieaanvraag beoordeeld worden? Of beslist de PROCERTUS-admin zelf wanneer de gebruiker het portaal kan gebruiken, los van de goedkeuring van de aanvragen?",
});

function OnboardingRegistrationCompleteView({
  payload,
}: {
  payload: OnboardingRegistrationCompletePayload;
}) {
  const navigate = useNavigate();
  const { representativeEmail, organizationName, includedInquiryCount } = payload;

  usePrototypeOverlayOnMount(registrationCompleteOverlay, []);

  return (
    <div data-density="operational" className="contents">
      <StatusPage
        icon={Mail01Icon}
        heading="Uw account is klaar"
        description={
          <>
            <p className="m-0 text-[1.0625rem] font-normal leading-[1.65] tracking-tight text-foreground/95">
              Uw dossier staat klaar bij{" "}
              <strong className="font-semibold text-foreground">{organizationName}</strong>, met u
              als contact op{" "}
              <strong className="font-semibold text-foreground">{representativeEmail}</strong>.
            </p>
            <p className="m-0 text-base leading-relaxed">
              {includedInquiryCount === 1
                ? "Uw geselecteerde aanvraag is opgeslagen en gekoppeld aan dit account."
                : `Uw ${includedInquiryCount} geselecteerde aanvragen zijn opgeslagen en gekoppeld aan dit account.`}{" "}
            </p>
          </>
        }
        actions={[]}
      >
        <>
          <p className="m-0 border-t border-border/60 pt-4 text-sm font-medium leading-relaxed text-foreground">
            Activeer uw account via e-mail
          </p>
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            We hebben een bericht gestuurd naar uw mailbox met een persoonlijke link. Open die link
            om uw account te activeren. Tot die tijd kunt u nog niet inloggen op het portaal — dat
            volgt pas na bevestiging.
          </p>
          <ButtonGroup className="flex-wrap items-center gap-x-2 gap-y-2">
            <Button asChild variant="link" className="text-sm text-muted-foreground">
              <Link to="/">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 shrink-0" aria-hidden />
                Terug
              </Link>
            </Button>
            <ButtonGroupSeparator orientation="vertical" className="mx-0.5 h-4 min-h-4 bg-border" />
            <Button
              type="button"
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => {
                clearAnonymousOnboardingStorage();
                navigate("/", { replace: true });
              }}
            >
              <HugeiconsIcon icon={RefreshIcon} className="size-4 shrink-0" aria-hidden />
              Reset
            </Button>
          </ButtonGroup>
        </>
      </StatusPage>
    </div>
  );
}

/**
 * Dedicated full-viewport status experience after mock onboarding submit — not the onboarding shell / StepLayout.
 * Loading simulation runs in a modal on the summary step; this route only shows success.
 */
export function OnboardingRegistrationCompletePage() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  const [payload] = useState<OnboardingRegistrationCompletePayload | null>(() =>
    readOnboardingRegistrationCompletePayload(),
  );

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!payload) {
    return <Navigate to="/welcome/start" replace />;
  }

  return <OnboardingRegistrationCompleteView payload={payload} />;
}
