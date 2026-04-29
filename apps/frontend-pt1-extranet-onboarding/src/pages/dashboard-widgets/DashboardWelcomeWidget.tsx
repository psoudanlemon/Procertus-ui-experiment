import { H1 } from "@procertus-ui/ui";

export function DashboardWelcomeWidget() {
  return (
    <header className="pb-region">
      <div className="flex flex-col gap-region sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-micro text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Extranet prototype
          </p>
          <H1>Welkom op het PROCERTUS klantenportaal</H1>
          <p className="leading-relaxed text-muted-foreground">
            Overzicht van uw sessie, organisatie en certificatie-aanvragen zoals in deze demo
            beschikbaar zijn.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-start sm:justify-end">
          <img
            src="/Procertus Logo with tagline.svg"
            alt="Procertus"
            className="h-16 w-auto max-w-[min(100%,240px)] object-contain sm:h-18"
          />
        </div>
      </div>
    </header>
  );
}
