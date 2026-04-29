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
  PageHeader,
} from "@procertus-ui/ui";
import { OnboardingStepper, StepLayout, useStepLayout, type OnboardingStepperStep } from "@procertus-ui/ui-lib";
import {
  type MockPrototypeUser,
  type PrototypeUserProfile,
  useMockPrototypeSession,
} from "@procertus-ui/ui-pt1-prototype";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ProfileChangeRequestOverviewCard } from "../components/profile-change-requests/ProfileChangeRequestOverviewCard";
import { flattenStringRecord, hasAnyDiff } from "../features/profile-change-requests/flatten";
import { findPendingProfileChangeRequestForUser } from "../features/profile-change-requests/profile-change-request-queries";
import type { ProfileChangeRequest } from "../features/profile-change-requests/types";
import { useProfileChangeRequests } from "../features/profile-change-requests/use-profile-change-requests";
import { buildUserProfileChangeBaseline } from "../features/profile-change-requests/user-profile-baseline";
import { customerContextsEqual, readStoredOnboardingContexts } from "../features/profile/readStoredOnboardingContext";
import { PROFILE_CHANGE_DETAIL_PANEL_TYPE, useAppPanels } from "../panels";
import { PROTOTYPE_PRIMARY_NAV } from "../navConfig";
import { DataRow } from "./profile/DataRow";
import { ProfileTableField } from "./profile/ProfileTableField";

const userNav = PROTOTYPE_PRIMARY_NAV.find((item) => item.key === "user-profile")!;

const USER_EDIT_STEPS: OnboardingStepperStep[] = [
  { id: "identity", title: "Identiteit" },
  { id: "contact", title: "Contact & werk" },
  { id: "orgs", title: "Organisaties" },
  { id: "representative", title: "Vertegenwoordiger" },
];

type OnboardingFormFields = ReturnType<typeof onboardingSlice>;

type UserEditForm = Omit<PrototypeUserProfile, "id"> & {
  homeOrgName: string;
  reprOrgName: string;
} & OnboardingFormFields;

function onboardingSlice(ctx: Partial<CustomerContext> | null | undefined) {
  return {
    representativeFirstName: ctx?.representativeFirstName ?? "",
    representativeLastName: ctx?.representativeLastName ?? "",
    representativeTitlePreset: ctx?.representativeTitlePreset ?? "",
    representativeTitle: ctx?.representativeTitle ?? "",
    representativeEmail: ctx?.representativeEmail ?? "",
    representativeRolePreset: ctx?.representativeRolePreset ?? "",
    representativeRole: ctx?.representativeRole ?? "",
  };
}

function resolveProfilePageTitle(
  user: MockPrototypeUser | undefined,
  stored: ReturnType<typeof readStoredOnboardingContexts>,
): string {
  if (user) {
    const fromParts = `${user.givenName} ${user.familyName}`.trim();
    if (fromParts.length > 0) return fromParts;
    const d = user.displayName.trim();
    if (d.length > 0) return d;
  }
  const ctx = stored.flowContext ?? stored.completedSnapshotContext;
  const composed = [ctx?.representativeFirstName, ctx?.representativeLastName].filter(Boolean).join(" ").trim();
  if (composed.length > 0) return composed;
  return "Profiel";
}

function dash(v: string | undefined): string {
  return v != null && v.trim() !== "" ? v : "—";
}

