import { HugeiconsIcon } from "@hugeicons/react";
import type { CustomerContext } from "@procertus-ui/ui-certification";
import { ONBOARDING_FLOW_STORAGE_KEY } from "@procertus-ui/ui-certification";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  H1,
  iconStroke,
  Input,
} from "@procertus-ui/ui";
import { OnboardingStepper, PageHeader, StepLayout, useStepLayout, type OnboardingStepperStep } from "@procertus-ui/ui-lib";
import {
  formatPrototypePostalAddressLine,
  getPrototypeOrganizationProfile,
  type PrototypeOrganizationProfile,
  useMockPrototypeResolveOrganizationProfile,
  useMockPrototypeSession,
} from "@procertus-ui/ui-pt1-prototype";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ProfileChangeRequestOverviewCard } from "../components/profile-change-requests/ProfileChangeRequestOverviewCard";
import { flattenStringRecord, hasAnyDiff } from "../features/profile-change-requests/flatten";
import { buildOrganizationProfileChangeBaseline } from "../features/profile-change-requests/organization-profile-baseline";
import {
  companySlice,
  referenceSliceFromProfile,
  type OrgProfileChangeForm,
} from "../features/profile-change-requests/org-profile-change";
import { findPendingProfileChangeRequestForOrganization } from "../features/profile-change-requests/profile-change-request-queries";
import type { ProfileChangeRequest } from "../features/profile-change-requests/types";
import { useProfileChangeRequests } from "../features/profile-change-requests/use-profile-change-requests";
import { customerContextsEqual, readStoredOnboardingContexts } from "../features/profile/readStoredOnboardingContext";
import { resolveOrgDemoAddress } from "../features/profile/prototypeOrgDemoAddresses";
import { mockOrganizationAddress } from "./dashboard-mock-data";
import { PROFILE_CHANGE_DETAIL_PANEL_TYPE, useAppPanels } from "../panels";
import { PROTOTYPE_PRIMARY_NAV } from "../navConfig";
import { DataRow } from "./profile/DataRow";
import { ProfileTableField } from "./profile/ProfileTableField";

const orgNav = PROTOTYPE_PRIMARY_NAV.find((item) => item.key === "organization-profile")!;

const ORG_EDIT_STEPS: OnboardingStepperStep[] = [
  { id: "workspace", title: "Werkruimte" },
  { id: "company", title: "Bedrijf" },
  { id: "reference", title: "Aanvullend" },
];

function orgDash(v: string | undefined): string {
  return v != null && v.trim() !== "" ? v : "—";
}

function OrganizationDatasetSummaryRows({
  profile,
  pendingChange,
}: {
  profile: PrototypeOrganizationProfile;
  pendingChange?: ProfileChangeRequest;
}) {
  const corr = profile.correspondenceAddress;
  return (
    <>
      <ProfileTableField label="Handelsnaam (dataset)" fieldKey="tradeName" value={profile.tradeName} pendingChange={pendingChange} />
      <ProfileTableField label="Statutaire naam" fieldKey="legalName" value={profile.legalName} pendingChange={pendingChange} />
      <ProfileTableField label="BTW-nummer" fieldKey="vatNumber" value={profile.vatNumber} pendingChange={pendingChange} />
      <ProfileTableField
        label="Ondernemingsnummer"
        fieldKey="enterpriseNumber"
        value={orgDash(profile.enterpriseNumber)}
        pendingChange={pendingChange}
      />
      <ProfileTableField label="Primair e-mailadres" fieldKey="primaryEmail" value={profile.primaryEmail} pendingChange={pendingChange} />
      <ProfileTableField label="Telefoon" fieldKey="primaryPhone" value={orgDash(profile.primaryPhone)} pendingChange={pendingChange} />
      <ProfileTableField label="Website" fieldKey="websiteUrl" value={orgDash(profile.websiteUrl)} pendingChange={pendingChange} />
      <DataRow label="Geregistreerd adres" value={formatPrototypePostalAddressLine(profile.registeredAddress)} />
      <DataRow
        label="Correspondentieadres"
        value={corr ? formatPrototypePostalAddressLine(corr) : "—"}
      />
      <ProfileTableField label="Sector" fieldKey="industrySector" value={orgDash(profile.industrySector)} pendingChange={pendingChange} />
      <ProfileTableField
        label="Medewerkers (ca.)"
        fieldKey="employeeCountApprox"
        value={profile.employeeCountApprox !== undefined ? String(profile.employeeCountApprox) : "—"}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Oprichtingsjaar"
        fieldKey="foundedYear"
        value={profile.foundedYear !== undefined ? String(profile.foundedYear) : "—"}
        pendingChange={pendingChange}
      />
    </>
  );
}

