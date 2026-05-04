import * as React from "react";

import { cn } from "@/lib/utils";

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
  /** Optional URL, renders the detail as a link. */
  url?: string;
};

export type FooterProps = {
  /** App logo, render any React node. */
  logo?: React.ReactNode;
  /** Tagline shown below the logo. */
  tagline?: string;
  /** Grouped link columns (shown in full/expanded mode). */
  linkGroups?: FooterLinkGroup[];
  /** Legal/bottom-bar links (privacy, terms, etc.). */
  legalLinks?: { label: string; url: string }[];
  /** Compact company info line, displayed as a single bar with bullet separators. */
  companyDetails?: CompanyDetail[];
  /** Copyright notice, defaults to current year + PROCERTUS. */
  copyright?: string;
  /** Visual variant. "default" uses sidebar tokens, "transparent" uses background. */
  variant?: "default" | "transparent";
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Footer({
  logo,
  tagline,
  linkGroups = [],
  legalLinks = [],
  companyDetails = [],
  copyright = `© ${new Date().getFullYear()} PROCERTUS. Alle rechten voorbehouden.`,
  variant = "default",
}: FooterProps) {
  return (
    <footer data-slot="footer">
      {/* Expanded footer, link groups, logo, tagline */}
      {(logo || tagline || linkGroups.length > 0) && (
        <div className="bg-card">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-section py-region md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(auto-fit,1fr)]">
              <div className="flex flex-col gap-section">
                {logo && <div className="flex items-center gap-component">{logo}</div>}
                {tagline && (
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {tagline}
                  </p>
                )}
              </div>

              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-section text-sm font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-component">
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
      <div
        className={cn(
          variant === "transparent"
            ? "bg-background text-foreground"
            : "bg-sidebar text-sidebar-foreground",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-micro gap-y-micro px-section py-section text-xs leading-relaxed text-sidebar-foreground/60">
          {companyDetails.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-micro">
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
            </div>
          )}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-micro">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  {index > 0 && (
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
          )}
        </div>
      </div>
    </footer>
  );
}

export { Footer };
