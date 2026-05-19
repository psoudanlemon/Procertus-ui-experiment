import { P } from "@procertus-ui/ui";
import { type ReactNode } from "react";

export type PublicOverviewSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Shared bordered card sections for standalone public confirmation pages (`StatusPage` children). */
export function PublicOverviewSection(props: PublicOverviewSectionProps) {
  return (
    <section className="flex w-full flex-col gap-section rounded-xl border border-border bg-card p-section text-card-foreground text-left shadow-none">
      <div className="flex flex-col gap-micro">
        <h2 className="m-0 text-heading-lg font-semibold tracking-tight text-heading-foreground">
          {props.title}
        </h2>
        {props.description ? (
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">{props.description}</P>
        ) : null}
      </div>
      {props.children}
    </section>
  );
}
