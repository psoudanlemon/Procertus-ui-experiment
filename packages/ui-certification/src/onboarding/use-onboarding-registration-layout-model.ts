import { personSubformEmailStructuralIssue } from "@procertus-ui/domain-certification";
import { useId, useMemo } from "react";

import { sortDraftsByIntentAndProduct } from "../components/certification-request-wizard/draft-selection-presentation";
import type { CertificationRequestDraft } from "../CertificationRequestContext";
import { COUNTRY_SELECT_NONE } from "./onboarding-constants";
import type { OnboardingFlowViewProps } from "./onboarding-flow-view-props";
import {
  buildFullOnboardingPackageEntityRecords,
  canEnableCertificationSecondaryContact,
  onboardingReviewRequesterFromContext,
} from "./onboarding-flow-helpers";
import {
  companyRegistrationSourceCountryLabel,
  isFirmaCountryLockedToRequestOrigin,
} from "./onboarding-request-origin";
import {
  CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
  CERT_INQUIRY_VEST_UNASSIGNED,
} from "./onboarding-flow-select-sentinels";
import {
  isRegistrationIdentifierValidForOrigin,
  registrationIdentifierFieldMeta,
  registrationIdentifierStructuralIssue,
} from "./lib/registration-identifier-for-origin";

export type OnboardingRegistrationLayoutModel = OnboardingFlowViewProps & {
  originFieldBase: string;
  applicantLegalRepFieldBase: string;
  applicantLegalRepPersonFieldsLocked: boolean;
  invoicingFieldBase: string;
  legalEntityFieldBase: string;
  /** Sorted wizard drafts shown where the broad package matters. */
  draftsSortedForCertification: ReturnType<typeof sortDraftsByIntentAndProduct>;
  /** Drafts in this dossier registration scope (included in nazicht/submit); drives legal entity UI. */
  draftsInRegistrationScope: CertificationRequestDraft[];
  invoicingCountryOptions: readonly string[];
  invoicingCountrySelectValue: string;
  registrationIdOrigin: string;
  registrationIdFieldMeta: ReturnType<typeof registrationIdentifierFieldMeta>;
  registrationIdentifierIssue: string | null;
  registrationIdentifierStructurallyValid: boolean;
  invoicingEmailIssue: string | null;
  canAddCertificationSecondary: boolean;
  fullPackageEntityRecords: ReturnType<typeof buildFullOnboardingPackageEntityRecords>;
  summaryRequesterLabel: string;
  summaryRequesterEmailLabel: string;
  summaryOrganizationLabel: string;
  summarySectionTitle: string;
  summaryRc: ReturnType<typeof onboardingReviewRequesterFromContext>["context"];
  firmaCountryLocked: boolean;
  companySourceCountryLabel: string;
  CERT_INQUIRY_LEGAL_ENTITY_ZETEL: string;
  CERT_INQUIRY_VEST_UNASSIGNED: string;
};

