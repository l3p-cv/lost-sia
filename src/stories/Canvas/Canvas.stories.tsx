import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import exampleImage from '../exampleData/exampleImage'

import Canvas from '../../Canvas/Canvas'
import AnnotationTool from '../../models/AnnotationTool'

import { AnnotationSettings, UiConfig } from '../../types'
import exampleAnnotations from '../exampleData/exampleAnnotations'
import exampleLabels from '../exampleData/exampleLabels'

export const ActionsData = {
  onAnnoEvent: fn(),
  onKeyDown: fn(),
  onKeyUp: fn(),
}

const meta = {
  title: 'Components/Canvas',
  component: Canvas,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    // ...ActionsData,
  },
} satisfies Meta<typeof Canvas>

export default meta
type Story = StoryObj<typeof meta>

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
}

const annotationSettings: AnnotationSettings = {
  canHaveMultipleLabels: true,
  canCreate: true,
  canLabel: true,
}

const defaultArgs = {
  ...ActionsData,
  annotations: [],
  annotationSettings,
  image: exampleImage,
  selectedAnnotation: undefined,
  selectedAnnoTool: AnnotationTool.Point,
  possibleLabels: exampleLabels.voc,
  preventScrolling: true,
  uiConfig,
  onAnnoCreated: () => {},
  onAnnoChanged: () => {},
  onAnnoCreationFinished: () => {},
  onAnnoEditing: () => {},
  onRequestNewAnnoId: () => 1,
  onSelectAnnotation: () => {},
  onSetIsImageJunk: () => {},
  onSetSelectedTool: () => {},
  onShouldDeleteAnno: () => {},
}

export const Default: Story = {
  args: defaultArgs,
}

export const WithPoints: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleAnnotations.point,
    selectedAnnoTool: AnnotationTool.Point,
  },
}

export const WithLines: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleAnnotations.line,
    selectedAnnoTool: AnnotationTool.Line,
  },
}

export const WithBBoxes: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleAnnotations.bbox,
    selectedAnnoTool: AnnotationTool.BBox,
  },
}

export const WithPolygonAnnotations: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleAnnotations.polygon,
    selectedAnnoTool: AnnotationTool.Polygon,
  },
}
