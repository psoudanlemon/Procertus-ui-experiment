/**
 * Default document: `src/data/procertus-categorization.json` (see `meta.source` in the file).
 * Upstream rebuild (procertus-docs):
 * `bun run apps/frontend-docs/scripts/build-procertus-categorization.ts`
 * — copy the generated JSON into this package when the decision tree changes.
 */

import procertusCategorizationJson from './data/procertus-categorization.json';
import type { ProcertusCategorizationDoc } from './types';

export const defaultProcertusCategorizationDoc: ProcertusCategorizationDoc =
  procertusCategorizationJson as ProcertusCategorizationDoc;
