import { Empty, EmptyDescription, EmptyIcon, EmptyTitle, iconStroke } from "@procertus-ui/ui";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

export function AppPlaceholderPage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: IconSvgElement;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto px-4 py-6">
      <Empty className="min-h-[320px] max-w-[400px]">
        <EmptyIcon>
          <HugeiconsIcon icon={icon} size={24} strokeWidth={iconStroke(24)} />
        </EmptyIcon>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description} Deze sectie is alvast opgenomen in de navigatiestructuur en komt binnenkort
          beschikbaar.
        </EmptyDescription>
      </Empty>
    </div>
  );
}
