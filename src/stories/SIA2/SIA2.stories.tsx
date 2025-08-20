import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  canvasConfig,
  filter,
  selectedTool,
  imgMeta,
  toolbarEnabled,
  annos,
  possibleLabels,
  imgBlob,
  noAnnos,
} from "../siaDummyData";

import Sia2 from "../../Sia2";

export const ActionsData = {
  onAnnoSaveEvent: fn(),
  onNotification: fn(),
  onCanvasKeyDown: fn(),
  onAnnoEvent: fn(),
  onGetAnnoExample: fn(),
  onCanvasEvent: fn(),
  onToolBarEvent: fn(),
  onGetFunction: fn(),
};

const meta = {
  title: "Components/SIA2",
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

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: {
    ...ActionsData,
    annos: noAnnos,
    canvasConfig,
    fullscreen: false,
    filter,
    imageBlob: imgBlob,
    imageMeta: imgMeta,
    isJunk: false,
    layoutUpdate: 0,
    lockedAnnos: [],
    possibleLabels,
    preventScrolling: false,
    selectedTool,
    toolbarEnabled,
  },
};
