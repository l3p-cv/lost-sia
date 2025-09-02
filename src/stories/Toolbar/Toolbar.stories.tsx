import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";
import Toolbar from "../../Toolbar/Toolbar";
// import '../../scss/main.scss'
import "../main.scss";
import AnnotationTool from "../../models/AnnotationTool";
import AllowedTools from "../../models/AllowedTools";
import AnnotationSettings from "../../models/AnnotationSettings";

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

export const Default: Story = {
  args: {
    defaultTool: AnnotationTool.Line,
    annotationSettings,
    allowedTools,
  },
};

export const DifferentDefaultTool: Story = {
  args: {
    defaultTool: AnnotationTool.Polygon,
    annotationSettings,
    allowedTools,
  },
};

export const LimitedAllowedTools: Story = {
  args: {
    defaultTool: AnnotationTool.BBox,
    annotationSettings,
    allowedTools: limitedAllowedTools,
  },
};
