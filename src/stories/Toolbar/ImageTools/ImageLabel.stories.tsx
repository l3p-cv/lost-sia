import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";
import ImageLabel from "../../../Toolbar/ToolbarItems/ImageToolItems/ImageLabel";
import { possibleLabels } from "../../siaDummyData2";

const meta = {
  title: "Components/Toolbar/ImageLabel",
  component: ImageLabel,
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ImageLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  possibleLabels,
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithImageLabels: Story = {
  args: {
    ...defaultArgs,
    selectedLabelIds: [2, 9],
  },
};
