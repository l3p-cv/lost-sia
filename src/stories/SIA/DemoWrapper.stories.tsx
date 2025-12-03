import type { Meta, StoryObj } from '@storybook/react'

import DemoWrapper from './DemoWrapper'
import { AnnotationSettings } from '../../types'
import exampleExternalAnnotations from '../exampleData/exampleExternalAnnotations'

export const ActionsData = {}

const meta = {
  title: 'Components/DemoWrapper',
  component: DemoWrapper,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof DemoWrapper>

export default meta
type Story = StoryObj<typeof meta>

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: {
    ...ActionsData,
  },
}

const annotationSettings: AnnotationSettings = {
  canCreate: true,
  canHaveMultipleLabels: true,
  canLabel: true,
}

export const WithPolygonAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: exampleExternalAnnotations.polygon,
    annotationSettings,
  },
}

export const WithBBoxAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: exampleExternalAnnotations.bbox,
    annotationSettings,
  },
}

export const WithLineAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: exampleExternalAnnotations.line,
    annotationSettings,
  },
}

export const WithPointAnnotations: Story = {
  args: {
    ...ActionsData,
    annotations: exampleExternalAnnotations.point,
    annotationSettings,
  },
}
