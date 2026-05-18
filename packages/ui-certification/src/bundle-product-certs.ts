/**
 * Product-bound traject types offered in bundle assembly (wegwijzer + pakket): certifications,
 * PROCERTUS-attest, and catalog-wide EPD. Order matches matrix column preference.
 */
export const BUNDLE_CERT_ORDER = ["benor", "ce", "ssd", "procertus", "epd"] as const;
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
