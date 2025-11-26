import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import exampleImage from '../exampleData/exampleImage'

import AnnotationTool from '../../models/AnnotationTool'

import { UiConfig } from '../../types'
import CanvasWithOffset from './CanvasOffset'

import exampleAnnotations from '../exampleData/exampleAnnotations'
import exampleLabels from '../exampleData/exampleLabels'

export const ActionsData = {
  onAnnoEvent: fn(),
  onKeyDown: fn(),
  onKeyUp: fn(),
}

const meta = {
  title: 'Components/CanvasWithOffset',
  component: CanvasWithOffset,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof CanvasWithOffset>

export default meta
type Story = StoryObj<typeof meta>

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
}

const defaultArgs = {
  ...ActionsData,
  selectedAnnotation: undefined,
  image: exampleImage,
  selectedAnnoTool: AnnotationTool.Point,
  possibleLabels: exampleLabels.voc,
  preventScrolling: true,
  uiConfig,
}

export const Default: Story = {
  args: defaultArgs,
}

export const WithPoints: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleAnnotations.point,
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
