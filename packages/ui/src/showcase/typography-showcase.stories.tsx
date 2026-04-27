import type { Meta, StoryObj } from "@storybook/react-vite";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Dollar01Icon,
  HelpCircleIcon,
  CompassIcon,
  Invoice01Icon,
  Setting06Icon,
  UserGroupIcon,
  BarChartIcon,
  BookOpen01Icon,
  PackageIcon,
  CodeIcon,
  Database01Icon,
  GitBranchIcon,
  HierarchyFilesIcon,
  AiNetworkIcon,
  ColorPickerIcon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { H1, H2, H3, H4 } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { P, Muted, Blockquote, List } from "@/components/ui/typography";

import { ManagementAppShell } from "@/components/app-shell";
import type { Workspace, NavItem, NavGroup } from "@/components/app-sidebar";

/* ---------------------------------------------------------------------------
 * Registry Detail View — Hierarchy Demo
 * ------------------------------------------------------------------------- */

function RegistryDetailView() {
  return (
    <div className="min-h-svh bg-background">
      <div className="px-8 py-10">
        <div className="mx-auto max-w-[800px] rounded-xl border border-border bg-card p-10 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            Record ID: PR-9942-X
          </span>

          <H1 className="mt-2 mb-6">
            Aalst Industrial Safety Certification
          </H1>

          <Separator className="mb-6" />

          <div className="mb-8 grid grid-cols-2 gap-x-12 gap-y-4 md:grid-cols-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Status
              </span>
              <Badge variant="success">Active</Badge>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Issue Date
              </span>
              <span className="text-base font-semibold text-foreground">
                12 Mar 2025
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Expiry
              </span>
              <span className="text-base font-semibold text-foreground">
                11 Mar 2028
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Authority
              </span>
              <span className="text-base font-semibold text-foreground">
                BELAC
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary-500 block mb-3">
              Authority Statement
            </span>
            <P>
              This certification confirms that Aalst Industrial Safety NV has
              met all requirements under ISO 45001:2018 for Occupational Health
              and Safety Management Systems. The scope covers fabrication,
              assembly, and quality inspection of industrial pressure vessels and
              structural steel components. This record is maintained by the
              Belgian Accreditation Body (BELAC) and is subject to annual
              surveillance audits.
            </P>
            <Muted className="mt-4">
              Last audited on 28 November 2025 by Lead Auditor K. Vandenberghe.
              Next surveillance audit scheduled for 15 January 2027.
            </Muted>
          </div>

          <div className="mt-8">
            <H2 className="mb-4">Scope of Certification</H2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Pressure vessel fabrication (EN 13445)",
                "Structural steel assembly (EN 1090-2, EXC3)",
                "Non-destructive testing coordination",
                "Welding quality management (ISO 3834-2)",
              ].map((scope) => (
                <div
                  key={scope}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--brand-accent-400)" }}
                  />
                  <span className="text-sm text-foreground">{scope}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Management Shell — Architecture Demo
 * ------------------------------------------------------------------------- */

const procertusLogo = (
  <img
    src="/logomark.svg"
    alt="PROCERTUS"
    className="size-full rounded-sm"
  />
);

const managementSidebarProps = {
  workspaces: [
    { id: "1", name: "PROCERTUS", logo: procertusLogo, plan: "Certification platform" },
  ] as Workspace[],
  activeWorkspaceId: "1",
  navItems: [
    { title: "Roadmap", url: "#", icon: CompassIcon },
    { title: "Budget", url: "#", icon: Dollar01Icon },
    { title: "Meetings", url: "#", icon: Calendar01Icon },
    { title: "People", url: "#", icon: UserGroupIcon },
    { title: "Invoicing", url: "#", icon: Invoice01Icon },
  ] as NavItem[],
  navGroups: [
    {
      label: "Registry",
      items: [
        {
          title: "Certificates", url: "#", icon: BarChartIcon, isActive: true,
          items: [
            { title: "Overview", url: "#" },
            { title: "Pending", url: "#", isActive: true },
            { title: "Expiring", url: "#" },
          ],
        },
        {
          title: "Standards", url: "#", icon: ColorPickerIcon,
          items: [
            { title: "ISO 9001", url: "#" },
            { title: "ISO 14001", url: "#" },
            { title: "ISO 45001", url: "#" },
          ],
        },
      ],
    },
    {
      label: "Compliance",
      items: [
        { title: "Audit schedule", url: "#", icon: Database01Icon, isActive: true },
        { title: "Non-conformities", url: "#", icon: AiNetworkIcon },
      ],
    },
    {
      label: "Coming soon",
      maxVisible: 3,
      items: [
        { title: "User stories", url: "#", icon: HierarchyFilesIcon },
        { title: "Event models", url: "#", icon: FlashIcon },
        { title: "Prototypes", url: "#", icon: PackageIcon },
        { title: "Context maps", url: "#", icon: GitBranchIcon },
        { title: "DAL playground", url: "#", icon: CodeIcon },
        { title: "API docs", url: "#", icon: BookOpen01Icon },
        { title: "Guides", url: "#", icon: BookOpen01Icon },
      ],
    },
  ] as NavGroup[],
  secondaryItems: [
    { title: "Settings", url: "#", icon: Setting06Icon },
    { title: "Help", url: "#", icon: HelpCircleIcon },
  ] as NavItem[],
  showSearch: false,
};

const managementHeaderProps = {
  showNavigation: false,
  breadcrumbs: [
    { label: "Dashboard", href: "#" },
    { label: "Registry", href: "#" },
    { label: "Certificates", href: "#" },
    { label: "Pending" },
  ],
  canGoBack: true,
  canGoForward: false,
  user: {
    name: "K. Vandenberghe",
    email: "k.vandenberghe@procertus.be",
    role: "Lead Auditor",
  },
  version: "Webapp: V10.00.00  Api: V10.00.00",
};

/* ---------------------------------------------------------------------------
 * Long-form Content
 * ------------------------------------------------------------------------- */

function TypographyShowcase() {
  return (
    <div className="mx-auto max-w-[680px] space-y-6 py-16">
      <H1>The joke tax chronicles</H1>
      <P>
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </P>

      <H2>The king's plan</H2>
      <P>
        The king thought long and hard, and finally came up with{" "}
        <a
          href="#"
          className="font-medium text-foreground underline underline-offset-4"
        >
          a brilliant plan
        </a>
        : he would tax the jokes in the kingdom.
      </P>
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair
        that they should pay for the privilege."
      </Blockquote>

      <H3>The joke tax</H3>
      <P>
        The king's subjects were not amused. They grumbled and complained, but
        the king was firm:
      </P>
      <List>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </List>
      <P>
        As a result, people stopped telling jokes, and the kingdom fell into a
        gloom. But there was one person who refused to let the king's foolishness
        get him down: a court jester named Jokester.
      </P>

      <H3>Jokester's revolt</H3>
      <P>
        Jokester began sneaking into the castle in the middle of the night and
        leaving jokes all over the place: under the king's pillow, in his soup,
        even in the royal toilet. The king was furious, but he couldn't seem to
        stop Jokester.
      </P>
      <P>
        And then, one day, the people of the kingdom discovered that the jokes
        left by Jokester were so funny that they couldn't help but laugh. And
        once they started laughing, they couldn't stop.
      </P>

      <H4>The people's rebellion</H4>
      <P>
        The people of the kingdom, feeling uplifted by the laughter, started to
        tell jokes and puns again, and soon the entire kingdom was in on the
        joke.
      </P>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>King's treasury</TableHead>
            <TableHead>People's happiness</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Empty</TableCell>
            <TableCell>Overflowing</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Modest</TableCell>
            <TableCell>Satisfied</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Full</TableCell>
            <TableCell>Ecstatic</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <P>
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax. Jokester was declared a hero, and
        the kingdom lived happily ever after.
      </P>
      <P>
        The moral of the story is: never underestimate the power of a good laugh
        and always be careful of bad ideas.
      </P>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Story Configuration
 * ------------------------------------------------------------------------- */

const meta: Meta = {
  title: "Applied guidelines/Typography",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const LongFormContent: StoryObj = {
  name: "Long-form content",
  render: () => <TypographyShowcase />,
  parameters: {
    layout: "padded",
  },
};

export const Shell: StoryObj = {
  name: "Management shell",
  render: () => (
    <ManagementAppShell sidebar={managementSidebarProps} header={managementHeaderProps}>
      <div className="min-h-[200vh] rounded-xl border border-dashed" />
    </ManagementAppShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Architecture Demo** — The real ManagementAppShell from the design system. " +
          "Proves the Recessed Workspace (sidebar frame in white, main area " +
          "rounded with bg-background on a sidebar-toned floor), Structural " +
          "Caps in sidebar group labels, and the scroll-fade gradient.",
      },
    },
  },
};

export const RegistryDetail: StoryObj = {
  name: "Registry detail view",
  render: () => <RegistryDetailView />,
  parameters: {
    docs: {
      description: {
        story:
          "**Hierarchy Demo** — Proves the Content vs. Context weight rule. " +
          "Structural Cap Labels (uppercase, wide tracking) define the frame; " +
          "Heading XL anchors the content; Body M provides the authority statement " +
          "in regular weight. Metadata uses bold values with regular labels.",
      },
    },
  },
};
