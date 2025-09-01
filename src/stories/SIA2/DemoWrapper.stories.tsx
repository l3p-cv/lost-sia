import type { Meta, StoryObj } from "@storybook/react";

import DemoWrapper from "./DemoWrapper";
import Annotation from "../../Annotation/logic/Annotation";
import ExternalAnnotation from "../../models/ExternalAnnotation";
import AnnotationTool from "../../models/AnnotationTool";
import AnnotationSettings from "../../models/AnnotationSettings";

export const ActionsData = {};

const meta = {
  title: "Components/DemoWrapper",
  component: DemoWrapper,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof DemoWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: {
    ...ActionsData,
  },
};

const polygonAnnotations: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 50, y: 50 },
      { x: 200, y: 100 },
      { x: 250, y: 100 },
      { x: 250, y: 200 },
    ],
    labelIds: [5],
    type: AnnotationTool.Polygon,
  },
  {
    coordinates: [
      { x: 259.883, y: 300.424 },
      { x: 350, y: 331.5263919270834 },
      { x: 355, y: 320 },
      { x: 370, y: 300 },
      { x: 270, y: 250 },
    ],
    labelIds: [8, 11],
    type: AnnotationTool.Polygon,
  },
];

const annotationSettings: AnnotationSettings = {
  canCreate: true,
  canHaveMultipleLabels: true,
};

export const WithPolygonAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: polygonAnnotations,
    annotationSettings,
  },
};

const pointAnnotations: ExternalAnnotation[] = [
  {
    coordinates: [{ x: 50, y: 50 }],
    labelIds: [5],
    type: AnnotationTool.Point,
  },
  {
    coordinates: [{ x: 100, y: 100 }],
    labelIds: [8],
    type: AnnotationTool.Point,
  },
  {
    coordinates: [{ x: 150, y: 150 }],
    labelIds: [9],
    type: AnnotationTool.Point,
  },
  {
    coordinates: [{ x: 100, y: 200 }],
    labelIds: [10],
    type: AnnotationTool.Point,
  },
  {
    coordinates: [{ x: 270, y: 250 }],
    labelIds: [8, 11],
    type: AnnotationTool.Point,
  },
];

export const WithPointAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: pointAnnotations,
    annotationSettings,
  },
};
