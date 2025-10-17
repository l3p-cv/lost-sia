import type { Meta, StoryObj } from "@storybook/react";

import Toolbar from "../../Toolbar/Toolbar";
// import '../../scss/main.scss'
import "../main.scss";
import AnnotationTool from "../../models/AnnotationTool";
import { possibleLabels } from "../siaDummyData2";

import { AllowedTools, AnnotationSettings } from "../../types";

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  argTypes: {
    defaultTool: {
      control: "select",
      options: AnnotationTool,
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const allowedTools: AllowedTools = {
  bbox: true,
  junk: true,
  line: true,
  point: true,
  polygon: true,
};

// export default {
//   title: "Components/Toolbar",
//   component: Toolbar,
//   parameters: {
//     // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
//     layout: "centered",
//   },
//   tags: ["autodocs"],
//   args: {},
//   argTypes: {
//     defaultTool: {
//       control: "select",
//       options: AnnotationTool,
//       description: "Select the right annotation tool",
//     },
//   },
// };

const limitedAllowedTools: AllowedTools = {
  bbox: true,
  junk: false,
  line: false,
  point: false,
  polygon: false,
};

const annotationSettings: AnnotationSettings = {
  canCreate: true,
  canEdit: true,
  canHaveMultipleLabels: true,
  canLabel: true,
};

const defaultArgs = {
  defaultTool: AnnotationTool.Line,
  annotationSettings,
  allowedTools,
  possibleLabels,
};

export const Default: Story = {
  args: defaultArgs,
};

export const DifferentDefaultTool: Story = {
  args: {
    ...defaultArgs,
    defaultTool: AnnotationTool.Polygon,
  },
};

export const LimitedAllowedTools: Story = {
  args: {
    ...defaultArgs,
    defaultTool: AnnotationTool.BBox,
    allowedTools: limitedAllowedTools,
  },
};

export const WithImageLabels: Story = {
  args: {
    ...defaultArgs,
    imageLabelIds: [2, 9],
  },
};
