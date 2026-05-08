import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@procertus-ui/ui";
import type {
  CustomerContext,
  IdentificatiePersonCaptureState,
} from "./anonymous-onboarding-types";
import {
  certificationContactPersonFormValue,
  certificationSecondaryPersonFormValue,
  legalRepresentativePersonValue,
  registrantPersonFormValue,
} from "./anonymous-onboarding-flow-helpers";
import {
  IdentificatiePersonRegistrySummary,
  IdentificatiePersonSubform,
} from "./identificatie-subforms";
import {
  REPRESENTATIVE_ROLE_PRESETS,
  REPRESENTATIVE_TITLE_PRESETS,
  roleLabelForPresetId,
  titleLabelForPresetId,
} from "./lib/registrationPersonOptions";

/** Customizable labels and hints for {@link IdentificatiePersonTitleRoleCapture}. */
export type IdentificatiePersonTitleRoleCopy = {
  titleLabel: string;
  roleLabel: string;
  emailHint: string;
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

  const patchTitleOther = (text: string) => {
    switch (branch) {
      case "legalRepresentative":
        patchContext({ representativeTitle: text });
        return;
      case "registrant":
        patchContext({
          registrantTitle: text,
          registrantPerson: { ...context.registrantPerson, title: text },
        });
        return;
      case "certificationContact":
        patchContext({
          certificationContactTitle: text,
          certificationContact: { ...context.certificationContact, title: text },
        });
        return;
      case "certificationSecondary":
        patchContext({
          certificationSecondaryTitle: text,
          certificationSecondary: { ...context.certificationSecondary, title: text },
        });
        return;
    }
  };

  const patchRoleOther = (text: string) => {
    switch (branch) {
      case "legalRepresentative":
        patchContext({ representativeRole: text });
        return;
      case "registrant":
        patchContext({ registrantRole: text });
        return;
      case "certificationContact":
        patchContext({ certificationContactRole: text });
        return;
      case "certificationSecondary":
        patchContext({ certificationSecondaryRole: text });
        return;
    }
  };

  const onPersonChange = (v: IdentificatiePersonCaptureState) => {
    switch (branch) {
      case "legalRepresentative":
        patchContext({
          representativeFirstName: v.firstName,
          representativeLastName: v.lastName,
          representativeTitle: v.title,
          legalRepresentativePhone: v.telephone,
          representativeEmail: v.email,
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
          },
        });
        return;
    }
  };

  const titleOtherSelected = (() => {
    switch (branch) {
      case "legalRepresentative":
        return context.representativeTitlePreset === "other";
      case "registrant":
        return context.registrantTitlePreset === "other";
      case "certificationContact":
        return context.certificationContactTitlePreset === "other";
      case "certificationSecondary":
        return context.certificationSecondaryTitlePreset === "other";
    }
  })();

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

  const roleOtherSelected = (() => {
    switch (branch) {
      case "legalRepresentative":
        return context.representativeRolePreset === "other";
      case "registrant":
        return context.registrantRolePreset === "other";
      case "certificationContact":
        return context.certificationContactRolePreset === "other";
      case "certificationSecondary":
        return context.certificationSecondaryRolePreset === "other";
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

  const titleOtherInputId = (() => {
    switch (branch) {
      case "legalRepresentative":
        return "representativeTitleOther";
      case "registrant":
        return "registrantTitleOther";
      case "certificationContact":
        return `${idPrefix}-title-other`;
      case "certificationSecondary":
        return `${idPrefix}-title2-other`;
    }
  })();

  const roleOtherInputId = (() => {
    switch (branch) {
      case "legalRepresentative":
        return "representativeRole";
      case "registrant":
        return "registrantRole";
      case "certificationContact":
        return `${idPrefix}-role-other`;
      case "certificationSecondary":
        return `${idPrefix}-role2-other`;
    }
  })();

  const titlePresetField = (
    <Field className="min-w-0 md:col-span-1">
      <FieldLabel htmlFor={titleTriggerId}>{copy.titleLabel}</FieldLabel>
      <FieldContent className="w-full min-w-0">
        <Select
          disabled={disabled}
          value={titlePresetValue}
          onValueChange={onTitlePresetChange}
        >
          <SelectTrigger id={titleTriggerId} size="sm" className="h-8 w-full min-w-0" disabled={disabled}>
            <SelectValue placeholder="Geen selectie" />
          </SelectTrigger>
          <SelectContent>
            {REPRESENTATIVE_TITLE_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {titleOtherSelected ? (
          <div className="mt-2 w-full min-w-0 space-y-1">
            <Input
              id={titleOtherInputId}
              className="h-8"
              value={titleOtherValue}
              disabled={disabled}
              onChange={(event) => patchTitleOther(event.target.value)}
              placeholder="Bv. professor, ingenieur"
              autoComplete="honorific-prefix"
            />
          </div>
        ) : null}
      </FieldContent>
    </Field>
  );

  const rolePresetField = (
    <Field className="min-w-0 md:col-span-1">
      <FieldLabel htmlFor={roleTriggerId}>{copy.roleLabel}</FieldLabel>
      <FieldContent className="w-full min-w-0">
        <Select
          disabled={disabled}
          value={rolePresetValue}
          onValueChange={onRolePresetChange}
        >
          <SelectTrigger id={roleTriggerId} size="sm" className="h-8 w-full min-w-0" disabled={disabled}>
            <SelectValue placeholder="Geen selectie" />
          </SelectTrigger>
          <SelectContent>
            {REPRESENTATIVE_ROLE_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {roleOtherSelected ? (
          <div className="mt-2 w-full min-w-0 space-y-1">
            <Input
              id={roleOtherInputId}
              className="h-8"
              value={roleOtherValue}
              disabled={disabled}
              onChange={(event) => patchRoleOther(event.target.value)}
              placeholder="Bv. projectleider extern"
              aria-label="Functieomschrijving"
            />
            <FieldDescription>Verplicht: beschrijf uw rol.</FieldDescription>
          </div>
        ) : null}
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
          emailHint={copy.emailHint}
          startExtra={titlePresetField}
          contactRowExtra={rolePresetField}
          disabled={disabled}
        />
      )}
    </div>
  );
}
