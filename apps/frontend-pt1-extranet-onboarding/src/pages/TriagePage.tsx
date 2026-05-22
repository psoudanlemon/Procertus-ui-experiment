import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Call02Icon, FilePlusIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { DecisionCard, DecisionCardCallout } from "@procertus-ui/ui-lib";
import {
  TrajectPageFrame,
  TrajectStoryFooter,
  useOnboardingFlowApi,
} from "@procertus-ui/ui-certification";
import { FORMAL_ONBOARDING_PATH } from "../routes/formal-request-routing";
import { useSyncOnboardingTrajectFromServiceId } from "../features/onboarding/use-sync-onboarding-traject-from-service-id";
import { findWegwijzerService } from "../features/wegwijzer/wegwijzer-services";
import { TRAJECT_ENTRY_POINT_QUERY_PARAM } from "../features/traject/traject-submission-context";

const WEGWIJZER_PATH = "/welcome";
/**
 * Informatieve aanvraag krijgt een eigen route (`/welcome/info-request/:serviceId`). De `from=triage`
 * query stempelt de submissie zodat PROCERTUS weet dat de aanvrager al via de keuze gepasseerd is.
 */
const INFORMATIONAL_REQUEST_PATH = (serviceId: string) =>
  `/welcome/info-request/${serviceId}?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=triage`;
const EXPERT_CALL_PATH = (serviceId: string) =>
  `/welcome/expert-call/${serviceId}?${TRAJECT_ENTRY_POINT_QUERY_PARAM}=triage`;

export function TriagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams<{ serviceId: string }>();
  const api = useOnboardingFlowApi();
  useSyncOnboardingTrajectFromServiceId(serviceId);
  const service = findWegwijzerService(serviceId);

  if (!service) {
    return <Navigate to={WEGWIJZER_PATH} replace />;
  }

  const { entry } = service;

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(`${WEGWIJZER_PATH}?service=${entry.id}`);
    }
  };

  return (
    <TrajectPageFrame
      kicker={"maak je keuze"}
      title="Wil je meer informatie of meteen je traject opstarten?"
      description="Vraag eerst vrijblijvend advies en een prijsopgave, of start meteen het formele dossier zodat de ontvankelijkheidsbeoordeling kan beginnen."
      bodyGap="section"
      actionBar={
        <TrajectStoryFooter
          mode="decision"
          onCancel={() => navigate(`${WEGWIJZER_PATH}?service=${entry.id}`)}
          onBack={handleBack}
        />
      }
    >
      <div className="flex flex-col gap-region">
        <div className="grid grid-cols-1 gap-region md:grid-cols-2">
          <DecisionCard
            variant="faded"
            icon={Mail01Icon}
            title="Aanvraag meer informatie"
            description="Voor wie eerst wil afstemmen."
            bullets={[
              "Geen verplichting om op te starten",
              "Antwoord binnen enkele werkdagen",
              "Live sessie met een expert mogelijk",
            ]}
            cta={{
              label: "Vrijblijvende aanvraag",
              asChild: true,
              children: (
                <Link
                  to={INFORMATIONAL_REQUEST_PATH(entry.id)}
                  onClick={() => api.resetFormalRequestPackageCommit()}
                />
              ),
            }}
          />
          <DecisionCard
            variant="elevated"
            icon={FilePlusIcon}
            title="Traject opstarten"
            description="Voor wie klaar is om in te dienen."
            bullets={[
              "Je hebt voldoende informatie over het traject",
              "Je hebt je bedrijfsgegevens bij de hand",
              "Je wil nu indienen",
              "De ontvankelijkheidsbeoordeling start meteen",
              "PROCERTUS volgt je dossier actief op",
              "Je account wordt aangemaakt bij indiening",
            ]}
            cta={{
              label: "Start traject",
              asChild: true,
              children: (
                <Link
                  to={FORMAL_ONBOARDING_PATH}
                  onClick={() => api.commitFormalRequestPackageFromTriage()}
                />
              ),
            }}
          />
        </div>

        <DecisionCardCallout
          title="Wil je eerst een expert spreken?"
          description="Reserveer een live online sessie van één uur en overloop de vereisten samen met een PROCERTUS-expert."
          cta={{
            label: "Plan een gesprek",
            icon: Call02Icon,
            asChild: true,
            children: (
              <Link
                to={EXPERT_CALL_PATH(entry.id)}
                onClick={() => api.resetFormalRequestPackageCommit()}
              />
            ),
          }}
        />
      </div>
    </TrajectPageFrame>
  );
}