function formatCustomerAddressLine(c: CustomerContext): string {
  const line1 = `${c.addressStreet} ${c.addressHouseNumber}`.trim();
  const line2 = [c.addressPostalCode, c.addressCity].filter((p) => p.trim().length > 0).join(" ");
  const parts = [line1, line2, c.country].filter((p) => p.trim().length > 0);
  return parts.length > 0 ? parts.join(", ") : "—";
}

function OnboardingCompanyRows({
  context,
  pendingChange,
}: {
  context: CustomerContext;
  pendingChange?: ProfileChangeRequest;
}) {
  return (
    <>
      <ProfileTableField label="Bedrijfsnaam" fieldKey="organizationName" value={context.organizationName} pendingChange={pendingChange} />
      <ProfileTableField label="BTW-nummer" fieldKey="vatNumber" value={context.vatNumber} pendingChange={pendingChange} />
      <ProfileTableField label="Land (herkomst)" fieldKey="country" value={context.country} pendingChange={pendingChange} />
      <DataRow label="Adres (samengevoegd)" value={formatCustomerAddressLine(context)} />
      <ProfileTableField label="Straat" fieldKey="addressStreet" value={context.addressStreet} pendingChange={pendingChange} />
      <ProfileTableField label="Huisnummer" fieldKey="addressHouseNumber" value={context.addressHouseNumber} pendingChange={pendingChange} />
      <ProfileTableField label="Postcode" fieldKey="addressPostalCode" value={context.addressPostalCode} pendingChange={pendingChange} />
      <ProfileTableField label="Plaats" fieldKey="addressCity" value={context.addressCity} pendingChange={pendingChange} />
    </>
  );
}

