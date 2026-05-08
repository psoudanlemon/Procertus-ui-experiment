import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  SkeletonPrefillField,
} from "@procertus-ui/ui";

import type { CustomerContext } from "../../../onboarding/onboarding-types";
import type { CompanyFormFieldKey } from "../../../onboarding/lib/vatPrototypePresets";

/** Single labeled input used across customer and company onboarding steps. */
export function OnboardingContextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  description,
}: {
  id: keyof CustomerContext;
  label: string;
  value: string;
  onChange: (id: keyof CustomerContext, value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  description?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={String(id)}>{label}</FieldLabel>
      <FieldContent>
        <Input
          id={String(id)}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(event) => onChange(id, event.target.value)}
        />
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
    </Field>
  );
}

const COMPANY_FORM_FIELD_LABELS: Record<CompanyFormFieldKey, string> = {
  organizationName: "Bedrijfsnaam",
  country: "Land",
  addressStreet: "Straat",
  addressHouseNumber: "Huisnummer",
  addressPostalCode: "Postcode",
  addressCity: "Plaats",
};

/** Skeleton grid shown during mock company lookup. */
export function OnboardingCompanyPrefillSkeleton({
  prefilledKeys,
  resolvedKeys,
}: {
  prefilledKeys: ReadonlySet<CompanyFormFieldKey>;
  resolvedKeys: ReadonlySet<CompanyFormFieldKey>;
}) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Velden die automatisch worden ingevuld"
    >
      <SkeletonPrefillField
        label={COMPANY_FORM_FIELD_LABELS.organizationName}
        prefilled={prefilledKeys.has("organizationName")}
        resolved={resolvedKeys.has("organizationName")}
      />
      <SkeletonPrefillField
        label={COMPANY_FORM_FIELD_LABELS.country}
        prefilled={prefilledKeys.has("country")}
        resolved={resolvedKeys.has("country")}
      />
      <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
        <SkeletonPrefillField
          label={COMPANY_FORM_FIELD_LABELS.addressStreet}
          prefilled={prefilledKeys.has("addressStreet")}
          resolved={resolvedKeys.has("addressStreet")}
        />
        <SkeletonPrefillField
          label={COMPANY_FORM_FIELD_LABELS.addressHouseNumber}
          prefilled={prefilledKeys.has("addressHouseNumber")}
          resolved={resolvedKeys.has("addressHouseNumber")}
        />
        <SkeletonPrefillField
          label={COMPANY_FORM_FIELD_LABELS.addressPostalCode}
          prefilled={prefilledKeys.has("addressPostalCode")}
          resolved={resolvedKeys.has("addressPostalCode")}
        />
        <SkeletonPrefillField
          label={COMPANY_FORM_FIELD_LABELS.addressCity}
          prefilled={prefilledKeys.has("addressCity")}
          resolved={resolvedKeys.has("addressCity")}
        />
      </div>
    </div>
  );
}
