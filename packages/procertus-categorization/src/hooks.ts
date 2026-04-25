import { useMemo } from 'react';
import { filterClustersByCertLabel, getCertifiableRowsForLabel, getEntryPoints } from './helpers';
import { useProcertusCategorization } from './ProcertusCategorizationContext';
import type { CertificationLabelKey, TreeNode } from './types';

export function useProcertusCategorizationDoc() {
  return useProcertusCategorization().doc;
}

export function useProcertusCategorizationMeta() {
  return useProcertusCategorization().doc.meta;
}

/** Wizard entry point ids (e.g. `regulated-certificate`). */
export function useProcertusEntryPoints() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getEntryPoints(doc), [doc]);
}

export function useProcertusClusters() {
  return useProcertusCategorization().doc.clusters;
}

export function useProcertusFlatProducts() {
  return useProcertusCategorization().flatProducts;
}

export function useProcertusGroupIds() {
  return useProcertusCategorization().groupIds;
}

/** O(1) by id; `undefined` if `nodeId` is empty or not found. */
export function useProcertusNodeById(nodeId: string | undefined): TreeNode | undefined {
  const { nodeById } = useProcertusCategorization();
  return useMemo(() => {
    if (nodeId == null || nodeId === '') {
      return undefined;
    }
    return nodeById.get(nodeId);
  }, [nodeById, nodeId]);
}

export function useCertifiableRowsForLabel(selected: CertificationLabelKey) {
  const { flatProducts } = useProcertusCategorization();
  return useMemo(
    () => getCertifiableRowsForLabel(flatProducts, selected),
    [flatProducts, selected]
  );
}

export function useFilteredClustersByCertLabel(selected: CertificationLabelKey) {
  const { doc } = useProcertusCategorization();
  return useMemo(() => filterClustersByCertLabel(doc.clusters, selected), [doc.clusters, selected]);
}
