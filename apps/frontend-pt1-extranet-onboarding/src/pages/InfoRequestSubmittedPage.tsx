import { ArrowLeft01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { InfoRequestSubmittedPanel } from "@procertus-ui/ui-certification";
import { StatusPage } from "@procertus-ui/ui-lib";
import { useLayoutEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PUBLIC_GUEST_LOGIN_PATH } from "../routes/guestPaths";
import { readInfoRequestSubmittedSnapshot } from "../features/info-request/info-request-submitted-snapshot";

const START_PATH = "/welcome";

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
        <InfoRequestSubmittedPanel
          snapshot={snapshot}
          onBack={() => navigate(START_PATH)}
          loginUrl={PUBLIC_GUEST_LOGIN_PATH}
        />
      ) : (
        <StatusPage
          icon={CheckmarkCircle01Icon}
          heading="Bedankt voor je aanvraag"
          description="We bekijken je gegevens en nemen snel contact met je op. Herlaad je deze pagina, dan zijn de gekoppelde details niet meer zichtbaar. Je aanvraag is wel ontvangen."
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
