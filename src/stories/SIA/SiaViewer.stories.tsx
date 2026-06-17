import type { Meta, StoryObj } from '@storybook/react'

import SiaViewer from '../../SiaViewer'

import exampleImage from '../exampleData/exampleImage'
import exampleLabels from '../exampleData/exampleLabels'
import exampleExternalAnnotations from '../exampleData/exampleExternalAnnotations'

export const ActionsData = {}

const meta = {
  title: 'Components/SiaViewer',
  component: SiaViewer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof SiaViewer>

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs = {
  ...ActionsData,
  image: exampleImage,
  possibleLabels: exampleLabels.voc,
}

/**
 * SiaViewer with point annotations. No toolbar, no editing.
 * Try clicking annotations to select them and scrolling to zoom.
 */
export const WithPointAnnotations: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.point,
  },
}

/**
 * SiaViewer with bbox annotations.
 */
export const WithBBoxAnnotations: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.bbox,
  },
}

/**
 * SiaViewer with line annotations.
 */
export const WithLineAnnotations: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.line,
  },
}

/**
 * SiaViewer with polygon annotations.
 */
export const WithPolygonAnnotations: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.polygon,
  },
}

/**
 * SiaViewer with zoom disabled.
 */
export const ZoomDisabled: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.polygon,
    enableZoom: false,
  },
}

/**
 * SiaViewer with selection disabled. Annotations cannot be clicked.
 */
export const SelectionDisabled: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.polygon,
    canSelect: false,
  },
}

/**
 * SiaViewer marked as junk.
 */
export const Junk: Story = {
  args: {
    ...defaultArgs,
    annotations: exampleExternalAnnotations.polygon,
    isJunk: true,
  },
}
