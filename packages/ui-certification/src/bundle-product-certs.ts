/**
 * Product-bound certification types offered in traject bundle assembly (wegwijzer + pakket).
 * Order matches matrix column preference for stable layouts.
 */
export const BUNDLE_CERT_ORDER = ["benor", "ce", "ssd", "procertus"] as const;
export type BundleCertKey = (typeof BUNDLE_CERT_ORDER)[number];

/**
 * Extra cert columns for the bundle matrix: package {@link primaryCert} is excluded, and a
 * column is kept only when at least one product lists that cert in {@link availableBundleCerts}.
 */
export function bundleMatrixExtraColumnKeys(
  primaryCert: BundleCertKey,
  products: ReadonlyArray<{ availableBundleCerts: readonly BundleCertKey[] }>,
): BundleCertKey[] {
  return BUNDLE_CERT_ORDER.filter(
    (c) =>
      c !== primaryCert &&
      products.some((p) => p.availableBundleCerts.includes(c)),
  );
}
