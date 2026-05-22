import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  InfoRequestSubmittedPanel,
  type InfoRequestSubmittedSnapshot,
} from "./InfoRequestSubmittedPanel";

const mockSnapshot: InfoRequestSubmittedSnapshot = {
  submittedAt: "2026-05-21T14:32:00.000+02:00",
  serviceLabel: "BENOR-certificatie",
  organizationName: "Acme Beton NV",
  submissionNote:
    "We willen graag weten of jullie BENOR ook combineren met een ATG-attest. We hebben een specifiek productdossier dat over beide loopt.",
  inquiries: [
    { label: "BENOR voor stortbeton", productHint: "Productfamilie A" },
    { label: "BENOR voor prefab elementen", productHint: "Productfamilie C" },
    { label: "Algemene vraag over combinatie met ATG" },
  ],
  scheduling: {
    wantsExpertCall: true,
    preferenceLabel: "donderdag 28 mei 2026, 14:00",
  },
  portalPersons: [
    {
      fullName: "Jan Janssens",
      email: "jan.janssens@acmebeton.be",
      roleLabel: "Aanvrager",
      invitedToPortal: true,
    },
    {
      fullName: "Marie Peeters",
      email: "marie.peeters@acmebeton.be",
      roleLabel: "Technisch verantwoordelijke",
      invitedToPortal: true,
    },
    {
      fullName: "Sander De Vos",
      email: "sander.devos@acmebeton.be",
      roleLabel: "Kwaliteitsmanager",
      invitedToPortal: false,
    },
  ],
};

const meta = {
  title: "components/info-request-submitted/InfoRequestSubmittedPanel",
  component: InfoRequestSubmittedPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Side-by-side compositions of the public 'Aanvraag verzonden' confirmation page. Switch between `Current` (four bordered sections) and `Proposed` (lead absorbs organisatie + ontvangen, only 'Dit stuurde je in' and 'Volgende stappen' remain). Used to decide which composition to ship in `InfoRequestSubmittedPage`.",
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
 * As shipped today: four bordered sections under the StatusPage lead.
 * "Dit stuurde je in", "Organisatie en context", "Je teamleden", and a five-bullet
 * "Volgende stappen op het Klantenportaal" list.
 */
export const Current: Story = {
  args: {
    variant: "current",
    snapshot: mockSnapshot,
    onBack: () => undefined,
  },
};

/**
 * Audit-proposed composition: organisatie + ontvangen moved into the lead,
 * the two portal-overlap sections merged into one "Volgende stappen" that
 * keeps the team list and trims the bullets to two essentials. The five
 * detailed portal-onboarding bullets are expected to surface in the portal
 * itself, not on this acknowledgement page.
 */
export const Proposed: Story = {
  args: {
    variant: "proposed",
    snapshot: mockSnapshot,
    onBack: () => undefined,
  },
};

/**
 * Edge case: snapshot without scheduling and an empty cart. Useful to verify
 * both compositions still read well when there is little to acknowledge.
 */
export const ProposedMinimal: Story = {
  args: {
    variant: "proposed",
    snapshot: {
      ...mockSnapshot,
      submissionNote: "",
      inquiries: [],
      scheduling: undefined,
      portalPersons: [
        {
          fullName: "Jan Janssens",
          email: "jan.janssens@acmebeton.be",
          roleLabel: "Aanvrager",
          invitedToPortal: true,
        },
      ],
    },
    onBack: () => undefined,
  },
};
