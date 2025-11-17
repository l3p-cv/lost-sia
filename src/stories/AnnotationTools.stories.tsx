import type { Meta, StoryObj } from '@storybook/react'

import Sia from '../Sia'
import { imgBlob } from './siaDummyData'
import { AllowedTools } from '../types'

export const ActionsData = {}

const meta = {
  title: 'Annotation Tools',
  component: Sia,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'padding',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '50vw',
          height: '65vh',
          padding: 10,
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sia>

export default meta
type Story = StoryObj<typeof meta>

const allowedTools: AllowedTools = {
  bbox: true,
  line: false,
  point: false,
  polygon: false,
  junk: true,
}

export const BBoxOnly: Story = {
  args: {
    ...ActionsData,
    image: imgBlob,
    possibleLabels: [],
    allowedTools,
  },
  parameters: {
    docs: {
      source: {
        code: `
        const imageBlob: string = "data:image/jpeg;base64,/9j/4AAQSkZ..."
        const allowedTools: AllowedTools = {
          bbox: true,
          line: false,
          point: false,
          polygon: false,
          junk: true,
        };

        ...

        <Sia
          allowedTools={allowedTools}
          image={imageBlob}
          possibleLabels={[]}
        />`,
      },
    },
  },
}

const noJunkTools = {
  bbox: true,
  line: true,
  point: true,
  polygon: true,
  junk: false,
}

export const NoJunk: Story = {
  args: {
    ...ActionsData,
    image: imgBlob,
    possibleLabels: [],
    allowedTools: noJunkTools,
  },
  parameters: {
    docs: {
      source: {
        code: `
        const imageBlob: string = "data:image/jpeg;base64,/9j/4AAQSkZ..."
        const allowedTools: AllowedTools = {
          bbox: true,
          line: true,
          point: true,
          polygon: true,
          junk: false,
        };

        ...

        <Sia
          allowedTools={allowedTools}
          image={imageBlob}
          possibleLabels={[]}
        />`,
      },
    },
  },
}