function UserSessionProfileRows({
  user,
  pendingChange,
}: {
  user: MockPrototypeUser;
  pendingChange?: ProfileChangeRequest;
}) {
  return (
    <>
      <DataRow label="Gebruikers-id" value={user.id} />
      <ProfileTableField label="Weergavenaam" fieldKey="displayName" value={user.displayName} pendingChange={pendingChange} />
      <ProfileTableField label="Voornaam" fieldKey="givenName" value={user.givenName} pendingChange={pendingChange} />
      <ProfileTableField label="Achternaam" fieldKey="familyName" value={user.familyName} pendingChange={pendingChange} />
      <ProfileTableField label="E-mail" fieldKey="email" value={user.email} pendingChange={pendingChange} />
      <ProfileTableField label="Werk-e-mail" fieldKey="workEmail" value={dash(user.workEmail)} pendingChange={pendingChange} />
      <ProfileTableField label="Telefoon" fieldKey="phone" value={dash(user.phone)} pendingChange={pendingChange} />
      <ProfileTableField label="Mobiel" fieldKey="mobilePhone" value={dash(user.mobilePhone)} pendingChange={pendingChange} />
      <ProfileTableField label="Functietitel" fieldKey="jobTitle" value={dash(user.jobTitle)} pendingChange={pendingChange} />
      <ProfileTableField label="Afdeling" fieldKey="department" value={dash(user.department)} pendingChange={pendingChange} />
      <ProfileTableField label="Locale" fieldKey="locale" value={dash(user.locale)} pendingChange={pendingChange} />
      <ProfileTableField label="Tijdzone" fieldKey="timeZone" value={dash(user.timeZone)} pendingChange={pendingChange} />
      <ProfileTableField
        label="Voorkeurstaal"
        fieldKey="preferredLanguage"
        value={dash(user.preferredLanguage)}
        pendingChange={pendingChange}
      />
      <ProfileTableField label="Aanhef" fieldKey="salutation" value={dash(user.salutation)} pendingChange={pendingChange} />
      <ProfileTableField
        label="Personeelsreferentie"
        fieldKey="employeeReference"
        value={dash(user.employeeReference)}
        pendingChange={pendingChange}
      />
      <ProfileTableField label="Rol" fieldKey="role" value={dash(user.role)} pendingChange={pendingChange} />
      <ProfileTableField label="Notities" fieldKey="notes" value={dash(user.notes)} pendingChange={pendingChange} />
      <ProfileTableField
        label="Thuisorganisatie"
        fieldKey="homeOrgName"
        value={`${user.homeOrganization.name} (${user.homeOrganization.id})`}
        pendingChange={pendingChange}
        proposedSuffix={` (${user.homeOrganization.id})`}
      />
      <ProfileTableField
        label="Vertegenwoordigde organisatie"
        fieldKey="reprOrgName"
        value={`${user.representedOrganization.name} (${user.representedOrganization.id})`}
        pendingChange={pendingChange}
        proposedSuffix={` (${user.representedOrganization.id})`}
      />
    </>
  );
}

function OnboardingPersonRows({
  context,
  pendingChange,
}: {
  context: CustomerContext;
  pendingChange?: ProfileChangeRequest;
}) {
  return (
    <>
      <ProfileTableField
        label="Voornaam"
        fieldKey="representativeFirstName"
        value={context.representativeFirstName}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Achternaam"
        fieldKey="representativeLastName"
        value={context.representativeLastName}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Aanhef (preset-id)"
        fieldKey="representativeTitlePreset"
        value={context.representativeTitlePreset}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Aanhef (tekst)"
        fieldKey="representativeTitle"
        value={context.representativeTitle}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="E-mail"
        fieldKey="representativeEmail"
        value={context.representativeEmail}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Functie (preset-id)"
        fieldKey="representativeRolePreset"
        value={context.representativeRolePreset}
        pendingChange={pendingChange}
      />
      <ProfileTableField
        label="Functie (label)"
        fieldKey="representativeRole"
        value={context.representativeRole}
        pendingChange={pendingChange}
      />
    </>
  );
}

