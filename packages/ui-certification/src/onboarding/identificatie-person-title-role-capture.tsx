import {
  CreatableCombobox,
  Field,
  FieldContent,
  FieldLabel,
} from "@procertus-ui/ui";
import type { CustomerContext, IdentificatiePersonCaptureState } from "./onboarding-types";
import { coercePersonPreferredLanguage } from "@procertus-ui/domain-certification";
import {
  certificationContactPersonFormValue,
  certificationSecondaryPersonFormValue,
  legalRepresentativePersonValue,
  registrantPersonFormValue,
} from "./onboarding-flow-helpers";
import {
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
  RequiredFieldSuffix,
} from "./identificatie-subforms";
import {
  REPRESENTATIVE_ROLE_PRESETS,
  REPRESENTATIVE_TITLE_PRESETS,
  representativePresetSelectionComplete,
  roleLabelForPresetId,
  titleLabelForPresetId,
} from "./lib/registrationPersonOptions";

const ROLE_COMBOBOX_OPTIONS = REPRESENTATIVE_ROLE_PRESETS.filter(
  (p) => p.id !== "none" && p.id !== "other",
).map((p) => ({ value: p.id, label: p.label }));

const TITLE_COMBOBOX_OPTIONS = REPRESENTATIVE_TITLE_PRESETS.filter(
  (p) => p.id !== "none" && p.id !== "other",
).map((p) => ({ value: p.id, label: p.label }));

/** Customizable labels and hints for {@link IdentificatiePersonTitleRoleCapture}. */
export type IdentificatiePersonTitleRoleCopy = {
  titleLabel: string;
  roleLabel: string;
  /** Optional footer text under the person grid (full width). */
  formDescription?: string;
};

export type IdentificatiePersonTitleRoleBranch =
  | "legalRepresentative"
  | "registrant"
  | "certificationContact"
  | "certificationSecondary";

