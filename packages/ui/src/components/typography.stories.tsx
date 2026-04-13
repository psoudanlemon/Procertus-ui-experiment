import type { Meta, StoryObj } from "@storybook/react-vite";

import { H1, H2, H3, H4 } from "@/components/ui/heading";
import {
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  InlineCode,
  List,
} from "@/components/ui/typography";

/**
 * Typography components enforce the PROCERTUS type scale and weight rules.
 * Use these instead of raw HTML tags to ensure consistency across the system.
 */
const meta = {
  title: "components/Typography",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj;

/**
 * Page title — one per view. Uses `text-3xl` (30px), semibold, tight tracking.
 */
export const H1Story: Story = {
  name: "H1",
  render: () => <H1>This is heading 1</H1>,
};

/**
 * Section header — top-level content divider. Uses `text-2xl` (24px).
 */
export const H2Story: Story = {
  name: "H2",
  render: () => <H2>This is heading 2</H2>,
};

/**
 * Subsection or card title. Uses `text-xl` (20px).
 */
export const H3Story: Story = {
  name: "H3",
  render: () => <H3>This is heading 3</H3>,
};

/**
 * Minor heading. Uses `text-lg` (18px), semibold.
 */
export const H4Story: Story = {
  name: "H4",
  render: () => <H4>This is heading 4</H4>,
};

/**
 * Standard body text. Uses `text-base` (16px), regular weight.
 */
export const PStory: Story = {
  name: "P",
  render: () => (
    <P>
      The International Register of Certificated Auditors maintains records for
      all active certifications. Each certificate is assigned a unique reference
      number and linked to the issuing body's accreditation chain.
    </P>
  ),
};

/**
 * Introductory text for page descriptions. Uses `text-xl` (20px) in muted-foreground.
 */
export const LeadStory: Story = {
  name: "Lead",
  render: () => (
    <Lead>
      A certification management platform built for authority, clarity, and
      precision.
    </Lead>
  ),
};

/**
 * Emphasized body text. Uses `text-lg` (18px), semibold.
 */
export const LargeStory: Story = {
  name: "Large",
  render: () => <Large>Certificate verified successfully.</Large>,
};

/**
 * Secondary text for metadata, captions, timestamps. Uses `text-sm` (14px), medium.
 */
export const SmallStory: Story = {
  name: "Small",
  render: () => <Small>Last updated 3 April 2026</Small>,
};

/**
 * De-emphasized secondary text. Same size as Small but in muted-foreground.
 */
export const MutedStory: Story = {
  name: "Muted",
  render: () => <Muted>Enter your email address to receive updates.</Muted>,
};

/**
 * Pull-quote or citation. Left border accent with italic text.
 */
export const BlockquoteStory: Story = {
  name: "Blockquote",
  render: () => (
    <Blockquote>
      The best way to predict the future is to create it. In certification, we
      are not just following standards — we are setting them.
    </Blockquote>
  ),
};

/**
 * Inline code snippet. Uses `font-mono`, `text-sm`, muted background.
 */
export const CodeStory: Story = {
  name: "Code",
  render: () => (
    <P>
      The certificate ID is <InlineCode>CERT-2026-04871-AU</InlineCode> and can
      be verified online.
    </P>
  ),
};

/**
 * Unordered list with disc markers and consistent spacing.
 */
export const UlStory: Story = {
  name: "UL",
  render: () => (
    <List>
      <li>Artificial intelligence and machine learning integration</li>
      <li>Edge computing and serverless architectures</li>
      <li>Progressive web applications (PWAs)</li>
      <li>WebAssembly for high-performance applications</li>
    </List>
  ),
};