export function OrganizationProfilePage() {
  const session = useMockPrototypeSession();
  const active = session?.activeOrganization;
  const user = session?.user;
  const { openPanel } = useAppPanels();
  const resolveOrganizationProfile = useMockPrototypeResolveOrganizationProfile();
  const [storedTick, setStoredTick] = useState(0);
  const stored = useMemo(() => {
    void storedTick;
    return readStoredOnboardingContexts();
  }, [storedTick]);

  const orgProfile = useMemo(
    () => (active ? resolveOrganizationProfile(active.id) : undefined),
    [active, resolveOrganizationProfile],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<OrgProfileChangeForm | null>(null);

  const { requests, createRequest } = useProfileChangeRequests();

  const pendingOrgChange = useMemo(
    () => (active ? findPendingProfileChangeRequestForOrganization(requests, active.id) : undefined),
    [requests, active],
  );

  const openPendingChangePanel = useCallback(
    (requestId: string) => {
      openPanel(PROFILE_CHANGE_DETAIL_PANEL_TYPE, { requestId });
    },
    [openPanel],
  );

  const prevPendingOrgId = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = pendingOrgChange?.id;
    if (prevPendingOrgId.current !== undefined && id === undefined) {
      setStoredTick((n) => n + 1);
    }
    prevPendingOrgId.current = id;
  }, [pendingOrgChange?.id]);

  const activeAddress = active
    ? resolveOrgDemoAddress(active.id, mockOrganizationAddress(active.id))
    : null;

  const flow = useStepLayout({
    totalSteps: ORG_EDIT_STEPS.length,
    canAdvanceFrom: () => true,
  });
  const { activeStep, totalSteps, isLast, canGoBack, goBack, goForward, goToStep } = flow;

  const openOrganizationEdit = useCallback(() => {
    if (!active) return;
    const storedNow = readStoredOnboardingContexts();
    const snap = storedNow.flowContext ?? storedNow.completedSnapshotContext ?? {};
    const merged = resolveOrganizationProfile(active.id);
    const base = getPrototypeOrganizationProfile(active.id);
    const ref = merged ?? base;
    setForm({
      orgName: active.name,
      demoAddress: resolveOrgDemoAddress(active.id, mockOrganizationAddress(active.id)),
      ...companySlice(snap),
      ...referenceSliceFromProfile(ref),
    });
    goToStep(0);
    setEditOpen(true);
  }, [active, resolveOrganizationProfile, goToStep]);

  const headerIcon = (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
      <HugeiconsIcon icon={orgNav.icon} size={22} strokeWidth={iconStroke(22)} />
    </div>
  );

  const organizationTitle = active?.name.trim() || "Organisatie";

  const submitChangeRequest = useCallback(() => {
    if (!session || !active || !form) return;
    const storedNow = readStoredOnboardingContexts();
    const demoLine = resolveOrgDemoAddress(active.id, mockOrganizationAddress(active.id));
    const baseline = buildOrganizationProfileChangeBaseline(
      session,
      storedNow,
      resolveOrganizationProfile,
      demoLine,
    );
    const proposed = flattenStringRecord(form as unknown as Record<string, unknown>);
    if (!hasAnyDiff(baseline, proposed)) {
      window.alert("Geen wijzigingen om in te dienen.");
      return;
    }
    const created = createRequest({
      kind: "organization",
      subjectOrganizationId: active.id,
      title: `Organisatieprofiel — ${active.name}`,
      baseline,
      proposed,
    });
    if (!created.ok) {
      window.alert(created.reason);
      return;
    }
    setEditOpen(false);
  }, [session, active, form, createRequest, resolveOrganizationProfile]);

  const stepTitle =
    activeStep === 0 ? "Werkruimte" : activeStep === 1 ? "Bedrijf" : "Aanvullende gegevens";

  const stepDescription =
    activeStep === 0
      ? "Weergavenaam en adresregel voor overzichten."
      : activeStep === 1
        ? "Minimale bedrijfsgegevens zoals tijdens registratie (ook als de flow die destijds oversloeg)."
        : "Optionele velden: contact, adressen, sector en omvang.";

  return (
    <div className="flex w-full max-w-[1400px] flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8">
      <PageHeader
        icon={headerIcon}
        kicker="Hoofdorganisatie"
        title={<H1 className="text-balance">{organizationTitle}</H1>}
        description="Deze organisatie: identiteit, adres en registratie- of onboardingsvelden waar van toepassing."
        actions={
          active ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={openOrganizationEdit}
              disabled={Boolean(pendingOrgChange)}
                title={
                  pendingOrgChange
                    ? "Er loopt al een profielwijziging voor deze organisatie. Bekijk of trek ze in via de kaart hieronder."
                    : undefined
                }
            >
              Gegevens bewerken
            </Button>
          ) : null
        }
      />

      {pendingOrgChange ? (
        <div className="max-w-xl flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Openstaande wijziging — open de kaart voor details, tijdlijn en conversatie.
          </p>
          <ProfileChangeRequestOverviewCard request={pendingOrgChange} onOpen={openPendingChangePanel} />
        </div>
      ) : null}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="flex max-h-[min(92vh,820px)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-2 border-b border-border px-6 pb-4 pt-6">
            <DialogTitle>Organisatie bewerken</DialogTitle>
            <DialogDescription>
              U bereidt een wijzigingsdocument voor. Niets wijzigt direct: na indiening volgt validatie en acceptatie
              (zoals bij certificatieaanvragen). Pas na acceptatie worden uw organisatiegegevens bijgewerkt.
            </DialogDescription>
          </DialogHeader>
          {form && active ? (
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                if (isLast) submitChangeRequest();
              }}
            >
              <StepLayout
                className="min-h-[min(60vh,520px)] flex-1 rounded-none border-0 shadow-none"
                variant="wizard"
                layout="fill-parent"
                flush
                stepKey={activeStep}
                stepper={
                  <OnboardingStepper
                    orientation="horizontal"
                    steps={ORG_EDIT_STEPS}
                    activeStep={activeStep}
                  />
                }
                stepperPosition="top"
                title={stepTitle}
                description={stepDescription}
                stepLabel={`Stap ${activeStep + 1} van ${totalSteps}`}
                cancelAction={{
                  label: "Annuleren",
                  onClick: () => setEditOpen(false),
                }}
                backAction={{
                  label: "Vorige",
                  onClick: goBack,
                  disabled: !canGoBack,
                }}
                primaryAction={{
                  label: isLast ? "Wijzigingsdocument indienen" : "Volgende",
                  onClick: () => {
                    if (isLast) submitChangeRequest();
                    else goForward();
                  },
                }}
              >
                {activeStep === 0 ? (
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel>Organisatie-id</FieldLabel>
                      <FieldContent>
                        <Input value={active.id} readOnly className="bg-muted/50" />
                        <FieldDescription>Alleen ter referentie; niet bewerkbaar.</FieldDescription>
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Naam (sessie)</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.orgName}
                          onChange={(ev) => setForm((f) => (f ? { ...f, orgName: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Weergave-adres</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.demoAddress}
                          onChange={(ev) => setForm((f) => (f ? { ...f, demoAddress: ev.target.value } : f))}
                        />
                        <FieldDescription>Één regel voor overzichten en widgets.</FieldDescription>
                      </FieldContent>
                    </Field>
                  </div>
                ) : null}

                {activeStep === 1 ? (
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel>Bedrijfsnaam</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.organizationName}
                          onChange={(ev) =>
                            setForm((f) => (f ? { ...f, organizationName: ev.target.value } : f))
                          }
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>BTW-nummer</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.vatNumber}
                            onChange={(ev) => setForm((f) => (f ? { ...f, vatNumber: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Land</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.country}
                            onChange={(ev) => setForm((f) => (f ? { ...f, country: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Straat</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.addressStreet}
                            onChange={(ev) => setForm((f) => (f ? { ...f, addressStreet: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Huisnummer</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.addressHouseNumber}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, addressHouseNumber: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Postcode</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.addressPostalCode}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, addressPostalCode: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Plaats</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.addressCity}
                            onChange={(ev) => setForm((f) => (f ? { ...f, addressCity: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeStep === 2 ? (
                  <div className="grid gap-4">
                    <p className="text-sm text-muted-foreground">
                      Deze velden stonden niet in de minimale onboarding; vul ze aan voor een vollediger bedrijfsprofiel.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Handelsnaam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.tradeName}
                            onChange={(ev) => setForm((f) => (f ? { ...f, tradeName: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Statutaire naam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.legalName}
                            onChange={(ev) => setForm((f) => (f ? { ...f, legalName: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Ondernemingsnummer</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.enterpriseNumber}
                          onChange={(ev) =>
                            setForm((f) => (f ? { ...f, enterpriseNumber: ev.target.value } : f))
                          }
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Primair e-mailadres</FieldLabel>
                        <FieldContent>
                          <Input
                            type="email"
                            value={form.primaryEmail}
                            onChange={(ev) => setForm((f) => (f ? { ...f, primaryEmail: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Telefoon</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.primaryPhone}
                            onChange={(ev) => setForm((f) => (f ? { ...f, primaryPhone: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Website</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.websiteUrl}
                          onChange={(ev) => setForm((f) => (f ? { ...f, websiteUrl: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Sector</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.industrySector}
                          onChange={(ev) => setForm((f) => (f ? { ...f, industrySector: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Medewerkers (ca.)</FieldLabel>
                        <FieldContent>
                          <Input
                            inputMode="numeric"
                            value={form.employeeCountApprox}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, employeeCountApprox: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Oprichtingsjaar</FieldLabel>
                        <FieldContent>
                          <Input
                            inputMode="numeric"
                            value={form.foundedYear}
                            onChange={(ev) => setForm((f) => (f ? { ...f, foundedYear: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Geregistreerd adres
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Straat</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.regStreet}
                            onChange={(ev) => setForm((f) => (f ? { ...f, regStreet: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Huisnummer</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.regHouse}
                            onChange={(ev) => setForm((f) => (f ? { ...f, regHouse: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Postcode</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.regPostal}
                            onChange={(ev) => setForm((f) => (f ? { ...f, regPostal: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Plaats</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.regCity}
                            onChange={(ev) => setForm((f) => (f ? { ...f, regCity: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Landcode (ISO)</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.regCountry}
                          onChange={(ev) => setForm((f) => (f ? { ...f, regCountry: ev.target.value } : f))}
                        />
                        <FieldDescription>Bijv. BE, NL.</FieldDescription>
                      </FieldContent>
                    </Field>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Correspondentieadres
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Straat</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.corrStreet}
                            onChange={(ev) => setForm((f) => (f ? { ...f, corrStreet: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Huisnummer</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.corrHouse}
                            onChange={(ev) => setForm((f) => (f ? { ...f, corrHouse: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Postcode</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.corrPostal}
                            onChange={(ev) => setForm((f) => (f ? { ...f, corrPostal: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Plaats</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.corrCity}
                            onChange={(ev) => setForm((f) => (f ? { ...f, corrCity: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Landcode (ISO)</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.corrCountry}
                          onChange={(ev) => setForm((f) => (f ? { ...f, corrCountry: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                  </div>
                ) : null}
              </StepLayout>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bedrijf (onboarding & registratie)</CardTitle>
          <CardDescription>
            Bedrijfsgegevens uit onboarding en registratie: BTW-nummer, land en adres (samengevoegd en per veld), plus
            de vastgelegde snapshot na voltooide registratie.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {stored.flowContext || stored.completedSnapshotContext ? (
            <>
              {stored.flowContext ? (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Laatste flow-state ({ONBOARDING_FLOW_STORAGE_KEY})
                  </p>
                  <OnboardingCompanyRows context={stored.flowContext} pendingChange={pendingOrgChange} />
                </>
              ) : null}
              {stored.completedSnapshotContext &&
              (!stored.flowContext ||
                !customerContextsEqual(stored.flowContext, stored.completedSnapshotContext)) ? (
                <>
                  <p
                    className={
                      stored.flowContext
                        ? "mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        : "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    }
                  >
                    Snapshot bij registratie voltooid
                  </p>
                  <OnboardingCompanyRows context={stored.completedSnapshotContext} pendingChange={pendingOrgChange} />
                </>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nog geen bedrijfsgegevens uit onboarding of registratie. Start of voltooi de flow op{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/welcome/start</code> om BTW, land en adres hier te
              zien.
            </p>
          )}
        </CardContent>
      </Card>

      {active ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actieve organisatie</CardTitle>
            <CardDescription>
              Weergavenaam, adresregel voor overzichten en aanvullende referentievelden.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <ProfileTableField label="Naam" fieldKey="orgName" value={active.name} pendingChange={pendingOrgChange} />
            <DataRow label="Id" value={active.id} />
            <ProfileTableField
              label="Weergave-adres"
              fieldKey="demoAddress"
              value={activeAddress ?? "—"}
              pendingChange={pendingOrgChange}
            />
            {orgProfile ? <OrganizationDatasetSummaryRows profile={orgProfile} pendingChange={pendingOrgChange} /> : null}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">Geen actieve organisatie in de sessie.</CardContent>
        </Card>
      )}

      {user ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Context uit uw account</CardTitle>
            <CardDescription>Thuisorganisatie en organisatie die u vertegenwoordigt.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <DataRow label="Thuisorganisatie" value={`${user.homeOrganization.name} (${user.homeOrganization.id})`} />
            <DataRow
              label="Vertegenwoordigde organisatie"
              value={`${user.representedOrganization.name} (${user.representedOrganization.id})`}
            />
          </CardContent>
        </Card>
      ) : null}

      {session?.organizations?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Beschikbare organisaties</CardTitle>
            <CardDescription>Organisaties gekoppeld aan uw account; de actieve staat gemarkeerd.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {session.organizations.map((org) => (
              <DataRow
                key={org.id}
                label={org.id === session.activeOrganization.id ? `${org.name} (actief)` : org.name}
                value={org.id}
              />
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
