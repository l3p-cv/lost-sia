import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { imgBlob } from "../siaDummyData";

import Canvas from "../../Canvas/Canvas";
import AnnotationTool from "../../models/AnnotationTool";
import Annotation from "../../Annotation/logic/Annotation";

import { possibleLabels } from "../siaDummyData2";
import UiConfig from "../../models/UiConfig";

export const ActionsData = {
  onAnnoEvent: fn(),
  onKeyDown: fn(),
  onKeyUp: fn(),
};

const meta = {
  title: "Components/Canvas",
  component: Canvas,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
};

export const Default: Story = {
  args: {
    ...ActionsData,
    image: imgBlob,
    selectedAnnoTool: AnnotationTool.Point,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
  },
};

const samplePointAnnotations: Annotation[] = [
  new Annotation(AnnotationTool.Point, [{ x: 10, y: 10 }]),
  new Annotation(AnnotationTool.Point, [{ x: 50, y: 50 }]),
  new Annotation(AnnotationTool.Point, [{ x: 100, y: 100 }]),
  new Annotation(AnnotationTool.Point, [{ x: 150, y: 150 }]),
  new Annotation(AnnotationTool.Point, [{ x: 200, y: 200 }]),
  new Annotation(AnnotationTool.Point, [{ x: 250, y: 250 }]),
  new Annotation(AnnotationTool.Point, [{ x: 300, y: 300 }]),
  new Annotation(AnnotationTool.Point, [{ x: 350, y: 350 }]),
];

export const WithPoints: Story = {
  args: {
    ...ActionsData,
    annotations: samplePointAnnotations,
    image: imgBlob,
    selectedAnnoTool: AnnotationTool.Point,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
  },
};

const sampleLineAnnotations: Annotation[] = [
  new Annotation(AnnotationTool.Line, [
    { x: 10, y: 10 },
    { x: 100, y: 100 },
  ]),
  new Annotation(AnnotationTool.Line, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 450, y: 120 },
    { x: 400, y: 200 },
    { x: 200, y: 200 },
  ]),
  new Annotation(AnnotationTool.Line, [{ x: 150, y: 150 }]),
  new Annotation(AnnotationTool.Line, [{ x: 200, y: 200 }]),
];

export const WithLines: Story = {
  args: {
    ...ActionsData,
    annotations: sampleLineAnnotations,
    image: imgBlob,
    selectedAnnoTool: AnnotationTool.Line,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
  },
};

const sampleBBoxAnnotations: Annotation[] = [
  new Annotation(AnnotationTool.BBox, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
  ]),
  new Annotation(AnnotationTool.BBox, [
    { x: 150, y: 150 },
    { x: 200, y: 200 },
  ]),
  new Annotation(AnnotationTool.BBox, [
    { x: 400, y: 325 },
    { x: 500, y: 375 },
  ]),
];

export const WithBBoxes: Story = {
  args: {
    ...ActionsData,
    annotations: sampleBBoxAnnotations,
    image: imgBlob,
    selectedAnnoTool: AnnotationTool.BBox,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
  },
};

const samplePolygonAnnotations: Annotation[] = [
  new Annotation(AnnotationTool.Polygon, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
    { x: 250, y: 100 },
    { x: 250, y: 200 },
  ]),
  new Annotation(AnnotationTool.Polygon, [
    { x: 500, y: 300 },
    { x: 500, y: 320 },
    { x: 550, y: 370 },
    { x: 600, y: 350 },
    { x: 550, y: 450 },
  ]),
];

export const WithPolygonAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: samplePolygonAnnotations,
    image: imgBlob,
    selectedAnnoTool: AnnotationTool.Polygon,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
  },
};
