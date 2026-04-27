import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { defaultProcertusCategorizationDoc } from './categorization-data';
import { buildNodeByIdMap, collectGroupIds, flattenProducts } from './helpers';
import type { FlatProductEntry, ProcertusCategorizationDoc, TreeNode } from './types';

export type ProcertusCategorizationValue = {
  /** Full document (meta + clusters). */
  doc: ProcertusCategorizationDoc;
  /** All nodes (group + product) for O(1) lookup. */
  nodeById: ReadonlyMap<string, TreeNode>;
  /** Product leaves with full label path from the cluster roots. */
  flatProducts: readonly FlatProductEntry[];
  /** `group` node ids, depth-first, for expand/collapse helpers. */
  groupIds: readonly string[];
};

const ProcertusCategorizationContext = createContext<ProcertusCategorizationValue | null>(null);

function useBuildValue(doc: ProcertusCategorizationDoc): ProcertusCategorizationValue {
  return useMemo(() => {
    const flatProducts = flattenProducts(doc.clusters, []);
    return {
      doc,
      nodeById: buildNodeByIdMap(doc.clusters),
      flatProducts,
      groupIds: collectGroupIds(doc.clusters),
    };
  }, [doc]);
}

export type ProcertusCategorizationProviderProps = {
  children: ReactNode;
  /** Optional override (e.g. tests or a future CMS-backed snapshot). */
  doc?: ProcertusCategorizationDoc;
};

export function ProcertusCategorizationProvider({
  children,
  doc: docProp,
}: ProcertusCategorizationProviderProps) {
  const doc = docProp ?? defaultProcertusCategorizationDoc;
  const value = useBuildValue(doc);
  return (
    <ProcertusCategorizationContext.Provider value={value}>
      {children}
    </ProcertusCategorizationContext.Provider>
  );
}

export function useProcertusCategorization(): ProcertusCategorizationValue {
  const ctx = useContext(ProcertusCategorizationContext);
  if (ctx == null) {
    throw new Error(
      'useProcertusCategorization must be used within ProcertusCategorizationProvider'
    );
  }
  return ctx;
}
