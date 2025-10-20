import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { imgBlob } from "../siaDummyData";

import Canvas from "../../Canvas/Canvas";
import AnnotationTool from "../../models/AnnotationTool";
import Annotation from "../../Annotation/logic/Annotation";

import { possibleLabels } from "../siaDummyData2";
import { AnnotationSettings, UiConfig } from "../../types";

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
  tags: ["!autodocs"],
  excludeStories: /.*Data$/,
  args: {
    // ...ActionsData,
  },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
};

const annotationSettings: AnnotationSettings = {
  canHaveMultipleLabels: true,
  canCreate: true,
  canLabel: true,
};

export const Default: Story = {
  args: {
    ...ActionsData,
    annotations: [],
    annotationSettings,
    image: imgBlob,
    selectedAnnotation: undefined,
    selectedAnnoTool: AnnotationTool.Point,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
    onAnnoCreated: () => {},
    onAnnoChanged: () => {},
    onAnnoCreationFinished: () => {},
    onAnnoEditing: () => {},
    onRequestNewAnnoId: () => 1,
    onSelectAnnotation: () => {},
    onSetSelectedTool: () => {},
    onShouldDeleteAnno: () => {},
  },
};

const samplePointAnnotations: Annotation[] = [
  new Annotation(0, AnnotationTool.Point, [{ x: 10, y: 10 }]),
  new Annotation(1, AnnotationTool.Point, [{ x: 50, y: 50 }]),
  new Annotation(2, AnnotationTool.Point, [{ x: 100, y: 100 }]),
  new Annotation(3, AnnotationTool.Point, [{ x: 150, y: 150 }]),
  new Annotation(4, AnnotationTool.Point, [{ x: 200, y: 200 }]),
  new Annotation(5, AnnotationTool.Point, [{ x: 250, y: 250 }]),
  new Annotation(6, AnnotationTool.Point, [{ x: 300, y: 300 }]),
  new Annotation(7, AnnotationTool.Point, [{ x: 350, y: 350 }]),
];

export const WithPoints: Story = {
  args: {
    ...ActionsData,
    annotations: samplePointAnnotations,
    annotationSettings,
    image: imgBlob,
    selectedAnnotation: undefined,
    selectedAnnoTool: AnnotationTool.Point,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
    onAnnoCreated: () => {},
    onAnnoChanged: () => {},
    onAnnoCreationFinished: () => {},
    onAnnoEditing: () => {},
    onRequestNewAnnoId: () => 1,
    onSelectAnnotation: () => {},
    onSetSelectedTool: () => {},
    onShouldDeleteAnno: () => {},
  },
};

const sampleLineAnnotations: Annotation[] = [
  new Annotation(0, AnnotationTool.Line, [
    { x: 10, y: 10 },
    { x: 100, y: 100 },
  ]),
  new Annotation(1, AnnotationTool.Line, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 450, y: 120 },
    { x: 400, y: 200 },
    { x: 200, y: 200 },
  ]),
  new Annotation(2, AnnotationTool.Line, [{ x: 150, y: 150 }]),
  new Annotation(3, AnnotationTool.Line, [{ x: 200, y: 200 }]),
];

export const WithLines: Story = {
  args: {
    ...ActionsData,
    annotations: sampleLineAnnotations,
    annotationSettings,
    image: imgBlob,
    selectedAnnotation: undefined,
    selectedAnnoTool: AnnotationTool.Line,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
    onAnnoCreated: () => {},
    onAnnoChanged: () => {},
    onAnnoCreationFinished: () => {},
    onAnnoEditing: () => {},
    onRequestNewAnnoId: () => 1,
    onSelectAnnotation: () => {},
    onSetSelectedTool: () => {},
    onShouldDeleteAnno: () => {},
  },
};

const sampleBBoxAnnotations: Annotation[] = [
  new Annotation(0, AnnotationTool.BBox, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
  ]),
  new Annotation(1, AnnotationTool.BBox, [
    { x: 150, y: 150 },
    { x: 200, y: 200 },
  ]),
  new Annotation(2, AnnotationTool.BBox, [
    { x: 400, y: 325 },
    { x: 500, y: 375 },
  ]),
];

export const WithBBoxes: Story = {
  args: {
    ...ActionsData,
    annotations: sampleBBoxAnnotations,
    annotationSettings,
    image: imgBlob,
    selectedAnnotation: undefined,
    selectedAnnoTool: AnnotationTool.BBox,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
    onAnnoCreated: () => {},
    onAnnoChanged: () => {},
    onAnnoCreationFinished: () => {},
    onAnnoEditing: () => {},
    onRequestNewAnnoId: () => 1,
    onSelectAnnotation: () => {},
    onSetSelectedTool: () => {},
    onShouldDeleteAnno: () => {},
  },
};

const samplePolygonAnnotations: Annotation[] = [
  new Annotation(0, AnnotationTool.Polygon, [
    { x: 50, y: 50 },
    { x: 200, y: 100 },
    { x: 250, y: 100 },
    { x: 250, y: 200 },
  ]),
  new Annotation(1, AnnotationTool.Polygon, [
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
    annotationSettings,
    image: imgBlob,
    selectedAnnotation: undefined,
    selectedAnnoTool: AnnotationTool.Polygon,
    possibleLabels,
    preventScrolling: true,
    uiConfig,
    onAnnoCreated: () => {},
    onAnnoChanged: () => {},
    onAnnoCreationFinished: () => {},
    onAnnoEditing: () => {},
    onRequestNewAnnoId: () => 1,
    onSelectAnnotation: () => {},
    onSetSelectedTool: () => {},
    onShouldDeleteAnno: () => {},
  },
};
