import {
  certificationSecondaryContactDisabledHint,
  emptyIdentificatiePersonState,
  emphasizeInvalidMarkersCertificationPrimaryPerson,
  emphasizeInvalidMarkersCertificationSecondaryPerson,
  ONBOARDING_PERSON_NEW_ID,
} from "../../../onboarding/onboarding-flow-helpers";
import { IdentificatieOptionalBlock } from "../../../onboarding/identificatie-subforms";
import { IdentificatiePersonTitleRoleCapture } from "../../../onboarding/identificatie-person-title-role-capture";
import { IdentificatiePersonRegistryPicker } from "../../../onboarding/identificatie-person-registry-picker";
import type { OnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

export type OnboardingExtrasStepProps = { model: OnboardingRegistrationLayoutModel };

export function OnboardingExtrasStep({ model }: OnboardingExtrasStepProps) {
  const { context, patchContext, invoicingFieldBase, canAddCertificationSecondary } = model;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Certificatie en inspectie
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Optioneel: schakel in wat nodig is. Alle blokken gebruiken hetzelfde patroon (schakelaar
          rechtsboven). U kunt deze stap overslaan.
        </p>
      </div>
      <IdentificatieOptionalBlock
        switchId="cert-primary"
        title="Contactpersoon voor certificatie en inspectie"
        description="Los van facturatie: dit is het aanspreekpunt voor alles rond certificatie en inspectie. Kies een bestaande persoon of een nieuwe."
        checked={context.addCertificationContactOverride}
        onCheckedChange={(on) =>
          patchContext({
            addCertificationContactOverride: on,
            ...(!on
              ? {
                  certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                  addCertificationSecondaryContact: false,
                  certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                }
              : {}),
          })
        }
        headerTrailing={
          context.addCertificationContactOverride ? (
            <IdentificatiePersonRegistryPicker
              cardHeader
              id={`${invoicingFieldBase}-cert-primary-registry`}
              label="Persoon kiezen"
              hint="Kies een bestaande persoon of een nieuwe persoon invoeren. Alleen bij een nieuwe persoon vult u hieronder aanhef en functie in."
              registeredPersons={context.onboardingRegisteredPersons}
              value={context.certificationContactPersonRegistryId}
              onValueChange={(rid) => {
                if (rid === ONBOARDING_PERSON_NEW_ID) {
                  patchContext({
                    certificationContactPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                    certificationContact: emptyIdentificatiePersonState(),
                    certificationContactTitlePreset: "none",
                    certificationContactTitle: "",
                    certificationContactRolePreset: "none",
                    certificationContactRole: "",
                  });
                  return;
                }
                const row = context.onboardingRegisteredPersons.find((p) => p.id === rid);
                if (!row) {
                  return;
                }
                const p = row.person;
                const certAanhef = p.title?.trim() ?? "";
                patchContext({
                  certificationContactPersonRegistryId: rid,
                  certificationContact: { ...p },
                  certificationContactTitlePreset: certAanhef ? "other" : "none",
                  certificationContactTitle: certAanhef,
                  certificationContactRolePreset: "none",
                  certificationContactRole: "",
                });
              }}
            />
          ) : null
        }
      >
        {context.addCertificationContactOverride ? (
          <IdentificatiePersonTitleRoleCapture
            registryPersonSelected={
              context.certificationContactPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
            }
            idPrefix="cert-primary"
            branch="certificationContact"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={emphasizeInvalidMarkersCertificationPrimaryPerson(
              context,
            )}
            copy={{
              titleLabel: "Title",
              roleLabel: "Role",
            }}
          />
        ) : null}
      </IdentificatieOptionalBlock>
      <IdentificatieOptionalBlock
        switchId="cert-secondary"
        title="Tweede contactpersoon (reserve certificatie en inspectie)"
        description="Optioneel: een extra geadresseerde als reserve, naast het hoofdcontact voor certificatie en inspectie hierboven."
        checked={context.addCertificationSecondaryContact}
        onCheckedChange={(on) =>
          patchContext({
            addCertificationSecondaryContact: on,
            ...(!on
              ? { certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID }
              : {
                  certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                  certificationSecondary: emptyIdentificatiePersonState(),
                  certificationSecondaryTitlePreset: "none",
                  certificationSecondaryTitle: "",
                  certificationSecondaryRolePreset: "none",
                  certificationSecondaryRole: "",
                }),
          })
        }
        disabled={!canAddCertificationSecondary}
        disabledHint={certificationSecondaryContactDisabledHint(context)}
        headerTrailing={
          context.addCertificationSecondaryContact && canAddCertificationSecondary ? (
            <IdentificatiePersonRegistryPicker
              cardHeader
              id={`${invoicingFieldBase}-cert-secondary-registry`}
              label="Persoon kiezen"
              hint="Kies een bestaande persoon of een nieuwe persoon invoeren. Alleen bij een nieuwe persoon vult u hieronder aanhef en functie in."
              registeredPersons={context.onboardingRegisteredPersons}
              value={context.certificationSecondaryPersonRegistryId}
              onValueChange={(rid) => {
                if (rid === ONBOARDING_PERSON_NEW_ID) {
                  patchContext({
                    certificationSecondaryPersonRegistryId: ONBOARDING_PERSON_NEW_ID,
                    certificationSecondary: emptyIdentificatiePersonState(),
                    certificationSecondaryTitlePreset: "none",
                    certificationSecondaryTitle: "",
                    certificationSecondaryRolePreset: "none",
                    certificationSecondaryRole: "",
                  });
                  return;
                }
                const row = context.onboardingRegisteredPersons.find((p) => p.id === rid);
                if (!row) {
                  return;
                }
                const p = row.person;
                const cert2Aanhef = p.title?.trim() ?? "";
                patchContext({
                  certificationSecondaryPersonRegistryId: rid,
                  certificationSecondary: { ...p },
                  certificationSecondaryTitlePreset: cert2Aanhef ? "other" : "none",
                  certificationSecondaryTitle: cert2Aanhef,
                  certificationSecondaryRolePreset: "none",
                  certificationSecondaryRole: "",
                });
              }}
            />
          ) : null
        }
      >
        {context.addCertificationSecondaryContact && canAddCertificationSecondary ? (
          <IdentificatiePersonTitleRoleCapture
            registryPersonSelected={
              context.certificationSecondaryPersonRegistryId !== ONBOARDING_PERSON_NEW_ID
            }
            idPrefix="cert-secondary"
            branch="certificationSecondary"
            context={context}
            patchContext={patchContext}
            emphasizeInvalidRequiredMarkers={emphasizeInvalidMarkersCertificationSecondaryPerson(
              context,
            )}
            copy={{
              titleLabel: "Title",
              roleLabel: "Role",
            }}
          />
        ) : null}
      </IdentificatieOptionalBlock>
    </div>
  );
}
