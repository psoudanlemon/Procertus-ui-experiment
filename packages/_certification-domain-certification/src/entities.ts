import { Schema } from "effect";

export const CertificationRequestStepId = Schema.Literals(["intent", "details", "drafts", "review"]);
export type CertificationRequestStepId = typeof CertificationRequestStepId.Type;

export const CertificationRequestMode = Schema.Literals(["onboarding", "authenticated"]);
export type CertificationRequestMode = typeof CertificationRequestMode.Type;

export const CertificationRequestIntentId = Schema.Literals([
  "product-certification",
  "atg",
  "innovation-attest",
  "procertus",
  "epd",
  "partijkeuring",
]);
export type CertificationRequestIntentId = typeof CertificationRequestIntentId.Type;

export const CertificationEntryId = Schema.Union([
  CertificationRequestIntentId,
  Schema.Literals(["ce", "benor", "ssd"]),
]);
export type CertificationEntryId = typeof CertificationEntryId.Type;

export const CertificationRequestDraft = Schema.Struct({
  id: Schema.String,
  entryId: CertificationEntryId,
  label: Schema.String,
  shortLabel: Schema.String,
  productId: Schema.optional(Schema.String),
  productLabel: Schema.optional(Schema.String),
  productPath: Schema.optional(Schema.String),
  value: Schema.optional(Schema.String),
  context: Schema.optional(Schema.String),
});
export type CertificationRequestDraft = typeof CertificationRequestDraft.Type;

export const CertificationCustomerContext = Schema.Struct({
  id: Schema.String,
  representativeName: Schema.String,
  representativeEmail: Schema.String,
  organizationName: Schema.String,
  country: Schema.String,
  vatNumber: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  kycNotes: Schema.optional(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.String,
});
export type CertificationCustomerContext = typeof CertificationCustomerContext.Type;

export const CertificationRequestSession = Schema.Struct({
  id: Schema.String,
  mode: CertificationRequestMode,
  activeStep: Schema.Number,
  intent: Schema.optional(CertificationRequestIntentId),
  expandedIds: Schema.Array(Schema.String),
  searchValue: Schema.String,
  hideUnavailableProducts: Schema.Boolean,
  selectedProductId: Schema.optional(Schema.String),
  selectedEntryIds: Schema.Array(Schema.String),
  requestText: Schema.String,
  drafts: Schema.Array(CertificationRequestDraft),
  customerContextId: Schema.optional(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.String,
});
export type CertificationRequestSession = typeof CertificationRequestSession.Type;

export const CertificationRequestPackage = Schema.Struct({
  id: Schema.String,
  sessionId: Schema.String,
  customerContextId: Schema.optional(Schema.String),
  draftIds: Schema.Array(Schema.String),
  status: Schema.Literals(["draft", "submitted", "activation-pending", "activated"]),
  createdAt: Schema.String,
  updatedAt: Schema.String,
});
export type CertificationRequestPackage = typeof CertificationRequestPackage.Type;

export const CreateCertificationCustomerContext = Schema.Struct({
  representativeName: Schema.String,
  representativeEmail: Schema.String,
  organizationName: Schema.String,
  country: Schema.String,
  vatNumber: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  kycNotes: Schema.optional(Schema.String),
});
export type CreateCertificationCustomerContext = typeof CreateCertificationCustomerContext.Type;

export const UpdateCertificationCustomerContext = Schema.Struct({
  representativeName: Schema.optional(Schema.String),
  representativeEmail: Schema.optional(Schema.String),
  organizationName: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
  vatNumber: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  kycNotes: Schema.optional(Schema.String),
});
export type UpdateCertificationCustomerContext = typeof UpdateCertificationCustomerContext.Type;

export const CreateCertificationRequestSession = Schema.Struct({
  id: Schema.optional(Schema.String),
  mode: CertificationRequestMode,
  activeStep: Schema.optional(Schema.Number),
  intent: Schema.optional(CertificationRequestIntentId),
  expandedIds: Schema.optional(Schema.Array(Schema.String)),
  searchValue: Schema.optional(Schema.String),
  hideUnavailableProducts: Schema.optional(Schema.Boolean),
  selectedProductId: Schema.optional(Schema.String),
  selectedEntryIds: Schema.optional(Schema.Array(Schema.String)),
  requestText: Schema.optional(Schema.String),
  drafts: Schema.optional(Schema.Array(CertificationRequestDraft)),
  customerContextId: Schema.optional(Schema.String),
});
export type CreateCertificationRequestSession = typeof CreateCertificationRequestSession.Type;

export const UpdateCertificationRequestSession = Schema.Struct({
  mode: Schema.optional(CertificationRequestMode),
  activeStep: Schema.optional(Schema.Number),
  intent: Schema.optional(CertificationRequestIntentId),
  expandedIds: Schema.optional(Schema.Array(Schema.String)),
  searchValue: Schema.optional(Schema.String),
  hideUnavailableProducts: Schema.optional(Schema.Boolean),
  selectedProductId: Schema.optional(Schema.String),
  selectedEntryIds: Schema.optional(Schema.Array(Schema.String)),
  requestText: Schema.optional(Schema.String),
  drafts: Schema.optional(Schema.Array(CertificationRequestDraft)),
  customerContextId: Schema.optional(Schema.String),
});
export type UpdateCertificationRequestSession = typeof UpdateCertificationRequestSession.Type;

export const CreateCertificationRequestPackage = Schema.Struct({
  sessionId: Schema.String,
  customerContextId: Schema.optional(Schema.String),
  draftIds: Schema.Array(Schema.String),
  status: Schema.Literals(["draft", "submitted", "activation-pending", "activated"]),
});
export type CreateCertificationRequestPackage = typeof CreateCertificationRequestPackage.Type;

export const UpdateCertificationRequestPackage = Schema.Struct({
  sessionId: Schema.optional(Schema.String),
  customerContextId: Schema.optional(Schema.String),
  draftIds: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(Schema.Literals(["draft", "submitted", "activation-pending", "activated"])),
});
export type UpdateCertificationRequestPackage = typeof UpdateCertificationRequestPackage.Type;
