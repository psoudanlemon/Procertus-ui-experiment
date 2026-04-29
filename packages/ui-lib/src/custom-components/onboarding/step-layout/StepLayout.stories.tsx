import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from "@procertus-ui/ui";

import { OnboardingStepper, type OnboardingStepperStep } from "../onboarding-stepper";
import { StepLayout } from "./StepLayout";
import { useStepLayout } from "./useStepLayout";

const meta = {
  title: "Custom Components/Onboarding/StepLayout",
  component: StepLayout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Reusable **step page** layout for multi-step flows in the main content area. Pass a **stepper** via `stepper` and `stepperPosition` (or omit for title-only chrome). Pair with `useStepLayout` for back/next and per-step prerequisites. Align spacing and hierarchy with the Documentation Portal design guidelines.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StepLayout>;

export default meta;

const stepperSteps: OnboardingStepperStep[] = [
  { id: "a", title: "Account", description: "Create credentials" },
  { id: "b", title: "Profile", description: "Organization details" },
  { id: "c", title: "Review", description: "Confirm and submit" },
];

/** Wider max width, calmer type scale — first-run onboarding and similar flows. */
function OnboardingFlowStory() {
  const [perStepOk, setPerStepOk] = useState([false, false, true]);
  const [completed, setCompleted] = useState(false);
  const [account, setAccount] = useState({ email: "", password: "", confirm: "" });
  const [profile, setProfile] = useState({ org: "", vat: "", country: "", notes: "" });

  const canAdvanceFrom = useCallback(
    (step: number) => perStepOk[step] === true,
    [perStepOk],
  );

  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom });
  const step = flow.activeStep;

  const primaryDisabled = flow.isLast
    ? !flow.stepAdvanceAllowed
    : !flow.canGoForward;

  if (completed) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Onboarding complete (story).
      </p>
    );
  }

  return (
    <StepLayout
      variant="onboarding"
      title={["Welcome", "Profile basics", "Review & finish"][step] ?? "Step"}
      description="Supportive copy lives here. Mark the prerequisite below to enable Next, or go Back to change a previous step."
      stepLabel={`Step ${step + 1} of ${flow.totalSteps}`}
      cancelAction={{ label: "Cancel", onClick: () => undefined }}
      backAction={
        flow.isFirst
          ? undefined
          : { label: "Back", onClick: flow.goBack, disabled: !flow.canGoBack }
      }
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => {
          if (flow.isLast) setCompleted(true);
          else flow.goForward();
        },
        disabled: primaryDisabled,
      }}
      secondaryAction={flow.isLast ? { label: "Edit profile", onClick: () => flow.goToStep(1) } : undefined}
    >
      {step === 0 ? (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ob-email">Email</FieldLabel>
            <Input
              id="ob-email"
              type="email"
              placeholder="you@example.com"
              value={account.email}
              onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
            />
            <FieldDescription>We use this address to sign you in.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ob-password">Password</FieldLabel>
            <Input
              id="ob-password"
              type="password"
              placeholder="At least 8 characters"
              value={account.password}
              onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ob-confirm">Confirm password</FieldLabel>
            <Input
              id="ob-confirm"
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
                checked={perStepOk[step]}
                onChange={() =>
                  setPerStepOk((prev) => {
                    const next = [...prev];
                    next[step] = !next[step];
                    return next;
                  })
                }
              />
              I have reviewed the credentials above.
            </label>
          </Field>
        </FieldGroup>
      ) : step === 1 ? (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ob-org">Organization name</FieldLabel>
            <Input
              id="ob-org"
              placeholder="ACME International"
              value={profile.org}
              onChange={(e) => setProfile((p) => ({ ...p, org: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ob-vat">VAT number</FieldLabel>
            <Input
              id="ob-vat"
              placeholder="BE0123456789"
              value={profile.vat}
              onChange={(e) => setProfile((p) => ({ ...p, vat: e.target.value }))}
            />
            <FieldDescription>Used to look up your registry record.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="ob-country">Country</FieldLabel>
            <Input
              id="ob-country"
              placeholder="Belgium"
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="ob-notes">Notes (optional)</FieldLabel>
            <Textarea
              id="ob-notes"
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
                checked={perStepOk[step]}
                onChange={() =>
                  setPerStepOk((prev) => {
                    const next = [...prev];
                    next[step] = !next[step];
                    return next;
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
            <label className="flex cursor-pointer items-center gap-component text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border"
                checked={perStepOk[step]}
                onChange={() =>
                  setPerStepOk((prev) => {
                    const next = [...prev];
                    next[step] = !next[step];
                    return next;
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

export const OnboardingStep = {
  render: () => <OnboardingFlowStory />,
} as unknown as StoryObj<typeof meta>;

function WithTopStepperStory() {
  const [perStepOk, setPerStepOk] = useState([true, true, true]);
  const [account, setAccount] = useState({ email: "", password: "", confirm: "" });
  const [profile, setProfile] = useState({ org: "", vat: "", country: "", notes: "" });
  const canAdvance = (i: number) => perStepOk[i] === true;
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: canAdvance });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <StepLayout
      stepperPosition="top"
      stepper={
        <OnboardingStepper
          steps={stepperSteps}
          activeStep={flow.activeStep}
          onStepChange={flow.goToStep}
          orientation="horizontal"
          interactive
        />
      }
      variant="onboarding"
      title={s.title}
      description={s.description}
      cancelAction={{ label: "Cancel", onClick: () => undefined }}
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
            <FieldLabel htmlFor="story-email">Email</FieldLabel>
            <Input
              id="story-email"
              type="email"
              placeholder="you@example.com"
              value={account.email}
              onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
            />
            <FieldDescription>We use this address to sign you in.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="story-password">Password</FieldLabel>
            <Input
              id="story-password"
              type="password"
              placeholder="At least 8 characters"
              value={account.password}
              onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="story-confirm">Confirm password</FieldLabel>
            <Input
              id="story-confirm"
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
                checked={perStepOk[flow.activeStep]}
                onChange={() =>
                  setPerStepOk((p) => {
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
            <FieldLabel htmlFor="story-org">Organization name</FieldLabel>
            <Input
              id="story-org"
              placeholder="ACME International"
              value={profile.org}
              onChange={(e) => setProfile((p) => ({ ...p, org: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="story-vat">VAT number</FieldLabel>
            <Input
              id="story-vat"
              placeholder="BE0123456789"
              value={profile.vat}
              onChange={(e) => setProfile((p) => ({ ...p, vat: e.target.value }))}
            />
            <FieldDescription>Used to look up your registry record.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="story-country">Country</FieldLabel>
            <Input
              id="story-country"
              placeholder="Belgium"
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="story-notes">Notes (optional)</FieldLabel>
            <Textarea
              id="story-notes"
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
                checked={perStepOk[flow.activeStep]}
                onChange={() =>
                  setPerStepOk((p) => {
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
                checked={perStepOk[flow.activeStep]}
                onChange={() =>
                  setPerStepOk((p) => {
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

export const WithTopStepper = {
  render: () => <WithTopStepperStory />,
} as unknown as StoryObj<typeof meta>;

function WithStartStepperStory() {
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: () => true });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }
  return (
    <StepLayout
      className="max-w-none"
      stepperPosition="start"
      layout="fill"
      stepper={
        <OnboardingStepper
          className="max-w-none"
          steps={stepperSteps}
          activeStep={flow.activeStep}
          onStepChange={flow.goToStep}
          orientation="vertical"
          interactive
        />
      }
      variant="onboarding"
      title={s.title}
      description={s.description}
      cancelAction={{ label: "Cancel", onClick: () => undefined }}
      backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
      primaryAction={{
        label: flow.isLast ? "Done" : "Next",
        onClick: () => (flow.isLast ? undefined : flow.goForward()),
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="rail-email">Email</FieldLabel>
          <Input id="rail-email" type="email" placeholder="you@example.com" />
          <FieldDescription>
            Start rail: vertical stepper in the `stepper` slot with `stepperPosition="start"`. On small screens the rail stacks above the main column.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="rail-password">Password</FieldLabel>
          <Input id="rail-password" type="password" placeholder="At least 8 characters" />
        </Field>
      </FieldGroup>
    </StepLayout>
  );
}

export const WithStartStepper = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <WithStartStepperStory />,
} as unknown as StoryObj<typeof meta>;

/** Tighter width and type — dense flows such as a certification wizard. */
function WizardStepStory() {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const flow = useStepLayout({
    totalSteps: 2,
    canAdvanceFrom: (s) => (s === 0 ? ready : true),
  });
  const step = flow.activeStep;

  const primaryDisabled = flow.isLast
    ? !flow.stepAdvanceAllowed
    : !flow.canGoForward;

  if (completed) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Submitted (story).
      </p>
    );
  }

  return (
    <StepLayout
      variant="wizard"
      title={step === 0 ? "Intent" : "Confirm"}
      stepLabel={`Step ${step + 1} of ${flow.totalSteps}`}
      description="Footer emphasizes the primary “Next” action; use optional outline secondary actions when needed."
      cancelAction={{ label: "Cancel", onClick: () => undefined }}
      backAction={
        flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack, disabled: !flow.canGoBack }
      }
      primaryAction={{
        label: flow.isLast ? "Submit" : "Next",
        onClick: () => {
          if (flow.isLast) setCompleted(true);
          else flow.goForward();
        },
        disabled: primaryDisabled,
      }}
    >
      {step === 0 ? (
        <label className="flex items-center gap-component text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={ready}
            onChange={() => setReady((r) => !r)}
          />
          Required for Next
        </label>
      ) : (
        <p className="text-sm">Confirm and submit (demo).</p>
      )}
    </StepLayout>
  );
}

export const WizardStep = {
  render: () => <WizardStepStory />,
} as unknown as StoryObj<typeof meta>;

const fillerParagraphs = Array.from(
  { length: 18 },
  (_, i) => `Line ${i + 1} — the body slot scrolls in fill layout; header and footer stay visible for actions.`,
);

/** Full width and `100svh` height: step chrome fills the viewport; children scroll. */
function FillLayoutStory() {
  const [ok, setOk] = useState(false);
  const flow = useStepLayout({
    totalSteps: 3,
    canAdvanceFrom: () => ok,
  });

  const primaryDisabled = !flow.stepAdvanceAllowed;

  return (
    <StepLayout
      layout="fill"
      variant="onboarding"
      title="Scrollable full-screen step"
      description='Set the layout prop to "fill" when the layout should occupy the viewport. The main region scrolls; header and footer stay put.'
      stepLabel={`Step ${flow.activeStep + 1} of ${flow.totalSteps}`}
      cancelAction={{ label: "Cancel", onClick: () => undefined }}
      primaryAction={{
        label: "Continue",
        onClick: () => undefined,
        disabled: primaryDisabled,
      }}
      secondaryAction={{ label: "Save draft", onClick: () => undefined }}
    >
      <div className="space-y-section text-sm text-muted-foreground">
        <label className="flex items-center gap-component text-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border"
            checked={ok}
            onChange={() => setOk((o) => !o)}
          />
          Allow Continue (prerequisite)
        </label>
        {fillerParagraphs.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </StepLayout>
  );
}

export const OnboardingStepFill = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <FillLayoutStory />,
} as unknown as StoryObj<typeof meta>;

function ParentFillWithRailStory() {
  const flow = useStepLayout({ totalSteps: 3, canAdvanceFrom: () => true });
  const s = stepperSteps[flow.activeStep];
  if (!s) {
    return null;
  }

  return (
    <div className="h-[70svh] min-h-0 w-full min-w-0 bg-muted/20 p-section">
      <StepLayout
        className="max-w-none"
        layout="fill-parent"
        stepperPosition="start"
        stepper={
          <OnboardingStepper
            className="max-w-none"
            steps={stepperSteps}
            activeStep={flow.activeStep}
            onStepChange={flow.goToStep}
            orientation="vertical"
            interactive
          />
        }
        variant="wizard"
        title={s.title}
        description="Parent-fill layout fills the available app-shell region; the body scrolls internally and actions stay docked at the bottom."
        stepLabel={`Step ${flow.activeStep + 1} of ${flow.totalSteps}`}
        cancelAction={{ label: "Cancel", onClick: () => undefined }}
        backAction={flow.isFirst ? undefined : { label: "Back", onClick: flow.goBack }}
        primaryAction={{
          label: flow.isLast ? "Done" : "Next",
          onClick: () => (flow.isLast ? undefined : flow.goForward()),
        }}
      >
        <div className="space-y-section text-sm text-muted-foreground">
          {fillerParagraphs.concat(fillerParagraphs).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </StepLayout>
    </div>
  );
}

export const ParentFillWithStartStepper = {
  parameters: {
    layout: "fullscreen",
    docs: {
      canvas: { layout: "fullscreen" },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  render: () => <ParentFillWithRailStory />,
} as unknown as StoryObj<typeof meta>;
