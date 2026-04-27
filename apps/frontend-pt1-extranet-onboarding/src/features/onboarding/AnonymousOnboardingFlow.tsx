import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Textarea,
} from "@procertus-ui/ui";
import { DraftRequestList, RequestPackageReview } from "@procertus-ui/ui-certification";
import type { DraftRequestItem, RequestPackageRow } from "@procertus-ui/ui-certification";
import { OnboardingStepper, StepLayout } from "@procertus-ui/ui-lib";
import type { OnboardingStepperStep } from "@procertus-ui/ui-lib";
import { useMockPrototypeLogin } from "@procertus-ui/ui-pt1-prototype";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import {
  CertificationRequestWizard,
  type CertificationWizardDraft,
} from "../certification-wizard/CertificationRequestWizard";

const ONBOARDING_STEPS = [
  "request",
  "customer",
  "kyc",
  "profile",
  "summary",
  "activation",
] as const;

type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

type CustomerContext = {
  representativeName: string;
  representativeEmail: string;
  organizationName: string;
  country: string;
  vatNumber: string;
  address: string;
  kycNotes: string;
};

const DEFAULT_CONTEXT: CustomerContext = {
  representativeName: "Liam Chen",
  representativeEmail: "liam.chen@acme.example",
  organizationName: "Acme Packaging BV",
  country: "Belgium",
  vatNumber: "BE 0123.456.789",
  address: "Industrieweg 12, 2000 Antwerpen",
  kycNotes: "Belgische organisatie; standaard KYC-verklaring en vertegenwoordigersbevestiging vereist.",
};

const ONBOARDING_FLOW_STORAGE_KEY = "pt1:onboarding-flow-state";
const CERTIFICATION_REQUEST_STORAGE_KEY = "pt1:certification-request-store";
const ONBOARDING_CERTIFICATION_SESSION_ID = "pt1:onboarding:certification-request";

type AnonymousOnboardingFlowState = {
  step: OnboardingStep;
  drafts: CertificationWizardDraft[];
  context: CustomerContext;
  wizardInitialStep: "intent" | "drafts";
};

const DEFAULT_ONBOARDING_FLOW_STATE: AnonymousOnboardingFlowState = {
  step: "request",
  drafts: [],
  context: DEFAULT_CONTEXT,
  wizardInitialStep: "intent",
};

function stepIndex(step: OnboardingStep) {
  return ONBOARDING_STEPS.indexOf(step);
}

function draftItems(drafts: readonly CertificationWizardDraft[]): DraftRequestItem[] {
  return drafts.map((draft) => ({
    id: draft.id,
    title: draft.productLabel ? `${draft.label} voor ${draft.productLabel}` : draft.label,
    subtitle: draft.productPath ?? draft.context ?? "Contextaanvraag",
  }));
}

function buildRows(context: CustomerContext, drafts: readonly CertificationWizardDraft[]): RequestPackageRow[] {
  return [
    { id: "organization", label: "Organisatie", value: context.organizationName },
    { id: "representative", label: "Vertegenwoordiger", value: context.representativeName },
    { id: "email", label: "E-mail activatie", value: context.representativeEmail },
    { id: "country", label: "Herkomst", value: context.country },
    { id: "vat", label: "Ondernemingsnummer", value: context.vatNumber },
    ...drafts.map((draft, index) => ({
      id: draft.id,
      label: `Aanvraag ${index + 1}`,
      value: draft.productLabel ? `${draft.label} · ${draft.productLabel}` : draft.label,
    })),
  ];
}

function ContextField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: keyof CustomerContext;
  label: string;
  value: string;
  onChange: (id: keyof CustomerContext, value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(id, event.target.value)}
        />
      </FieldContent>
    </Field>
  );
}

