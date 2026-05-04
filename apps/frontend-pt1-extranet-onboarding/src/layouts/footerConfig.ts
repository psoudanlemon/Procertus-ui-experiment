import type { FooterProps } from "@procertus-ui/ui";

/**
 * Shared footer config for both the authenticated and public application
 * shells, so the chrome stays consistent across the whole app.
 */
export const APP_FOOTER: FooterProps = {
  companyDetails: [
    { label: "© 2026 PROCERTUS asbl/vzw" },
    { label: "TVA/BTW: BE 1000.472.054" },
  ],
  legalLinks: [
    { label: "Privacy policy", url: "#" },
    { label: "Contact", url: "#" },
  ],
};
