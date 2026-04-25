/**
 * Procertus process / product categorization: types aligned to
 * `src/data/procertus-categorization.json` in this package (see {@link ProcertusCategorizationDoc}).
 */

export type Certification = {
  ce: string;
  benor: string;
  atg: string;
  ssdInnovationAttest: string;
};

export type Procedures = {
  procertus: string;
  partijkeuring: string;
  epd: string;
};

export type TreeNodeKind = 'group' | 'product';

export type TreeNode = {
  id: string;
  kind: TreeNodeKind;
  label: string;
  productTypeStreamLabel?: string;
  children?: TreeNode[];
  certification?: Certification;
  procedures?: Procedures;
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
  | 'regulated-certificate'
  | 'atg-attest'
  | 'innovation-attest-ssd'
  | (string & {});

export type ProcertusCategorizationMeta = {
  schemaVersion: string;
  treeVersion: string;
  canonicalLocale: string;
  source: ProcertusSpreadsheetSource;
  wizard?: { entryPoints?: readonly WizardEntryPoint[] };
};

export type ProcertusCategorizationDoc = {
  meta: ProcertusCategorizationMeta;
  clusters: readonly TreeNode[];
};

export type CertificationLabelKey = 'ce' | 'benor' | 'atg' | 'ssd';

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