export function useOnboardingRegistrationLayoutModel(
  props: OnboardingFlowViewProps,
): OnboardingRegistrationLayoutModel {
  const {
    context,
    drafts,
    effectiveSummaryIncludedDraftIds,
    requestOrigin,
    countrySelectOptions,
    summaryKlantenportaalByPersonId,
  } = props;

  const originFieldBase = useId();
  const applicantLegalRepFieldBase = useId();
  const applicantLegalRepPersonFieldsLocked = context.applicantIsLegalRepresentative === "";
  const invoicingFieldBase = useId();
  const legalEntityFieldBase = useId();

  const draftsSortedForCertification = useMemo(
    () => sortDraftsByIntentAndProduct(drafts),
    [drafts],
  );

  const draftsInRegistrationScope = useMemo(() => {
    const allow = new Set(effectiveSummaryIncludedDraftIds);
    return draftsSortedForCertification.filter((d) => allow.has(d.id));
  }, [draftsSortedForCertification, effectiveSummaryIncludedDraftIds]);

  const invoicingCountryOptions = useMemo(() => {
    const c = context.invoicingCountry?.trim();
    if (c && !countrySelectOptions.includes(c)) {
      return [...countrySelectOptions, c].sort((a, b) => a.localeCompare(b, "nl"));
    }
    return countrySelectOptions;
  }, [context.invoicingCountry, countrySelectOptions]);

  const invoicingCountrySelectValue = useMemo(() => {
    const t = context.invoicingCountry?.trim() ?? "";
    return t && invoicingCountryOptions.includes(t) ? t : COUNTRY_SELECT_NONE;
  }, [context.invoicingCountry, invoicingCountryOptions]);

  const registrationIdOrigin = requestOrigin !== "" ? requestOrigin : "other";

  const registrationIdFieldMeta = useMemo(
    () => registrationIdentifierFieldMeta(registrationIdOrigin),
    [registrationIdOrigin],
  );

  const registrationIdentifierIssue = useMemo(
    () => registrationIdentifierStructuralIssue(context.vatNumber, registrationIdOrigin),
    [context.vatNumber, registrationIdOrigin],
  );

  const registrationIdentifierStructurallyValid = useMemo(() => {
    const raw = context.vatNumber?.trim() ?? "";
    if (!raw) return false;
    return isRegistrationIdentifierValidForOrigin(context.vatNumber, registrationIdOrigin);
  }, [context.vatNumber, registrationIdOrigin]);

  const invoicingEmailIssue = useMemo(() => {
    const t = context.invoicingEmail?.trim() ?? "";
    if (t.length === 0) return "Voer een e-mailadres voor facturatie in.";
    return personSubformEmailStructuralIssue(context.invoicingEmail ?? "");
  }, [context.invoicingEmail]);

  const canAddCertificationSecondary = useMemo(
    () => canEnableCertificationSecondaryContact(context),
    [context],
  );

  const fullPackageEntityRecords = useMemo(
    () =>
      buildFullOnboardingPackageEntityRecords(
        context,
        drafts,
        effectiveSummaryIncludedDraftIds,
        requestOrigin,
        summaryKlantenportaalByPersonId,
      ),
    [
      context,
      drafts,
      effectiveSummaryIncludedDraftIds,
      requestOrigin,
      summaryKlantenportaalByPersonId,
    ],
  );

  const summaryRequesterPresentation = useMemo(
    () => onboardingReviewRequesterFromContext(context),
    [context],
  );

  const summaryReq = summaryRequesterPresentation;
  const summaryRc = summaryReq.context;

  const firmaCountryLocked = isFirmaCountryLockedToRequestOrigin(requestOrigin);
  const companySourceCountryLabel = companyRegistrationSourceCountryLabel(
    requestOrigin,
    context.country,
  );

  return {
    ...props,
    originFieldBase,
    applicantLegalRepFieldBase,
    applicantLegalRepPersonFieldsLocked,
    invoicingFieldBase,
    legalEntityFieldBase,
    draftsSortedForCertification,
    draftsInRegistrationScope,
    invoicingCountryOptions,
    invoicingCountrySelectValue,
    registrationIdOrigin,
    registrationIdFieldMeta,
    registrationIdentifierIssue,
    registrationIdentifierStructurallyValid,
    invoicingEmailIssue,
    canAddCertificationSecondary,
    fullPackageEntityRecords,
    summaryRequesterLabel: summaryReq.requesterLabel ?? "Ingediend door",
    summaryRequesterEmailLabel: summaryReq.requesterEmailLabel ?? "E-mail",
    summaryOrganizationLabel: summaryReq.organizationLabel ?? "Organisatie",
    summarySectionTitle: summaryReq.sectionTitle ?? "Aanvrager en organisatie",
    summaryRc,
    firmaCountryLocked,
    companySourceCountryLabel,
    CERT_INQUIRY_LEGAL_ENTITY_ZETEL,
    CERT_INQUIRY_VEST_UNASSIGNED,
  };
}