export function UserProfilePage() {
  const session = useMockPrototypeSession();
  const user = session?.user;
  const { openPanel } = useAppPanels();
  const { requests, createRequest } = useProfileChangeRequests();
  const [storedTick, setStoredTick] = useState(0);
  const stored = useMemo(() => readStoredOnboardingContexts(), [storedTick]);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UserEditForm | null>(null);

  const pendingUserChange = useMemo(
    () => (user ? findPendingProfileChangeRequestForUser(requests, user.id) : undefined),
    [requests, user],
  );

  const openPendingChangePanel = useCallback(
    (requestId: string) => {
      openPanel(PROFILE_CHANGE_DETAIL_PANEL_TYPE, { requestId });
    },
    [openPanel],
  );

  const prevPendingId = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = pendingUserChange?.id;
    if (prevPendingId.current !== undefined && id === undefined) {
      setStoredTick((n) => n + 1);
    }
    prevPendingId.current = id;
  }, [pendingUserChange?.id]);

  const flow = useStepLayout({
    totalSteps: USER_EDIT_STEPS.length,
    canAdvanceFrom: () => true,
  });
  const { activeStep, totalSteps, isLast, canGoBack, goBack, goForward, goToStep } = flow;

  const openUserEdit = useCallback(() => {
    if (!user) return;
    const storedNow = readStoredOnboardingContexts();
    const flowCtx = storedNow.flowContext ?? storedNow.completedSnapshotContext ?? {};
    const { id, homeOrganization, representedOrganization, organizations, ...profile } = user;
    void id;
    void organizations;
    setForm({
      ...profile,
      role: profile.role ?? "",
      homeOrgName: homeOrganization.name,
      reprOrgName: representedOrganization.name,
      ...onboardingSlice(flowCtx),
    });
    goToStep(0);
    setEditOpen(true);
  }, [user, goToStep]);

  const headerIcon = (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
      <HugeiconsIcon icon={userNav.icon} size={22} strokeWidth={iconStroke(22)} />
    </div>
  );

  const profileTitle = resolveProfilePageTitle(user, stored);

  const submitChangeRequest = useCallback(() => {
    if (!user || !form) return;
    const baseline = buildUserProfileChangeBaseline(user, readStoredOnboardingContexts());
    const proposed = flattenStringRecord(form as unknown as Record<string, unknown>);
    if (!hasAnyDiff(baseline, proposed)) {
      window.alert("Geen wijzigingen om in te dienen.");
      return;
    }
    const created = createRequest({
      kind: "user",
      subjectUserId: user.id,
      title: `Gebruikersprofiel — ${user.displayName || user.email}`,
      baseline,
      proposed,
    });
    if (!created.ok) {
      window.alert(created.reason);
      return;
    }
    setEditOpen(false);
  }, [user, form, createRequest]);

  const stepTitle =
    activeStep === 0
      ? "Identiteit"
      : activeStep === 1
        ? "Contact en werkcontext"
        : activeStep === 2
          ? "Organisatienamen"
          : "Vertegenwoordiger (onboarding)";

  const stepDescription =
    activeStep === 0
      ? "Kerngegevens van uw account."
      : activeStep === 1
        ? "Optioneel tijdens registratie; hier kunt u ze alsnog aanvullen."
        : activeStep === 2
          ? "Weergavenamen van gekoppelde organisaties."
          : "Gegevens van de vertegenwoordiger zoals bij registratie of onboarding vastgelegd.";

  return (
    <div className="flex w-full max-w-[1400px] flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8">
      <PageHeader
        icon={headerIcon}
        kicker="Hoofdaccount"
        title={<H1 className="text-balance">{profileTitle}</H1>}
        description="Uw account, gekoppelde organisaties en — indien van toepassing — gegevens uit registratie of onboarding."
        actions={
          user ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={openUserEdit}
              disabled={Boolean(pendingUserChange)}
                title={
                  pendingUserChange
                    ? "Er loopt al een profielwijziging. Bekijk of trek ze in via de kaart hieronder."
                    : undefined
                }
            >
              Gegevens bewerken
            </Button>
          ) : null
        }
      />

      {pendingUserChange ? (
        <div className="max-w-xl flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Openstaande wijziging — open de kaart voor details, tijdlijn en conversatie.
          </p>
          <ProfileChangeRequestOverviewCard request={pendingUserChange} onOpen={openPendingChangePanel} />
        </div>
      ) : null}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="flex max-h-[min(92vh,820px)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 space-y-2 border-b border-border px-6 pb-4 pt-6">
            <DialogTitle>Profiel bewerken</DialogTitle>
            <DialogDescription>
              U bereidt een wijzigingsdocument voor. Niets wijzigt direct: na indiening volgt validatie en acceptatie.
              Pas na acceptatie worden uw profielgegevens bijgewerkt.
            </DialogDescription>
          </DialogHeader>
          {form && user ? (
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
                    steps={USER_EDIT_STEPS}
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
                      <FieldLabel>Weergavenaam</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.displayName}
                          onChange={(ev) => setForm((f) => (f ? { ...f, displayName: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Voornaam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.givenName}
                            onChange={(ev) => setForm((f) => (f ? { ...f, givenName: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Achternaam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.familyName}
                            onChange={(ev) => setForm((f) => (f ? { ...f, familyName: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>E-mail</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(ev) => setForm((f) => (f ? { ...f, email: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Rol</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.role}
                          onChange={(ev) => setForm((f) => (f ? { ...f, role: ev.target.value } : f))}
                        />
                        <FieldDescription>Optioneel: bijv. beheerder, auditor.</FieldDescription>
                      </FieldContent>
                    </Field>
                  </div>
                ) : null}

                {activeStep === 1 ? (
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel>Werk-e-mail</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          value={form.workEmail ?? ""}
                          onChange={(ev) => setForm((f) => (f ? { ...f, workEmail: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Telefoon</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.phone ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, phone: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Mobiel</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.mobilePhone ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, mobilePhone: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Functietitel</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.jobTitle ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, jobTitle: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Afdeling</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.department ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, department: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Locale</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.locale ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, locale: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Tijdzone</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.timeZone ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, timeZone: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Voorkeurstaal</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.preferredLanguage ?? ""}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, preferredLanguage: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Aanhef</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.salutation ?? ""}
                            onChange={(ev) => setForm((f) => (f ? { ...f, salutation: ev.target.value } : f))}
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Personeelsreferentie</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.employeeReference ?? ""}
                          onChange={(ev) =>
                            setForm((f) => (f ? { ...f, employeeReference: ev.target.value } : f))
                          }
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Notities</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.notes ?? ""}
                          onChange={(ev) => setForm((f) => (f ? { ...f, notes: ev.target.value } : f))}
                        />
                        <FieldDescription>Optioneel voor intern gebruik.</FieldDescription>
                      </FieldContent>
                    </Field>
                  </div>
                ) : null}

                {activeStep === 2 ? (
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel>Thuisorganisatie (weergavenaam)</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.homeOrgName}
                          onChange={(ev) => setForm((f) => (f ? { ...f, homeOrgName: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Vertegenwoordigde organisatie (weergavenaam)</FieldLabel>
                      <FieldContent>
                        <Input
                          value={form.reprOrgName}
                          onChange={(ev) => setForm((f) => (f ? { ...f, reprOrgName: ev.target.value } : f))}
                        />
                      </FieldContent>
                    </Field>
                  </div>
                ) : null}

                {activeStep === 3 ? (
                  <div className="grid gap-4">
                    <p className="text-sm text-muted-foreground">
                      Afstemmen met de klantgegevens uit uw onboarding (optioneel buiten registratie).
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Voornaam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeFirstName}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeFirstName: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Achternaam</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeLastName}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeLastName: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Aanhef (preset-id)</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeTitlePreset}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeTitlePreset: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Aanhef (tekst)</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeTitle}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeTitle: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>E-mail (contact)</FieldLabel>
                      <FieldContent>
                        <Input
                          type="email"
                          value={form.representativeEmail}
                          onChange={(ev) =>
                            setForm((f) => (f ? { ...f, representativeEmail: ev.target.value } : f))
                          }
                        />
                      </FieldContent>
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Functie (preset-id)</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeRolePreset}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeRolePreset: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel>Functie (label)</FieldLabel>
                        <FieldContent>
                          <Input
                            value={form.representativeRole}
                            onChange={(ev) =>
                              setForm((f) => (f ? { ...f, representativeRole: ev.target.value } : f))
                            }
                          />
                        </FieldContent>
                      </Field>
                    </div>
                  </div>
                ) : null}
              </StepLayout>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {user ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account en werkruimte</CardTitle>
            <CardDescription>Gegevens gekoppeld aan uw account en actieve werkruimte.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <UserSessionProfileRows user={user} pendingChange={pendingUserChange} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">Geen actieve gebruiker in de sessie.</CardContent>
        </Card>
      )}

      {session?.organizations?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organisaties in uw werkruimte</CardTitle>
            <CardDescription>Organisaties waartussen u kunt schakelen.</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vertegenwoordiger (registratie)</CardTitle>
          <CardDescription>Gegevens uit de klantstap van uw onboarding of registratie.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {stored.flowContext || stored.completedSnapshotContext ? (
            <>
              {stored.flowContext ? (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Laatste flow-state ({ONBOARDING_FLOW_STORAGE_KEY})
                  </p>
                  <OnboardingPersonRows context={stored.flowContext} pendingChange={pendingUserChange} />
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
                  <OnboardingPersonRows context={stored.completedSnapshotContext} pendingChange={pendingUserChange} />
                </>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nog geen onboarding- of registratiegegevens. Voltooi of start de flow op{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/welcome/start</code> om hier velden te zien.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
