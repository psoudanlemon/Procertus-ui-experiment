import { H1 } from "@procertus-ui/ui";
import { PageHeader } from "@procertus-ui/ui-lib";
import { PrototypeSurfaceMarquee, Separator, Summary } from "@procertus-ui/ui";

import { AppDesignToolbar } from "../components/AppDesignToolbar";
import { BrandGradientHero } from "../components/BrandGradientHero";

export function DesignSystemPage() {
  return (
    <div className="flex w-full max-w-[1400px] flex-col gap-region px-4 py-6 text-left md:px-6 md:py-8 text-foreground">
      <PageHeader
        kicker="Extranet prototype"
        title={<H1>Design system & playground</H1>}
        description="Tokens, merkoppervlak en samenvatting van UI-patronen voor deze demo-omgeving."
      />

      <div className="flex min-w-0 flex-col gap-region">
        <AppDesignToolbar />
        <BrandGradientHero />
        <PrototypeSurfaceMarquee />
        <Separator />
        <Summary className="mx-0 max-w-none" />
      </div>
    </div>
  );
}
