import type { Meta, StoryObj } from "@storybook/react";

import Sia2 from "../../Sia2";
import UiConfig from "../../models/UiConfig";

import { imgBlob, possibleLabels } from "../siaDummyData";

export const ActionsData = {};

const meta = {
  title: "Components/Sia2",
  component: Sia2,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof Sia2>;

export default meta;
type Story = StoryObj<typeof meta>;

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
};

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: {
    ...ActionsData,
    uiConfig,
    image: imgBlob,
    possibleLabels,
  },
};

export const Loading: Story = {
  args: {
    ...ActionsData,
    isLoading: true,
    uiConfig,
    image: imgBlob,
    possibleLabels: [],
  },
};
