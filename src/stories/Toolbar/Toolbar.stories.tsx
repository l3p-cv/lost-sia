import type { Meta, StoryObj } from '@storybook/react'

import Toolbar from '../../Toolbar/Toolbar'
import '../main.scss'
import AnnotationTool from '../../models/AnnotationTool'

import { AllowedTools, AnnotationSettings } from '../../types'
import exampleLabels from '../exampleData/exampleLabels'

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  argTypes: {
    selectedTool: {
      control: 'select',
      options: [
        AnnotationTool.BBox,
        AnnotationTool.Line,
        AnnotationTool.Point,
        AnnotationTool.Polygon,
      ],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

const allowedTools: AllowedTools = {
  bbox: true,
  junk: true,
  line: true,
  point: true,
  polygon: true,
}

const limitedAllowedTools: AllowedTools = {
  bbox: true,
  junk: false,
  line: false,
  point: false,
  polygon: false,
}

const annotationSettings: AnnotationSettings = {
  canCreate: true,
  canEdit: true,
  canHaveMultipleLabels: true,
  canLabel: true,
}

const defaultArgs = {
  annotationSettings,
  allowedTools,
  possibleLabels: exampleLabels.voc,
  selectedTool: AnnotationTool.BBox,
}

export const Default: Story = {
  args: defaultArgs,
}

export const DifferentDefaultTool: Story = {
  args: {
    ...defaultArgs,
    selectedTool: AnnotationTool.Polygon,
  },
}

export const LimitedAllowedTools: Story = {
  args: {
    ...defaultArgs,
    selectedTool: AnnotationTool.BBox,
    allowedTools: limitedAllowedTools,
  },
}

export const WithImageLabels: Story = {
  args: {
    ...defaultArgs,
    imageLabelIds: [2, 9],
  },
}
