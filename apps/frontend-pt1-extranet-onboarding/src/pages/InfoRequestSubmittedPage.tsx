import { ArrowLeft01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { StatusPage } from "@procertus-ui/ui-lib";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

const START_PATH = "/welcome";

export function InfoRequestSubmittedPage() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const el = document.documentElement;
    el.dataset.publicLayout = "";
    return () => {
      delete el.dataset.publicLayout;
    };
  }, []);

  return (
    <div data-density="operational" className="contents">
      <StatusPage
        icon={CheckmarkCircle01Icon}
        heading="Aanvraag verzonden"
        description="Bedankt voor uw aanvraag. Wij bekijken uw gegevens en nemen binnenkort met u contact op om deze verder te bespreken."
        actions={[
          {
            label: "Terug naar startpagina",
            onClick: () => navigate(START_PATH),
            variant: "default",
            icon: ArrowLeft01Icon,
          },
        ]}
      />
    </div>
  );
}