export function AnonymousOnboardingFlow() {
  const navigate = useNavigate();
  const login = useMockPrototypeLogin();
  const [flowState, setFlowState] = useLocalStorageState(
    ONBOARDING_FLOW_STORAGE_KEY,
    DEFAULT_ONBOARDING_FLOW_STATE,
  );
  const { context, drafts, step, wizardInitialStep } = flowState;

  const activeStep = stepIndex(step);
  const hasDrafts = drafts.length > 0;
  const hasCustomerContext =
    context.representativeName.trim().length > 0 &&
    context.representativeEmail.trim().length > 0 &&
    context.organizationName.trim().length > 0;
  const hasKycContext = context.country.trim().length > 0;
  const steps: OnboardingStepperStep[] = useMemo(
    () => [
      {
        id: "request",
        title: "Aanvraag",
        description: drafts.length ? `${drafts.length} concepten` : "Start zonder account",
        available: true,
      },
      { id: "customer", title: "Organisatie", description: context.organizationName, available: hasDrafts },
      { id: "kyc", title: "KYC", description: context.country, available: hasDrafts && hasCustomerContext },
      {
        id: "profile",
        title: "Profiel",
        description: "Verrijkte gegevens",
        available: hasDrafts && hasCustomerContext && hasKycContext,
      },
      {
        id: "summary",
        title: "Indienen",
        description: "Pakket controleren",
        available: hasDrafts && hasCustomerContext && hasKycContext,
      },
      { id: "activation", title: "Activatie", description: "Account na indiening", available: step === "activation" },
    ],
    [context.country, context.organizationName, drafts.length, hasCustomerContext, hasDrafts, hasKycContext, step],
  );

  const updateContext = (id: keyof CustomerContext, value: string) => {
    setFlowState((prev) => ({ ...prev, context: { ...prev.context, [id]: value } }));
  };

  const goToOnboardingStep = (nextStep: OnboardingStep) => {
    const targetIndex = stepIndex(nextStep);
    if (steps[targetIndex]?.available === false) {
      return;
    }
    if (nextStep === "request") {
      setFlowState((prev) => ({
        ...prev,
        step: nextStep,
        wizardInitialStep: prev.drafts.length > 0 ? "drafts" : "intent",
      }));
      return;
    }
    setFlowState((prev) => ({ ...prev, step: nextStep }));
  };

  if (step === "request") {
    return (
      <div className="min-h-svh bg-background px-4 py-8">
        <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-4">
          <div>
            <Badge variant="secondary">Geen account nodig om te starten</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">Start je certificatieaanvraag</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Kies eerst wat je wilt aanvragen. We vragen pas organisatie- en accountgegevens wanneer je een
              conceptaanvraag hebt samengesteld.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => navigate("/welcome")}>
            Aanmelden
          </Button>
        </div>
        <CertificationRequestWizard
          mode="onboarding"
          initialDrafts={drafts}
          initialStep={wizardInitialStep}
          backendKind="localStorage"
          storageKey={CERTIFICATION_REQUEST_STORAGE_KEY}
          sessionId={ONBOARDING_CERTIFICATION_SESSION_ID}
          onCancel={() => navigate("/welcome")}
          onComplete={(nextDrafts) => {
            setFlowState((prev) => ({
              ...prev,
              drafts: nextDrafts,
              wizardInitialStep: "drafts",
              step: "customer",
            }));
          }}
        />
      </div>
    );
  }

  const primaryAction = {
    customer: {
      label: "Verder naar KYC",
      onClick: () => setFlowState((prev) => ({ ...prev, step: "kyc" })),
      disabled: !hasCustomerContext,
    },
    kyc: {
      label: "Profiel verrijken",
      onClick: () => setFlowState((prev) => ({ ...prev, step: "profile" })),
      disabled: !hasKycContext,
    },
    profile: {
      label: "Samenvatting bekijken",
      onClick: () => setFlowState((prev) => ({ ...prev, step: "summary" })),
    },
    summary: {
      label: "Mock indienen",
      onClick: () => setFlowState((prev) => ({ ...prev, step: "activation" })),
      disabled: !hasDrafts,
    },
    activation: {
      label: "Activeer en open portaal",
      onClick: () => {
        login("demo-liam");
        navigate("/app", { replace: true });
      },
    },
  }[step];

  return (
    <div className="min-h-svh bg-background px-4 py-8">
      <StepLayout
        className="max-w-5xl"
        variant="onboarding"
        stepper={
          <OnboardingStepper
            steps={steps}
            activeStep={activeStep}
            onStepChange={(index) => {
              const nextStep = ONBOARDING_STEPS[index];
              if (nextStep) {
                goToOnboardingStep(nextStep);
              }
            }}
            interactive
          />
        }
        title={
          step === "customer"
            ? "Wie dient dit pakket in?"
            : step === "kyc"
              ? "Herkomst en KYC-routing"
              : step === "profile"
                ? "Verrijkt klantprofiel"
                : step === "summary"
                  ? "Intake samenvatting"
                  : "Accountactivatie gestart"
        }
        description={
          step === "customer"
            ? "Nu de aanvraag inhoudelijk klopt, verzamelen we de minimale gegevens om de organisatie en vertegenwoordiger te identificeren."
            : step === "kyc"
              ? "De herkomst bepaalt welke KYC-verklaringen, controles en publieke databronnen in het echte portaal worden gebruikt."
              : step === "profile"
                ? "Deze prototypekaart simuleert publieke dataverrijking en toont welke gegevens de gebruiker nog kan corrigeren."
                : step === "summary"
                  ? "Controleer de klantcontext en de conceptaanvragen. In de echte flow worden ze samen als één intake ingediend."
                  : "Na indiening wordt het vertegenwoordigersaccount aangemaakt, gekoppeld aan de organisatie en via e-mail geactiveerd."
        }
        stepLabel={`Onboarding · stap ${activeStep + 1} van ${steps.length}`}
        backAction={{
          label: step === "customer" ? "Terug naar aanvraag" : "Terug",
          onClick: () => {
            const previous = ONBOARDING_STEPS[Math.max(0, activeStep - 1)];
            setFlowState((prev) => ({ ...prev, step: previous }));
          },
        }}
        secondaryAction={
          step === "summary"
            ? { label: "Aanvraagpakket wijzigen", onClick: () => goToOnboardingStep("request") }
            : undefined
        }
        primaryAction={primaryAction}
      >
        {step === "customer" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <ContextField id="representativeName" label="Naam vertegenwoordiger" value={context.representativeName} onChange={updateContext} />
            <ContextField id="representativeEmail" label="E-mailadres voor activatie" value={context.representativeEmail} onChange={updateContext} />
            <ContextField id="organizationName" label="Organisatie" value={context.organizationName} onChange={updateContext} />
            <ContextField id="vatNumber" label="Ondernemingsnummer" value={context.vatNumber} onChange={updateContext} />
            <div className="md:col-span-2">
              <ContextField id="address" label="Adres" value={context.address} onChange={updateContext} />
            </div>
          </div>
        ) : null}

        {step === "kyc" ? (
          <div className="space-y-4">
            <ContextField id="country" label="Land / regio van herkomst" value={context.country} onChange={updateContext} />
            <Field>
              <FieldLabel htmlFor="kycNotes">KYC-route</FieldLabel>
              <FieldContent>
                <Textarea
                  id="kycNotes"
                  value={context.kycNotes}
                  onChange={(event) => updateContext("kycNotes", event.target.value)}
                  className="min-h-28"
                />
              </FieldContent>
            </Field>
          </div>
        ) : null}

        {step === "profile" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Publieke data</CardTitle>
                <CardDescription>Gesimuleerd resultaat van bedrijfsdataverrijking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-medium">Organisatie:</span> {context.organizationName}</p>
                <p><span className="font-medium">Adres:</span> {context.address}</p>
                <p><span className="font-medium">Status:</span> actief, gegevens verifieerbaar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Te bevestigen</CardTitle>
                <CardDescription>In de echte flow kan de gebruiker discrepanties oplossen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Vertegenwoordigingsbevoegdheid bevestigen.</p>
                <p>Contactpersoon voor technische opvolging toevoegen.</p>
                <p>KYC-verklaring ondertekenen na finale indiening.</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {step === "summary" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <RequestPackageReview
              title="Coordinated intake"
              description="Klantcontext, validatiecontext en aanvraagset worden samen ingediend."
              rows={buildRows(context, drafts)}
            />
            <DraftRequestList
              title="Aanvragen"
              drafts={draftItems(drafts)}
              onEdit={() => goToOnboardingStep("request")}
              onRemove={(id) =>
                setFlowState((prev) => ({
                  ...prev,
                  drafts: prev.drafts.filter((draft) => draft.id !== id),
                }))
              }
            />
          </div>
        ) : null}

        {step === "activation" ? (
          <Card>
            <CardHeader>
              <CardTitle>Activatiemail verzonden</CardTitle>
              <CardDescription>
                Het account voor {context.representativeEmail} is pas nu aangemaakt en gekoppeld aan{" "}
                {context.organizationName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Prototype: de knop hieronder simuleert e-mailactivatie en opent de aangemelde request-management omgeving.</p>
              <p>Na activatie ziet de gebruiker dezelfde aanvraagwizard opnieuw via “Nieuwe aanvraag”.</p>
            </CardContent>
          </Card>
        ) : null}
      </StepLayout>
    </div>
  );
}
