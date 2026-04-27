/**
 * Procertus process / product categorization: types aligned to
 * `src/data/procertus-categorization.json` in this package (see {@link ProcertusCategorizationDoc}).
 */

export type Certification = {
  ce: string;
  benor: string;
  ssd: string;
};

export type ProductAttestations = {
  atg: string;
  procertus: string;
  epd: string;
};

/** @deprecated Use {@link ProductAttestations}; kept for older consumers while the prototype migrates. */
export type Procedures = ProductAttestations;

export type TreeNodeKind = "group" | "product";

export type TreeNode = {
  id: string;
  kind: TreeNodeKind;
  label: string;
  productTypeStreamLabel?: string;
  children?: TreeNode[];
  certification?: Certification;
  attestations?: ProductAttestations;
};

export type ProcertusSpreadsheetSource = {
  readonly spreadsheetExport: {
    fileName: string;
    sheetName?: string;
    exportedAt?: string;
    notes?: string;
  };
};

export type WizardEntryPoint =
  | "product-certification"
  | "atg"
  | "innovation-attest"
  | "procertus"
  | "epd"
  | "partijkeuring"
  | (string & {});

export type CertificationLabelKey = "ce" | "benor" | "ssd";

export type ProductAttestationKey = "atg" | "procertus" | "epd";

export type AvailableEntryKey =
  | CertificationLabelKey
  | ProductAttestationKey
  | "innovation-attest"
  | "partijkeuring"
  | (string & {});

export type AvailableEntryCategory = "certification" | "attest" | "document" | "inspection";

export type AvailableEntry = {
  id: AvailableEntryKey;
  category: AvailableEntryCategory;
  shortLabel: string;
  label: string;
  primaryInput: "product-selection" | "freeform-context";
  productRelation: "required" | "optional";
  productAvailabilityKey?: CertificationLabelKey | ProductAttestationKey;
  description: string;
};

export type ProcertusCategorizationMeta = {
  schemaVersion: string;
  treeVersion: string;
  canonicalLocale: string;
  source: ProcertusSpreadsheetSource;
  wizard?: { entryPoints?: readonly WizardEntryPoint[] };
  availableEntries?: readonly AvailableEntry[];
};

export type ProcertusCategorizationDoc = {
  meta: ProcertusCategorizationMeta;
  clusters: readonly TreeNode[];
};

export type FlatProductEntry = {
  path: string[];
  node: TreeNode;
};

export type CertifiableRow = {
  id: string;
  pathStr: string;
  label: string;
  value: string;
};
