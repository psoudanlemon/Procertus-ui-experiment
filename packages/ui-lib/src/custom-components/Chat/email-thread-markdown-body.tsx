import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const inlineCodeClass = "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground";

/** Allow only safe link schemes for rendered dossier markdown. */
function sanitizeHref(href: string | undefined): string | undefined {
  if (href == null || href.trim() === "") return undefined;
  const raw = href.trim();
  try {
    const u = new URL(
      raw,
      typeof window !== "undefined" ? window.location.origin : "https://dummy.local/",
    );
    const protocol = u.protocol.replace(/:$/, "").toLowerCase();
    if (protocol === "http" || protocol === "https" || protocol === "mailto") {
      return u.toString();
    }
    if (raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../")) return raw;
  } catch {
    return undefined;
  }
  return undefined;
}

const mdComponents = {
  p({ children }: { children?: ReactNode }) {
    return <p className="mb-3 text-sm leading-relaxed last:mb-0">{children}</p>;
  },
  strong({ children }: { children?: ReactNode }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  em({ children }: { children?: ReactNode }) {
    return <em>{children}</em>;
  },
  del({ children }: { children?: ReactNode }) {
    return <del className="opacity-85">{children}</del>;
  },
  a({ href, children }: { href?: string; children?: ReactNode }) {
    const safe = sanitizeHref(href);
    if (!safe) return <span className="text-muted-foreground">{children}</span>;
    return (
      <a
        href={safe}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  ul({ children }: { children?: ReactNode }) {
    return <ul className="mb-3 list-disc pl-6 text-sm leading-relaxed last:mb-0">{children}</ul>;
  },
  ol({ children }: { children?: ReactNode }) {
    return <ol className="mb-3 list-decimal pl-6 text-sm leading-relaxed last:mb-0">{children}</ol>;
  },
  li({ children }: { children?: ReactNode }) {
    return <li className="mt-1.5">{children}</li>;
  },
  blockquote({ children }: { children?: ReactNode }) {
    return (
      <blockquote className="mb-3 border-l-2 border-muted-foreground/35 pl-3 text-muted-foreground last:mb-0 [&_p]:text-muted-foreground">
        {children}
      </blockquote>
    );
  },
  code(props: { inline?: boolean; children?: ReactNode }) {
    if (props.inline) {
      return <code className={inlineCodeClass}>{props.children}</code>;
    }
    return (
      <code
        className={cn(
          inlineCodeClass,
          "my-3 block whitespace-pre-wrap p-3 text-[0.8rem] leading-snug",
        )}
      >
        {props.children}
      </code>
    );
  },
  pre({ children }: { children?: ReactNode }) {
    return (
      <pre className="my-3 overflow-x-auto rounded-md border border-border bg-muted/40 text-[0.8rem]">
        {children}
      </pre>
    );
  },
  h2({ children }: { children?: ReactNode }) {
    return <h2 className="mb-2 text-sm font-semibold tracking-tight">{children}</h2>;
  },
  h3({ children }: { children?: ReactNode }) {
    return <h3 className="mb-2 text-sm font-semibold tracking-tight">{children}</h3>;
  },
  hr() {
    return <hr className="my-4 border-border" />;
  },
} satisfies Components;

export type EmailThreadMarkdownBodyProps = {
  markdown: string;
  className?: string;
};

/**
 * Render thread message markdown (GFM) — read-only counterpart to TipTap-authored bodies.
 */
export function EmailThreadMarkdownBody({ markdown, className }: EmailThreadMarkdownBodyProps) {
  return (
    <div className={cn("email-thread-markdown text-card-foreground", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {markdown}
      </Markdown>
    </div>
  );
}
