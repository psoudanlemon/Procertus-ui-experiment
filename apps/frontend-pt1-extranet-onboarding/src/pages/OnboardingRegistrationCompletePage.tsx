import { Mail01Icon } from "@hugeicons/core-free-icons";
import { StatusPage } from "@procertus-ui/ui-lib";
import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  readOnboardingRegistrationCompletePayload,
  type OnboardingRegistrationCompletePayload,
} from "../features/onboarding/onboardingRegistrationCompleteSession";

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
    return <Navigate to="/requests" replace />;
  }

  if (!payload) {
    return <Navigate to="/welcome/start" replace />;
  }

  const { representativeEmail, organizationName, includedInquiryCount } = payload;

  return (
    <div data-density="operational" className="contents">
      <StatusPage
        icon={Mail01Icon}
        heading="Uw account is klaar"
        description={
          <>
            <p className="m-0 text-[1.0625rem] font-normal leading-[1.65] tracking-tight text-foreground/95">
              Uw dossier staat klaar bij{" "}
              <strong className="font-semibold text-foreground">{organizationName}</strong>, met u als contact op{" "}
              <strong className="font-semibold text-foreground">{representativeEmail}</strong>.
            </p>
            <p className="m-0 text-base leading-relaxed">
              {includedInquiryCount === 1
                ? "Uw geselecteerde aanvraag is opgeslagen en gekoppeld aan dit account."
                : `Uw ${includedInquiryCount} geselecteerde aanvragen zijn opgeslagen en gekoppeld aan dit account.`}{" "}
                          </p>
            
          </>
        }
        actions={[

        ]}
      >
        <>
        <p className="m-0 border-t border-border/60 pt-4 text-sm font-medium leading-relaxed text-foreground">
              Activeer uw account via e-mail
            </p>
            <p className="m-0 text-sm leading-relaxed text-muted-foreground">
              We hebben een bericht gestuurd naar uw mailbox met een persoonlijke link. Open die link om uw account te activeren. Tot die tijd kunt u nog niet inloggen op het portaal — dat volgt pas na bevestiging.
            </p>
        </>
        </StatusPage>
    </div>
  );
}
