import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { H2, H3 } from "@/components/ui/heading";
import { Muted } from "@/components/ui/typography";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "design tokens/Logotype",
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Asset paths (served via staticDirs from packages/ui/public)
// ---------------------------------------------------------------------------

const LOGO = "/Procertus logo.svg";
const LOGO_MARKS = "/Marks_Procertus logo.svg";
const LOGO_TAGLINE = "/Procertus Logo with tagline.svg";
const LOGO_TAGLINE_MARKS = "/Marks_Procertus Logo with tagline.svg";
const LOGO_VERTICAL = "/Procertus Logo_vertical.svg";
const LOGO_VERTICAL_MARKS = "/Marks_Procertus Logo_vertical.svg";
const LOGO_VERTICAL_TAGLINE = "/Procertus Logo_vertical with tagline.svg";
const LOGO_VERTICAL_TAGLINE_MARKS = "/Marks_Procertus Logo_vertical with tagline.svg";
const LOGOMARK = "/logomark.svg";

// ---------------------------------------------------------------------------
// View: Logotype specs
// ---------------------------------------------------------------------------

function LogotypeSpecsView() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 p-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <H2>Minimum dimensions</H2>
        <Muted className="max-w-prose">
          Below these thresholds the logotype fails reproduction fidelity checks.
          Each card renders the logo at its exact minimum dimension.
        </Muted>
      </div>

      <div>

        <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Context</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Version</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Minimum width</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Preview</th>
              </tr>
            </thead>
            <tbody>
              {/* Horizontal with tagline */}
              <tr className="border-b border-border bg-muted/30">
                <td className="px-4 py-2 font-semibold text-foreground" colSpan={4}>Horizontal with tagline</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Digital</td>
                <td className="px-4 py-5 text-muted-foreground">Horizontal with tagline</td>
                <td className="px-4 py-5"><Badge variant="secondary">320px</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: 320 }}>
                    <img src={LOGO_TAGLINE} alt="Horizontal with tagline at 320px" className="w-full" />
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Print</td>
                <td className="px-4 py-5 text-muted-foreground">Horizontal with tagline</td>
                <td className="px-4 py-5"><Badge variant="secondary">38mm</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: "38mm" }}>
                    <img src={LOGO_TAGLINE} alt="Horizontal with tagline at 38mm" className="w-full" />
                  </div>
                </td>
              </tr>

              {/* Horizontal without tagline */}
              <tr className="border-b border-border bg-muted/30">
                <td className="px-4 py-2 font-semibold text-foreground" colSpan={4}>Horizontal without tagline</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Digital</td>
                <td className="px-4 py-5 text-muted-foreground">Horizontal</td>
                <td className="px-4 py-5"><Badge variant="secondary">320px</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: 320 }}>
                    <img src={LOGO} alt="Horizontal at 320px" className="w-full" />
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Print</td>
                <td className="px-4 py-5 text-muted-foreground">Horizontal</td>
                <td className="px-4 py-5"><Badge variant="secondary">38mm</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: "38mm" }}>
                    <img src={LOGO} alt="Horizontal at 38mm" className="w-full" />
                  </div>
                </td>
              </tr>

              {/* Vertical with tagline */}
              <tr className="border-b border-border bg-muted/30">
                <td className="px-4 py-2 font-semibold text-foreground" colSpan={4}>Vertical with tagline</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Digital</td>
                <td className="px-4 py-5 text-muted-foreground">Vertical with tagline</td>
                <td className="px-4 py-5"><Badge variant="secondary">200px</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: 200 }}>
                    <img src={LOGO_VERTICAL_TAGLINE} alt="Vertical with tagline at 200px" className="w-full" />
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Print</td>
                <td className="px-4 py-5 text-muted-foreground">Vertical with tagline</td>
                <td className="px-4 py-5"><Badge variant="secondary">38mm</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: "38mm" }}>
                    <img src={LOGO_VERTICAL_TAGLINE} alt="Vertical with tagline at 38mm" className="w-full" />
                  </div>
                </td>
              </tr>

              {/* Vertical without tagline */}
              <tr className="border-b border-border bg-muted/30">
                <td className="px-4 py-2 font-semibold text-foreground" colSpan={4}>Vertical without tagline</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Digital</td>
                <td className="px-4 py-5 text-muted-foreground">Vertical</td>
                <td className="px-4 py-5"><Badge variant="secondary">200px</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: 200 }}>
                    <img src={LOGO_VERTICAL} alt="Vertical at 200px" className="w-full" />
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Print</td>
                <td className="px-4 py-5 text-muted-foreground">Vertical</td>
                <td className="px-4 py-5"><Badge variant="secondary">38mm</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: "38mm" }}>
                    <img src={LOGO_VERTICAL} alt="Vertical at 38mm" className="w-full" />
                  </div>
                </td>
              </tr>

              {/* Logomark */}
              <tr className="border-b border-border bg-muted/30">
                <td className="px-4 py-2 font-semibold text-foreground" colSpan={4}>Logomark</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-5 font-medium text-foreground">Digital</td>
                <td className="px-4 py-5 text-muted-foreground">Pictogram only</td>
                <td className="px-4 py-5"><Badge variant="secondary">44px</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: 44, height: 44 }}>
                    <img src={LOGOMARK} alt="Pictogram at 44px" className="w-full" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-5 font-medium text-foreground">Print</td>
                <td className="px-4 py-5 text-muted-foreground">Pictogram only</td>
                <td className="px-4 py-5"><Badge variant="secondary">38mm</Badge></td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background p-3" style={{ width: "38mm", height: "38mm" }}>
                    <img src={LOGOMARK} alt="Pictogram at 38mm" className="w-full" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/**
 * Protection zones, minimum reproduction sizes, and pictogram rules
 * derived from the Procertus brand book.
 */
export const LogotypeSpecs: Story = {
  name: "Minimum dimensions",
  render: () => <LogotypeSpecsView />,
};
