import type {
  CertifiableRow,
  Certification,
  CertificationLabelKey,
  FlatProductEntry,
  Procedures,
  ProcertusCategorizationDoc,
  TreeNode,
} from './types';

export function getEntryPoints(doc: ProcertusCategorizationDoc): readonly string[] {
  return doc.meta.wizard?.entryPoints?.length ? [...doc.meta.wizard.entryPoints] : [];
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
  return nodes.flatMap(n => {
    if (n.kind === 'group' && n.children?.length) {
      return [n.id, ...collectGroupIds(n.children)];
    }
    return [];
  });
}

export function flattenProducts(
  nodes: readonly TreeNode[],
  pathPrefix: string[]
): FlatProductEntry[] {
  return nodes.flatMap(n => {
    const path = [...pathPrefix, n.label];
    if (n.kind === 'product') {
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
    case 'ce':
      return cert.ce;
    case 'benor':
      return cert.benor;
    case 'atg':
      return cert.atg;
    case 'ssd':
      return cert.ssdInnovationAttest;
  }
}

/** True when a chip should be shown: non-empty and not `/` or `-` (per symbol notes in UI). */
export function hasCertifiableChip(value: string): boolean {
  const v = value.trim();
  if (!v || v === '/' || v === '-') {
    return false;
  }
  return true;
}

export function statusTextWhenNoChip(value: string): string {
  const v = value.trim();
  if (v === '') {
    return 'Momenteel niet aangeboden';
  }
  if (v === '/') {
    return 'Certificatie niet mogelijk';
  }
  if (v === '-') {
    return 'Certificatie niet door ons';
  }
  return v;
}

export function chipVariant(value: string): 'default' | 'secondary' {
  return value.trim() === '(x)' ? 'secondary' : 'default';
}

export function chipDisplay(short: string, value: string): string {
  const v = value.trim();
  if (v === 'x') {
    return short;
  }
  if (v === '(x)') {
    return `${short} · later / federatie`;
  }
  return `${short} · ${v}`;
}

export function hasAnyProcedureData(p: Procedures): boolean {
  return (
    p.procertus.trim().length > 0 || p.partijkeuring.trim().length > 0 || p.epd.trim().length > 0
  );
}

export function productMatchesCertLabel(node: TreeNode, selected: CertificationLabelKey): boolean {
  if (node.kind !== 'product' || !node.certification) {
    return false;
  }
  const v = getCertValue(node.certification, selected);
  return hasCertifiableChip(v);
}

/** Shallow-clone groups with pruned `children` — only branches with certifiable products. */
export function filterClustersByCertLabel(
  nodes: readonly TreeNode[],
  selected: CertificationLabelKey
): TreeNode[] {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    if (node.kind === 'product') {
      if (productMatchesCertLabel(node, selected)) {
        acc.push(node);
      }
      return acc;
    }
    if (node.kind === 'group' && node.children?.length) {
      const nextChildren = filterClustersByCertLabel(node.children, selected);
      if (nextChildren.length > 0) {
        acc.push({ ...node, children: nextChildren });
      }
    }
    return acc;
  }, []);
}

export function getCertifiableRowsForLabel(
  flatProducts: readonly FlatProductEntry[],
  selected: CertificationLabelKey
): CertifiableRow[] {
  return flatProducts
    .map(({ path, node }) => {
      if (node.kind !== 'product' || !node.certification) {
        return null;
      }
      const v = getCertValue(node.certification, selected);
      if (!hasCertifiableChip(v)) {
        return null;
      }
      const pathStr = path.slice(0, -1).join(' › ');
      return { id: node.id, pathStr, label: node.label, value: v };
    })
    .filter((r): r is CertifiableRow => r !== null);
}
