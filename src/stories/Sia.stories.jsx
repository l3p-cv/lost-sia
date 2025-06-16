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
} from "./siaDummyData";

import Sia from "../Sia";

export default {
  title: "Components/SIA",
  component: Sia,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onAnnoSaveEvent: fn(),
    onNotification: fn(),
    onCanvasKeyDown: fn(),
    onAnnoEvent: fn(),
    onGetAnnoExample: fn(),
    onCanvasEvent: fn(),
    onToolBarEvent: fn(),
    onGetFunction: fn(),
  },
};

/**
 * SIA with dummy data
 */
export const Primary = {
  args: {
    annos,
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
