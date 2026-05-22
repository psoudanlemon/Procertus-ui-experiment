import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  InfoRequestSubmittedPanel,
  type InfoRequestSubmittedSnapshot,
} from "./InfoRequestSubmittedPanel";

const mockSnapshot: InfoRequestSubmittedSnapshot = {
  submittedAt: "2026-05-21T14:32:00.000+02:00",
  organizationName: "Acme Beton NV",
  portalPersons: [
    {
      email: "jan.janssens@acmebeton.be",
      roleLabel: "Aanvrager",
      invitedToPortal: true,
    },
  ],
};

const meta = {
  title: "Certification submitted/InfoRequestSubmittedPanel",
  component: InfoRequestSubmittedPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Publieke 'Bedankt voor je aanvraag' bevestigingspagina. Lead absorbeert de organisatienaam en de ontvangen-op timestamp; daaronder één sectie 'Volg je dossier op' met een verwijzing naar My PROCERTUS en een tabel met de uitgenodigde contactpersonen.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-svh w-full overflow-y-auto bg-background" data-density="spacious">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof InfoRequestSubmittedPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default snapshot: één contactpersoon (de aanvrager) die per e-mail werd
 * uitgenodigd voor My PROCERTUS.
 */
export const Default: Story = {
  args: {
    snapshot: mockSnapshot,
    onBack: () => undefined,
  },
};
