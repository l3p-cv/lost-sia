import type { Meta, StoryObj } from '@storybook/react'

import Sia from '../../Sia'

import { Label, UiConfig } from '../../types'

import { imgBlob, possibleLabels } from '../siaDummyData'

export const ActionsData = {}

const meta = {
  title: 'Components/Sia2',
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
      <div style={{ width: '50vw', height: '65vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sia>

export default meta
type Story = StoryObj<typeof meta>

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
}

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: {
    ...ActionsData,
    uiConfig,
    image: imgBlob,
    possibleLabels,
  },
}

const minimalExampleLabels: Label[] = [
  {
    id: 1,
    name: 'Cat',
    description: 'Includes all cats',
  },
  {
    id: 2,
    name: 'Dog',
    description: 'Includes all dogs',
  },
]

/**
 * Minimal SIA example
 */
export const Minimal: Story = {
  args: {
    ...ActionsData,
    image: imgBlob,
    possibleLabels: minimalExampleLabels,
  },
  parameters: {
    docs: {
      source: {
        code: `
        const imageBlob: string = "data:image/jpeg;base64,/9j/4AAQSkZ..."
        const possibleLabels: Label = [
          {
            id: 1,
            name: "Cat",
            description: "Includes all cats",
          },
          {
            id: 2,
            name: "Dog",
            description: "Includes all dogs",
          }
        ]

        ...

        <Sia
          image={imageBlob}
          possibleLabels={possibleLabels}
        />`,
      },
    },
  },
}

export const Loading: Story = {
  args: {
    ...ActionsData,
    isLoading: true,
    uiConfig,
    image: imgBlob,
    possibleLabels: [],
  },
}

export const Junk: Story = {
  args: {
    ...ActionsData,
    initialIsImageJunk: true,
    uiConfig,
    image: imgBlob,
    possibleLabels: [],
  },
}
