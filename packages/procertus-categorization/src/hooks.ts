import { useMemo } from "react";
import {
  filterClustersByAttestation,
  filterClustersByCertLabel,
  getAvailableEntries,
  getCertifiableRowsForLabel,
  getEntryPoints,
  getFreeformRequestEntries,
  getProductCatalog,
  getProductLinkedEntries,
  getProductsForAttestation,
} from "./helpers";
import { useProcertusCategorization } from "./ProcertusCategorizationContext";
import type { CertificationLabelKey, ProductAttestationKey, TreeNode } from "./types";

export function useProcertusCategorizationDoc() {
  return useProcertusCategorization().doc;
}

export function useProcertusCategorizationMeta() {
  return useProcertusCategorization().doc.meta;
}

/** Wizard entry point ids (e.g. `product-certification`, `atg`). */
export function useProcertusEntryPoints() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getEntryPoints(doc), [doc]);
}

export function useProcertusAvailableEntries() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getAvailableEntries(doc), [doc]);
}

export function useProcertusProductLinkedEntries() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getProductLinkedEntries(doc), [doc]);
}

export function useProcertusFreeformRequestEntries() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getFreeformRequestEntries(doc), [doc]);
}

export function useProcertusClusters() {
  return useProcertusCategorization().doc.clusters;
}

export function useProcertusProductCatalog() {
  const { doc } = useProcertusCategorization();
  return useMemo(() => getProductCatalog(doc), [doc]);
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
    if (nodeId == null || nodeId === "") {
      return undefined;
    }
    return nodeById.get(nodeId);
  }, [nodeById, nodeId]);
}

export function useCertifiableRowsForLabel(selected: CertificationLabelKey) {
  const { flatProducts } = useProcertusCategorization();
  return useMemo(
    () => getCertifiableRowsForLabel(flatProducts, selected),
    [flatProducts, selected],
  );
}

export function useProductsForAttestation(selected: ProductAttestationKey) {
  const { flatProducts } = useProcertusCategorization();
  return useMemo(() => getProductsForAttestation(flatProducts, selected), [flatProducts, selected]);
}

export function useFilteredClustersByCertLabel(selected: CertificationLabelKey) {
  const { doc } = useProcertusCategorization();
  return useMemo(() => filterClustersByCertLabel(doc.clusters, selected), [doc.clusters, selected]);
}

export function useFilteredClustersByAttestation(selected: ProductAttestationKey) {
  const { doc } = useProcertusCategorization();
  return useMemo(
    () => filterClustersByAttestation(doc.clusters, selected),
    [doc.clusters, selected],
  );
}
