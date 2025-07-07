import type { Meta, StoryObj } from "@storybook/react";
import { possibleLabels } from "./siaDummyData2";
import { fn } from "@storybook/test";
import LabelInput from "../Canvas/LabelInput";

const meta = {
  title: "Components/LabelFilter",
  component: LabelInput,
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LabelInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    possibleLabels,
    onLabelSelect: fn(),
  },
};