export function IdentificatiePersonTitleRoleCapture({
  idPrefix,
  branch,
  context,
  copy,
  patchContext,
  registryPersonSelected = false,
  disabled = false,
  emphasizeInvalidRequiredMarkers = false,
}: {
  idPrefix: string;
  branch: IdentificatiePersonTitleRoleBranch;
  context: CustomerContext;
  copy: IdentificatiePersonTitleRoleCopy;
  patchContext: (patch: Partial<CustomerContext>) => void;
  /**
   * When true, show a compact read-only identity summary; title/role fields remain editable for this
   * context (e.g. certification contact from registry).
   */
  registryPersonSelected?: boolean;
  /** When true, person grid and preset controls do not accept input (e.g. pending prerequisite answers). */
  disabled?: boolean;
  /** When this person slice is still incomplete, accent invalid required markers (see person subform). */
  emphasizeInvalidRequiredMarkers?: boolean;
}) {
  const personValue: IdentificatiePersonCaptureState = (() => {
    switch (branch) {
      case "legalRepresentative":
        return legalRepresentativePersonValue(context);
      case "registrant":
        return registrantPersonFormValue(context);
      case "certificationContact":
        return certificationContactPersonFormValue(context);
      case "certificationSecondary":
        return certificationSecondaryPersonFormValue(context);
    }
  })();

  const { titlePreset, rolePreset, titleTriggerId, roleTriggerId } = (() => {
    switch (branch) {
      case "legalRepresentative":
        return {
          titlePreset: context.representativeTitlePreset,
          rolePreset: context.representativeRolePreset,
          titleTriggerId: "representativeTitlePreset",
          roleTriggerId: "representativeRolePreset",
        };
      case "registrant":
        return {
          titlePreset: context.registrantTitlePreset,
          rolePreset: context.registrantRolePreset,
          titleTriggerId: "registrantTitlePreset",
          roleTriggerId: "registrantRolePreset",
        };
      case "certificationContact":
        return {
          titlePreset: context.certificationContactTitlePreset,
          rolePreset: context.certificationContactRolePreset,
          titleTriggerId: `${idPrefix}-cert-title-preset`,
          roleTriggerId: `${idPrefix}-cert-role-preset`,
        };
      case "certificationSecondary":
        return {
          titlePreset: context.certificationSecondaryTitlePreset,
          rolePreset: context.certificationSecondaryRolePreset,
          titleTriggerId: `${idPrefix}-cert2-title-preset`,
          roleTriggerId: `${idPrefix}-cert2-role-preset`,
        };
    }
  })();

  const titlePresetValue = REPRESENTATIVE_TITLE_PRESETS.some((p) => p.id === titlePreset)
    ? titlePreset
    : "none";
  const rolePresetValue = REPRESENTATIVE_ROLE_PRESETS.some((p) => p.id === rolePreset)
    ? rolePreset
    : "none";

  const titleDisabled = true;

  const onTitlePresetChange = (presetId: string) => {
    switch (branch) {
      case "legalRepresentative": {
        if (presetId === "other") {
          patchContext({ representativeTitlePreset: "other" });
          return;
        }
        if (presetId === "none") {
          patchContext({ representativeTitlePreset: "none", representativeTitle: "" });
          return;
        }
        patchContext({
          representativeTitlePreset: presetId,
          representativeTitle: titleLabelForPresetId(presetId),
        });
        return;
      }
      case "registrant": {
        if (presetId === "other") {
          patchContext({ registrantTitlePreset: "other" });
          return;
        }
        if (presetId === "none") {
          patchContext({
            registrantTitlePreset: "none",
            registrantTitle: "",
            registrantPerson: { ...context.registrantPerson, title: "" },
          });
          return;
        }
        const label = titleLabelForPresetId(presetId);
        patchContext({
          registrantTitlePreset: presetId,
          registrantTitle: label,
          registrantPerson: { ...context.registrantPerson, title: label },
        });
        return;
      }
      case "certificationContact": {
        if (presetId === "other") {
          patchContext({ certificationContactTitlePreset: "other" });
          return;
        }
        if (presetId === "none") {
          patchContext({
            certificationContactTitlePreset: "none",
            certificationContactTitle: "",
            certificationContact: { ...context.certificationContact, title: "" },
          });
          return;
        }
        const label = titleLabelForPresetId(presetId);
        patchContext({
          certificationContactTitlePreset: presetId,
          certificationContactTitle: label,
          certificationContact: { ...context.certificationContact, title: label },
        });
        return;
      }
      case "certificationSecondary": {
        if (presetId === "other") {
          patchContext({ certificationSecondaryTitlePreset: "other" });
          return;
        }
        if (presetId === "none") {
          patchContext({
            certificationSecondaryTitlePreset: "none",
            certificationSecondaryTitle: "",
            certificationSecondary: { ...context.certificationSecondary, title: "" },
          });
          return;
        }
        const label = titleLabelForPresetId(presetId);
        patchContext({
          certificationSecondaryTitlePreset: presetId,
          certificationSecondaryTitle: label,
          certificationSecondary: { ...context.certificationSecondary, title: label },
        });
        return;
      }
    }
  };

  const onRolePresetChange = (presetRoleId: string) => {
    switch (branch) {
      case "legalRepresentative": {
        if (presetRoleId === "none") {
          patchContext({ representativeRolePreset: "none", representativeRole: "" });
          return;
        }
        if (presetRoleId === "other") {
          patchContext({ representativeRolePreset: "other", representativeRole: "" });
          return;
        }
        patchContext({
          representativeRolePreset: presetRoleId,
          representativeRole: roleLabelForPresetId(presetRoleId),
        });
        return;
      }
      case "registrant": {
        if (presetRoleId === "none") {
          patchContext({ registrantRolePreset: "none", registrantRole: "" });
          return;
        }
        if (presetRoleId === "other") {
          patchContext({ registrantRolePreset: "other", registrantRole: "" });
          return;
        }
        patchContext({
          registrantRolePreset: presetRoleId,
          registrantRole: roleLabelForPresetId(presetRoleId),
        });
        return;
      }
      case "certificationContact": {
        if (presetRoleId === "none") {
          patchContext({ certificationContactRolePreset: "none", certificationContactRole: "" });
          return;
        }
        if (presetRoleId === "other") {
          patchContext({ certificationContactRolePreset: "other", certificationContactRole: "" });
          return;
        }
        patchContext({
          certificationContactRolePreset: presetRoleId,
          certificationContactRole: roleLabelForPresetId(presetRoleId),
        });
        return;
      }
      case "certificationSecondary": {
        if (presetRoleId === "none") {
          patchContext({
            certificationSecondaryRolePreset: "none",
            certificationSecondaryRole: "",
          });
          return;
        }
        if (presetRoleId === "other") {
          patchContext({
            certificationSecondaryRolePreset: "other",
            certificationSecondaryRole: "",
          });
          return;
        }
        patchContext({
          certificationSecondaryRolePreset: presetRoleId,
          certificationSecondaryRole: roleLabelForPresetId(presetRoleId),
        });
        return;
      }
    }
  };

  const onPersonChange = (v: IdentificatiePersonCaptureState) => {
    const lang = coercePersonPreferredLanguage(v.language);
    switch (branch) {
      case "legalRepresentative":
        patchContext({
          representativeFirstName: v.firstName,
          representativeLastName: v.lastName,
          representativeTitle: v.title,
          legalRepresentativePhone: v.telephone,
          representativeEmail: v.email,
          representativeLanguage: lang,
        });
        return;
      case "registrant":
        patchContext({
          registrantTitle: v.title,
          registrantPerson: {
            ...context.registrantPerson,
            firstName: v.firstName,
            lastName: v.lastName,
            title: v.title,
            telephone: v.telephone,
            email: v.email,
            language: lang,
          },
        });
        return;
      case "certificationContact":
        patchContext({
          certificationContactTitle: v.title,
          certificationContact: {
            ...context.certificationContact,
            firstName: v.firstName,
            lastName: v.lastName,
            title: v.title,
            telephone: v.telephone,
            email: v.email,
            language: lang,
          },
        });
        return;
      case "certificationSecondary":
        patchContext({
          certificationSecondaryTitle: v.title,
          certificationSecondary: {
            ...context.certificationSecondary,
            firstName: v.firstName,
            lastName: v.lastName,
            title: v.title,
            telephone: v.telephone,
            email: v.email,
            language: lang,
          },
        });
        return;
    }
  };

  const titleOtherValue = (() => {
    switch (branch) {
      case "legalRepresentative":
        return context.representativeTitle;
      case "registrant":
        return context.registrantTitle;
      case "certificationContact":
        return context.certificationContactTitle;
      case "certificationSecondary":
        return context.certificationSecondaryTitle;
    }
  })();

  const roleOtherValue = (() => {
    switch (branch) {
      case "legalRepresentative":
        return context.representativeRole;
      case "registrant":
        return context.registrantRole;
      case "certificationContact":
        return context.certificationContactRole;
      case "certificationSecondary":
        return context.certificationSecondaryRole;
    }
  })();

  const titlePresetMarkerErroneous =
    emphasizeInvalidRequiredMarkers &&
    !representativePresetSelectionComplete(
      titlePresetValue,
      titleOtherValue,
      REPRESENTATIVE_TITLE_PRESETS,
    );
  const rolePresetMarkerErroneous =
    emphasizeInvalidRequiredMarkers &&
    !representativePresetSelectionComplete(
      rolePresetValue,
      roleOtherValue,
      REPRESENTATIVE_ROLE_PRESETS,
    );

  const titleComboboxValue =
    titlePresetValue === "none"
      ? ""
      : titlePresetValue === "other"
        ? titleOtherValue
        : titlePresetValue;

  const handleTitleCreate = (label: string) => {
    switch (branch) {
      case "legalRepresentative":
        patchContext({ representativeTitlePreset: "other", representativeTitle: label });
        return;
      case "registrant":
        patchContext({
          registrantTitlePreset: "other",
          registrantTitle: label,
          registrantPerson: { ...context.registrantPerson, title: label },
        });
        return;
      case "certificationContact":
        patchContext({
          certificationContactTitlePreset: "other",
          certificationContactTitle: label,
          certificationContact: { ...context.certificationContact, title: label },
        });
        return;
      case "certificationSecondary":
        patchContext({
          certificationSecondaryTitlePreset: "other",
          certificationSecondaryTitle: label,
          certificationSecondary: { ...context.certificationSecondary, title: label },
        });
        return;
    }
  };

  const titlePresetField = (
    <Field className="min-w-0 md:col-span-1">
      <FieldLabel htmlFor={titleTriggerId}>
        {copy.titleLabel} <RequiredFieldSuffix erroneous={titlePresetMarkerErroneous} />
      </FieldLabel>
      <FieldContent className="w-full min-w-0">
        <CreatableCombobox
          id={titleTriggerId}
          options={TITLE_COMBOBOX_OPTIONS}
          value={titleComboboxValue}
          onValueChange={(v) => onTitlePresetChange(v || "none")}
          onCreate={handleTitleCreate}
          placeholder="Geen selectie"
          searchPlaceholder="Zoek aanhef"
          createLabel={(s) => (
            <>
              Voeg &quot;<span className="font-medium">{s}</span>&quot; toe
            </>
          )}
          createTooltip={(s) => `Voeg "${s}" toe als nieuwe aanhef`}
          clearAriaLabel="Wis aanhefkeuze"
          disabled={disabled}
          className="h-8"
        />
      </FieldContent>
    </Field>
  );

  const roleComboboxValue =
    rolePresetValue === "none"
      ? ""
      : rolePresetValue === "other"
        ? roleOtherValue
        : rolePresetValue;

  const handleRoleCreate = (label: string) => {
    switch (branch) {
      case "legalRepresentative":
        patchContext({ representativeRolePreset: "other", representativeRole: label });
        return;
      case "registrant":
        patchContext({ registrantRolePreset: "other", registrantRole: label });
        return;
      case "certificationContact":
        patchContext({
          certificationContactRolePreset: "other",
          certificationContactRole: label,
        });
        return;
      case "certificationSecondary":
        patchContext({
          certificationSecondaryRolePreset: "other",
          certificationSecondaryRole: label,
        });
        return;
    }
  };

  const rolePresetField = (
    <Field className="min-w-0 md:col-span-1">
      <FieldLabel htmlFor={roleTriggerId}>
        {copy.roleLabel} <RequiredFieldSuffix erroneous={rolePresetMarkerErroneous} />
      </FieldLabel>
      <FieldContent className="w-full min-w-0">
        <CreatableCombobox
          id={roleTriggerId}
          options={ROLE_COMBOBOX_OPTIONS}
          value={roleComboboxValue}
          onValueChange={(v) => onRolePresetChange(v || "none")}
          onCreate={handleRoleCreate}
          placeholder="Geen selectie"
          searchPlaceholder="Zoek functienaam"
          createLabel={(s) => (
            <>
              Voeg &quot;<span className="font-medium">{s}</span>&quot; toe
            </>
          )}
          createTooltip={(s) => `Voeg "${s}" toe als nieuwe functie`}
          clearAriaLabel="Wis functiekeuze"
          disabled={disabled}
          className="h-8"
        />
      </FieldContent>
    </Field>
  );

  return (
    <div className="space-y-4">
      {registryPersonSelected ? (
        <>
          <IdentificatiePersonRegistrySummary person={personValue} />
          {copy.formDescription ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{copy.formDescription}</p>
          ) : null}
        </>
      ) : (
        <IdentificatiePersonSubform
          idPrefix={idPrefix}
          value={personValue}
          onChange={onPersonChange}
          titleDisabled={titleDisabled}
          description={copy.formDescription}
          startExtra={titlePresetField}
          contactRowExtra={rolePresetField}
          disabled={disabled}
          emphasizeInvalidRequiredMarkers={emphasizeInvalidRequiredMarkers}
        />
      )}
    </div>
  );
}
