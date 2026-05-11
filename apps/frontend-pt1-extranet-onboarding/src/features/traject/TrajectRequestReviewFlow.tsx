import { Badge, DownloadableItemList } from "@procertus-ui/ui";
import {
  RequestPackageReview,
  TrajectLayout,
  TrajectStoryFooter,
  buildRulesetDocumentsForInquiries,
  type CertificationRequestDraft,
} from "@procertus-ui/ui-certification";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { APP_FOOTER } from "../../layouts/footerConfig";
import { findWegwijzerService } from "../wegwijzer/wegwijzer-services";
import { readOnboardingFlowSnapshot } from "./traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
const SIGNIN_PATH = "/welcome/login";
const BUNDLE_ASSEMBLE_PATH = (serviceId: string) =>
  `/welcome/aanvraag/${serviceId}/pakket`;
const REGISTRATION_COMPLETE_PATH = "/registratie-voltooid";

function joinName(first: string, last: string): string {
  const value = `${first} ${last}`.trim();
  return value.length > 0 ? value : "Aanvrager";
}

export function TrajectRequestReviewFlow() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = findWegwijzerService(serviceId);

  const snapshot = useMemo(() => readOnboardingFlowSnapshot(), []);
  const inquiries: CertificationRequestDraft[] = snapshot.drafts;

  const rows = useMemo(
    () =>
      inquiries.map((draft) => ({
        id: draft.id,
        label: draft.productLabel ?? "Aanvraag",
        value: draft.label,
      })),
    [inquiries],
  );

  const documents = useMemo(
    () => buildRulesetDocumentsForInquiries(inquiries),
    [inquiries],
  );

  const requester = useMemo(() => {
    const { representativeFirstName, representativeLastName, representativeEmail, organizationName } =
      snapshot.context;
    return {
      context: {
        requesterName: joinName(representativeFirstName, representativeLastName),
        requesterEmail: representativeEmail || "geen e-mail bekend",
        organizationName: organizationName || "Organisatie nog niet ingevuld",
      },
    };
  }, [snapshot.context]);

  const handleCancel = useCallback(() => navigate(WEGWIJZER_PATH), [navigate]);
  const handleBack = useCallback(() => {
    if (!serviceId) return;
    navigate(BUNDLE_ASSEMBLE_PATH(serviceId));
  }, [navigate, serviceId]);
  const handleContinue = useCallback(() => {
    navigate(REGISTRATION_COMPLETE_PATH, { replace: true });
  }, [navigate]);

  if (!serviceId || !service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }
  if (inquiries.length === 0) {
    return <Navigate to={BUNDLE_ASSEMBLE_PATH(serviceId)} replace />;
  }

  return (
    <TrajectLayout
      onSignInClick={() => navigate(SIGNIN_PATH)}
      footer={APP_FOOTER}
      bodyGap="section"
      kicker={service.entry.label}
      title="Controleer je aanvraagpakket"
      description="Bekijk de samengestelde conceptaanvragen en de bijhorende regelset-documenten voordat je doorgaat met registratie."
      actionBar={
        <TrajectStoryFooter
          onCancel={handleCancel}
          onBack={handleBack}
          onContinue={handleContinue}
          continueLabel="Bevestig en verzend"
        />
      }
    >
      <div className="flex flex-col gap-section">
        <RequestPackageReview
          className="max-w-5xl"
          title="Samenvatting van het aanvraagpakket"
          description="Controleer de inhoudelijke aanvragen en de organisatiecontext voordat je het pakket indient."
          requester={requester}
          rows={rows}
          notice={
            inquiries.length > 1 ? (
              <span>
                <Badge variant="secondary">{inquiries.length} vragen</Badge> worden samen
                gebundeld in deze aanvraag.
              </span>
            ) : undefined
          }
        />
        <section className="flex max-w-5xl flex-col gap-component">
          <div className="flex flex-col gap-micro">
            <h3 className="text-heading-sm font-semibold leading-tight tracking-tight">
              Regels en documentatie
            </h3>
            <p className="text-sm text-muted-foreground">
              Documenten op basis van je {inquiries.length} geselecteerde{" "}
              {inquiries.length === 1 ? "aanvraag" : "aanvragen"} (prototype, downloadlinks
              zijn gemockt).
            </p>
          </div>
          <DownloadableItemList items={documents} />
        </section>
      </div>
    </TrajectLayout>
  );
}
