import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from "@procertus-ui/ui";

import { StepLayout, useStepLayout } from "../step-layout";
import { OnboardingStepper, type OnboardingStepperStep } from "./OnboardingStepper";

const stepDefs: OnboardingStepperStep[] = [
  { id: "a", title: "Account", description: "Create credentials" },
  { id: "b", title: "Profile", description: "Organization details" },
  { id: "c", title: "Review", description: "Confirm and submit" },
];

const meta = {
  title: "Custom Components/Onboarding/OnboardingStepper",
  component: OnboardingStepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal or vertical process stepper that pairs with `StepLayout` and `useStepLayout` (0-based `activeStep` ↔ 1-based primitive step). Built on the ReUI / `@procertus-ui/ui` stepper with Procertus colors, `shadow-proc-tactile` indicators, and Hugeicons (completed).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingStepper>;

export default meta;

function HorizontalWithStepLayout() {
  const [prereq, setPrereq] = useState([true, true, true]);
  const [account, setAccount] = useState({ email: "", password: "", confirm: "" });
  const [profile, setProfile] = useState({ org: "", vat: "", country: "", notes: "" });
  const canAdvance = (i: number) => prereq[i] === true;
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: canAdvance });
  const guardedSteps = stepDefs.map((step, index) => ({
    ...step,
    available: index <= flow.activeStep || prereq.slice(0, index).every(Boolean),
  }));
  const s = guardedSteps[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <StepLayout
      stepperPosition="top"
      stepper={
        <OnboardingStepper
          steps={guardedSteps}
          activeStep={flow.activeStep}
          onStepChange={flow.goToStep}
          orientation="horizontal"
          interactive
        />
      }
      variant="onboarding"
      title={s.title}
      description={s.description}
      backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => (flow.isLast ? undefined : flow.goForward()),
        disabled: flow.isLast ? !flow.stepAdvanceAllowed : !flow.canGoForward,
      }}
    >
      {flow.activeStep === 0 ? (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="os-email">Email</FieldLabel>
            <Input
              id="os-email"
              type="email"
              placeholder="you@example.com"
              value={account.email}
              onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
            />
            <FieldDescription>We use this address to sign you in.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="os-password">Password</FieldLabel>
            <Input
              id="os-password"
              type="password"
              placeholder="At least 8 characters"
              value={account.password}
              onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="os-confirm">Confirm password</FieldLabel>
            <Input
              id="os-confirm"
              type="password"
              value={account.confirm}
              onChange={(e) => setAccount((a) => ({ ...a, confirm: e.target.value }))}
            />
          </Field>
          <Field>
            <label className="flex cursor-pointer items-center gap-component text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border"
                checked={prereq[flow.activeStep]}
                onChange={() =>
                  setPrereq((p) => {
                    const n = [...p];
                    n[flow.activeStep] = !n[flow.activeStep];
                    return n;
                  })
                }
              />
              I have reviewed the credentials above.
            </label>
          </Field>
        </FieldGroup>
      ) : flow.activeStep === 1 ? (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="os-org">Organization name</FieldLabel>
            <Input
              id="os-org"
              placeholder="ACME International"
              value={profile.org}
              onChange={(e) => setProfile((p) => ({ ...p, org: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="os-vat">VAT number</FieldLabel>
            <Input
              id="os-vat"
              placeholder="BE0123456789"
              value={profile.vat}
              onChange={(e) => setProfile((p) => ({ ...p, vat: e.target.value }))}
            />
            <FieldDescription>Used to look up your registry record.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="os-country">Country</FieldLabel>
            <Input
              id="os-country"
              placeholder="Belgium"
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="os-notes">Notes (optional)</FieldLabel>
            <Textarea
              id="os-notes"
              rows={3}
              placeholder="Anything we should know about your organization?"
              value={profile.notes}
              onChange={(e) => setProfile((p) => ({ ...p, notes: e.target.value }))}
            />
          </Field>
          <Field>
            <label className="flex cursor-pointer items-center gap-component text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border"
                checked={prereq[flow.activeStep]}
                onChange={() =>
                  setPrereq((p) => {
                    const n = [...p];
                    n[flow.activeStep] = !n[flow.activeStep];
                    return n;
                  })
                }
              />
              Profile details look correct.
            </label>
          </Field>
        </FieldGroup>
      ) : (
        <FieldGroup>
          <Field>
            <FieldLabel>Account</FieldLabel>
            <FieldDescription>{account.email || "—"}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Organization</FieldLabel>
            <FieldDescription>
              {profile.org || "—"}
              {profile.vat ? ` · ${profile.vat}` : ""}
              {profile.country ? ` · ${profile.country}` : ""}
            </FieldDescription>
          </Field>
          <Field>
            <label className="flex items-center gap-component text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border"
                checked={prereq[flow.activeStep]}
                onChange={() =>
                  setPrereq((p) => {
                    const n = [...p];
                    n[flow.activeStep] = !n[flow.activeStep];
                    return n;
                  })
                }
              />
              I confirm the information above is correct.
            </label>
          </Field>
        </FieldGroup>
      )}
    </StepLayout>
  );
}

export const WithStepLayout = {
  render: () => <HorizontalWithStepLayout />,
} as unknown as StoryObj<typeof meta>;

function VerticalReadOnly() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-component md:flex-row">
      <OnboardingStepper
        className="!max-w-56 shrink-0"
        steps={stepDefs}
        activeStep={1}
        interactive={false}
        orientation="vertical"
      />
      <p className="text-sm text-muted-foreground">Vertical, display-only. Main content would sit in `StepLayout` with `stepperPosition="start"` to the right.</p>
    </div>
  );
}

export const VerticalDisplayOnly = {
  render: () => <VerticalReadOnly />,
} as unknown as StoryObj<typeof meta>;
