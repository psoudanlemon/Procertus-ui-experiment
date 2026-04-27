import type {
  CertifiableRow,
  AvailableEntry,
  Certification,
  CertificationLabelKey,
  FlatProductEntry,
  ProductAttestationKey,
  ProductAttestations,
  ProcertusCategorizationDoc,
  TreeNode,
} from "./types";

export function getEntryPoints(doc: ProcertusCategorizationDoc): readonly string[] {
  return doc.meta.wizard?.entryPoints?.length ? [...doc.meta.wizard.entryPoints] : [];
}

export function getAvailableEntries(doc: ProcertusCategorizationDoc): readonly AvailableEntry[] {
  return doc.meta.availableEntries?.length ? [...doc.meta.availableEntries] : [];
}

export function getProductCatalog(doc: ProcertusCategorizationDoc): readonly TreeNode[] {
  return doc.clusters;
}

export function getProductLinkedEntries(
  doc: ProcertusCategorizationDoc,
): readonly AvailableEntry[] {
  return getAvailableEntries(doc).filter((entry) => entry.productAvailabilityKey != null);
}

export function getFreeformRequestEntries(
  doc: ProcertusCategorizationDoc,
): readonly AvailableEntry[] {
  return getAvailableEntries(doc).filter((entry) => entry.primaryInput === "freeform-context");
}

/** Depth-first: every node id → node (mutates the given map). */
function walkNodes(nodes: readonly TreeNode[], out: Map<string, TreeNode>): void {
  for (const n of nodes) {
    out.set(n.id, n);
    if (n.children?.length) {
      walkNodes(n.children, out);
    }
  }
}

export function buildNodeByIdMap(clusters: readonly TreeNode[]): ReadonlyMap<string, TreeNode> {
  const m = new Map<string, TreeNode>();
  walkNodes(clusters, m);
  return m;
}

function findNodeInTree(nodes: readonly TreeNode[], id: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) {
      return n;
    }
    if (n.children?.length) {
      const f = findNodeInTree(n.children, id);
      if (f) {
        return f;
      }
    }
  }
  return undefined;
}

export function findNodeById(doc: ProcertusCategorizationDoc, id: string): TreeNode | undefined {
  return findNodeInTree(doc.clusters, id);
}

export function collectGroupIds(nodes: readonly TreeNode[]): string[] {
  return nodes.flatMap((n) => {
    if (n.kind === "group" && n.children?.length) {
      return [n.id, ...collectGroupIds(n.children)];
    }
    return [];
  });
}

export function flattenProducts(
  nodes: readonly TreeNode[],
  pathPrefix: string[],
): FlatProductEntry[] {
  return nodes.flatMap((n) => {
    const path = [...pathPrefix, n.label];
    if (n.kind === "product") {
      return [{ path, node: n }];
    }
    if (n.children?.length) {
      return flattenProducts(n.children, path);
    }
    return [];
  });
}

export function getCertValue(cert: Certification, key: CertificationLabelKey): string {
  switch (key) {
    case "ce":
      return cert.ce;
    case "benor":
      return cert.benor;
    case "ssd":
      return cert.ssd;
  }
}

export function getProductAttestationValue(
  attestations: ProductAttestations,
  key: ProductAttestationKey,
): string {
  switch (key) {
    case "atg":
      return attestations.atg;
    case "procertus":
      return attestations.procertus;
    case "epd":
      return attestations.epd;
  }
}

/** True when a chip should be shown: non-empty and not `/` or `-` (per symbol notes in UI). */
export function hasCertifiableChip(value: string): boolean {
  const v = value.trim();
  if (!v || v === "/" || v === "-") {
    return false;
  }
  return true;
}

export function statusTextWhenNoChip(value: string): string {
  const v = value.trim();
  if (v === "") {
    return "Momenteel niet aangeboden";
  }
  if (v === "/") {
    return "Certificatie niet mogelijk";
  }
  if (v === "-") {
    return "Certificatie niet door ons";
  }
  return v;
}

export function chipVariant(value: string): "default" | "secondary" {
  return value.trim() === "(x)" ? "secondary" : "default";
}

export function chipDisplay(short: string, value: string): string {
  const v = value.trim();
  if (v === "x") {
    return short;
  }
  if (v === "(x)") {
    return `${short} · later / federatie`;
  }
  return `${short} · ${v}`;
}

export function hasAnyProductAttestationData(attestations: ProductAttestations): boolean {
  return (
    attestations.atg.trim().length > 0 ||
    attestations.procertus.trim().length > 0 ||
    attestations.epd.trim().length > 0
  );
}

/** @deprecated Use {@link hasAnyProductAttestationData}. */
export const hasAnyProcedureData = hasAnyProductAttestationData;

export function productMatchesCertLabel(node: TreeNode, selected: CertificationLabelKey): boolean {
  if (node.kind !== "product" || !node.certification) {
    return false;
  }
  const v = getCertValue(node.certification, selected);
  return hasCertifiableChip(v);
}

export function productMatchesAttestation(
  node: TreeNode,
  selected: ProductAttestationKey,
): boolean {
  if (node.kind !== "product" || !node.attestations) {
    return false;
  }
  const v = getProductAttestationValue(node.attestations, selected);
  return hasCertifiableChip(v);
}

/** Shallow-clone groups with pruned `children` — only branches with certifiable products. */
export function filterClustersByCertLabel(
  nodes: readonly TreeNode[],
  selected: CertificationLabelKey,
): TreeNode[] {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    if (node.kind === "product") {
      if (productMatchesCertLabel(node, selected)) {
        acc.push(node);
      }
      return acc;
    }
    if (node.kind === "group" && node.children?.length) {
      const nextChildren = filterClustersByCertLabel(node.children, selected);
      if (nextChildren.length > 0) {
        acc.push({ ...node, children: nextChildren });
      }
    }
    return acc;
  }, []);
}

/** Shallow-clone groups with pruned `children` — only branches with product-linked attestations. */
export function filterClustersByAttestation(
  nodes: readonly TreeNode[],
  selected: ProductAttestationKey,
): TreeNode[] {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    if (node.kind === "product") {
      if (productMatchesAttestation(node, selected)) {
        acc.push(node);
      }
      return acc;
    }
    if (node.kind === "group" && node.children?.length) {
      const nextChildren = filterClustersByAttestation(node.children, selected);
      if (nextChildren.length > 0) {
        acc.push({ ...node, children: nextChildren });
      }
    }
    return acc;
  }, []);
}

export function getCertifiableRowsForLabel(
  flatProducts: readonly FlatProductEntry[],
  selected: CertificationLabelKey,
): CertifiableRow[] {
  return flatProducts
    .map(({ path, node }) => {
      if (node.kind !== "product" || !node.certification) {
        return null;
      }
      const v = getCertValue(node.certification, selected);
      if (!hasCertifiableChip(v)) {
        return null;
      }
      const pathStr = path.slice(0, -1).join(" › ");
      return { id: node.id, pathStr, label: node.label, value: v };
    })
    .filter((r): r is CertifiableRow => r !== null);
}

export function getProductsForAttestation(
  flatProducts: readonly FlatProductEntry[],
  selected: ProductAttestationKey,
): CertifiableRow[] {
  return flatProducts
    .map(({ path, node }) => {
      if (node.kind !== "product" || !node.attestations) {
        return null;
      }
      const v = getProductAttestationValue(node.attestations, selected);
      if (!hasCertifiableChip(v)) {
        return null;
      }
      const pathStr = path.slice(0, -1).join(" › ");
      return { id: node.id, pathStr, label: node.label, value: v };
    })
    .filter((r): r is CertifiableRow => r !== null);
}
