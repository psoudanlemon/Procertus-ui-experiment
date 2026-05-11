import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { stepIndex } from "../../../onboarding/onboarding-flow-helpers";
import {
  baseOnboardingFlowViewProps,
  storyCustomerContext,
  storyOnboardingDrafts,
  storyOnboardingStepperSteps,
  storyRequestOrigin,
} from "../../../onboarding/onboarding-story-fixtures";
import { useOnboardingRegistrationLayoutModel } from "../../../onboarding/use-onboarding-registration-layout-model";

import { OnboardingCompanyLegalEntitiesStep } from "./OnboardingCompanyLegalEntitiesStep";

type Model = ReturnType<typeof useOnboardingRegistrationLayoutModel>;

function Layout({
  build,
  children,
}: {
  build: () => Parameters<typeof baseOnboardingFlowViewProps>[0];
  children: (model: Model) => ReactNode;
}) {
  const props = useMemo(() => baseOnboardingFlowViewProps(build()), []);
  const model = useOnboardingRegistrationLayoutModel(props);
  return <>{children(model)}</>;
}

const meta = {
  title: "Onboarding/Presentational/Steps/Company · juridische entiteit",
  component: OnboardingCompanyLegalEntitiesStep,
  parameters: {
    layout: "padded",
    docs: { description: { component: "Ja/Nee zetel, tabel of vestigingen per aanvraag." } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingCompanyLegalEntitiesStep>;

export default meta;

export const ZetelVoorAlleAanvragen: StoryObj<typeof meta> = {
  args: {},
  render: () => (
    <Layout
      build={() => {
        const drafts = storyOnboardingDrafts;
        const included = drafts.map((d) => d.id);
        const ctx = storyCustomerContext({ headOfficeIsCertificationLegalEntity: "yes" });
        return {
          step: "companyLegalEntities",
          context: ctx,
          drafts,
          effectiveSummaryIncludedDraftIds: included,
          rows: [],
          steps: storyOnboardingStepperSteps({
            step: "companyLegalEntities",
            context: ctx,
            drafts,
            requestOrigin: storyRequestOrigin,
          }),
          activeStep: stepIndex("companyLegalEntities"),
          primaryAction: { label: "Verder", onClick: () => {}, disabled: false },
        };
      }}
    >
      {(model) => <OnboardingCompanyLegalEntitiesStep model={model} />}
    </Layout>
  ),
};
