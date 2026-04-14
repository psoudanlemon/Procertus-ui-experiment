import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  H1,
} from "@procertus-ui/ui";

// ---------------------------------------------------------------------------
// PROCERTUS Logo (SVG asset from public folder)
// ---------------------------------------------------------------------------

function ProcertusLogo({ className }: { className?: string }) {
  return (
    <img
      src="/Procertus logo.svg"
      alt="PROCERTUS — Certification that builds trust"
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthLayoutPanelConfig = {
  image?: string;
  /** Array of image URLs for an auto-rotating carousel. Takes precedence over `image`. */
  images?: string[];
  /** Carousel rotation interval in milliseconds. Defaults to 6000. */
  carouselInterval?: number;
  gradient?: boolean;
  title?: string;
  subtitle?: string;
};

export type AuthLayoutProps = {
  /** The form fields rendered inside the card's content area, or bare content when `card` is false. */
  children: React.ReactNode;
  /** Card title. Ignored when `card` is false. */
  title?: string;
  /** Card description shown below the title. Ignored when `card` is false. */
  description?: React.ReactNode;
  /** Whether to wrap children in a Card shell. Defaults to true. Set to false for status/message pages. */
  card?: boolean;
  /** Logo element. Defaults to the full PROCERTUS wordmark. */
  logo?: React.ReactNode;
  /** Right panel configuration. Pass `false` to hide entirely. */
  panel?: AuthLayoutPanelConfig | false;
  /** Additional className on the outer container. */
  className?: string;
};

// ---------------------------------------------------------------------------
// Image Carousel
// ---------------------------------------------------------------------------

function ImageCarousel({ images, interval = 6000 }: { images: string[]; interval?: number }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 size-full object-cover brightness-90 saturate-[0.3] transition-opacity duration-200 ease-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AuthLayout({
  children,
  title,
  description,
  card: showCard = true,
  logo,
  panel,
  className,
}: AuthLayoutProps) {
  const showPanel = panel !== false;
  const panelConfig: AuthLayoutPanelConfig = typeof panel === "object" ? panel : {};
  const hasImages = panelConfig.images && panelConfig.images.length > 0;
  const useGradient = panelConfig.gradient ?? (!panelConfig.image && !hasImages);

  return (
    <div className={`flex min-h-svh w-full bg-background ${className ?? ""}`}>
      {/* Left panel — form */}
      <div className="flex min-h-svh w-full flex-col items-center p-boundary lg:w-3/5">
        {/* Logo */}
        <div className="flex w-full max-w-sm justify-center">
          {logo ?? (
            <>
              <img src="/Procertus Logo 1.png" alt="PROCERTUS — Certification that builds trust" className="h-16 w-auto dark:hidden" />
              <img src="/Procertus Logo 2.png" alt="PROCERTUS — Certification that builds trust" className="hidden h-16 w-auto dark:block" />
            </>
          )}
        </div>

        <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-component">
          {/* Content */}
          {showCard ? (
            <Card className="gap-section py-section shadow-[var(--shadow-proc-md)] ring-0">
              <CardHeader className="gap-0 px-section text-center">
                <H1>{title}</H1>
                {description && <p className="text-base leading-[1.4] text-muted-foreground mt-micro">{description}</p>}
              </CardHeader>
              <CardContent className="px-section">{children}</CardContent>
            </Card>
          ) : (
            children
          )}

        </div>
      </div>

      {/* Right panel — branded visual */}
      {showPanel && (
        <div className="relative my-boundary mr-boundary hidden flex-1 overflow-hidden rounded-sm rounded-tr-[40%] rounded-bl-[40%] lg:flex">
          {hasImages ? (
            <ImageCarousel images={panelConfig.images!} interval={panelConfig.carouselInterval} />
          ) : panelConfig.image ? (
            <img
              src={panelConfig.image}
              alt=""
              className="absolute inset-0 size-full object-cover brightness-[0.85] saturate-[0.6]"
            />
          ) : useGradient ? (
            <div className="absolute inset-0 bg-[image:var(--background-image-gradient-procertus-hero)]" />
          ) : null}

          {/* Gradient overlays — soften images into the page */}
          {(hasImages || panelConfig.image) && (
            <>
              {/* Brand colour wash */}
              <div className="pointer-events-none absolute inset-0 z-[1] bg-[var(--brand-primary-900)]/45 mix-blend-multiply dark:bg-[var(--brand-primary-950)]/60" />
              {/* Diagonal fade into page background */}
              <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom_right,var(--color-background)_10%,transparent_70%)] opacity-60 dark:opacity-100" />
            </>
          )}

          {(panelConfig.title || panelConfig.subtitle) && (
            <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-[var(--brand-primary-950)]/80 via-[var(--brand-primary-900)]/40 to-transparent px-section pb-18 pt-20">
              {panelConfig.title && (
                <h2 className="text-xl font-semibold text-white">{panelConfig.title}</h2>
              )}
              {panelConfig.subtitle && (
                <p className="mt-micro text-sm text-white/60">{panelConfig.subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { AuthLayout, ProcertusLogo };
