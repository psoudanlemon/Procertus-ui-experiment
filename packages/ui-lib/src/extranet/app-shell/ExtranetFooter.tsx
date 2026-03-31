import * as React from "react";

import { cn, Separator } from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FooterLinkGroup = {
  title: string;
  links: { label: string; url: string }[];
};

export type CompanyDetail = {
  /** The text or label to display. */
  label: string;
  /** Optional URL — renders the detail as a link. */
  url?: string;
};

export type ExtranetFooterProps = {
  /** App logo — render any React node. */
  logo?: React.ReactNode;
  /** Tagline shown below the logo. */
  tagline?: string;
  /** Grouped link columns (shown in full/expanded mode). */
  linkGroups?: FooterLinkGroup[];
  /** Legal/bottom-bar links (privacy, terms, etc.). */
  legalLinks?: { label: string; url: string }[];
  /** Compact company info line — displayed as a single bar with bullet separators. */
  companyDetails?: CompanyDetail[];
  /** Copyright notice — defaults to current year + Procertus. */
  copyright?: string;
  /** Visual variant — "default" uses sidebar tokens, "transparent" uses background. */
  variant?: "default" | "transparent";
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ExtranetFooter({
  logo,
  tagline,
  linkGroups = [],
  legalLinks = [],
  companyDetails = [],
  copyright = `\u00A9 ${new Date().getFullYear()} Procertus. Alle rechten voorbehouden.`,
  variant = "default",
}: ExtranetFooterProps) {
  return (
    <footer data-slot="extranet-footer">
      {/* Expanded footer — link groups, logo, tagline */}
      {(logo || tagline || linkGroups.length > 0) && (
        <div className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(auto-fit,1fr)]">
              <div className="flex flex-col gap-3">
                {logo && <div className="flex items-center gap-2.5">{logo}</div>}
                {tagline && (
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {tagline}
                  </p>
                )}
              </div>

              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Company info bar */}
      <div className={cn(
        "border-t",
        variant === "transparent"
          ? "border-border bg-background text-foreground"
          : "border-sidebar-border bg-sidebar text-sidebar-foreground",
      )}>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 px-4 py-4 text-xs leading-relaxed text-sidebar-foreground/60 sm:px-6">
          {companyDetails.map((detail, index) => (
            <React.Fragment key={detail.label}>
              {index > 0 && (
                <span className="text-sidebar-foreground/30" aria-hidden>
                  &bull;
                </span>
              )}
              {detail.url ? (
                <a
                  href={detail.url}
                  className="text-sidebar-accent-foreground transition-colors hover:text-sidebar-foreground"
                >
                  {detail.label}
                </a>
              ) : (
                <span>{detail.label}</span>
              )}
            </React.Fragment>
          ))}
          {legalLinks.map((link) => (
            <React.Fragment key={link.label}>
              {(companyDetails.length > 0 || legalLinks.indexOf(link) > 0) && (
                <span className="text-sidebar-foreground/30" aria-hidden>
                  &bull;
                </span>
              )}
              <a
                href={link.url}
                className="text-sidebar-accent-foreground transition-colors hover:text-sidebar-foreground"
              >
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}

export { ExtranetFooter };
