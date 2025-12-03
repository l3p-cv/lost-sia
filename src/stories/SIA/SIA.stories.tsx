import type { Meta, StoryObj } from '@storybook/react'

import Sia from '../../Sia'

import { UiConfig } from '../../types'

import exampleImage from '../exampleData/exampleImage'
import exampleLabels from '../exampleData/exampleLabels'

export const ActionsData = {}

const meta = {
  title: 'Components/Sia',
  component: Sia,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Sia>

export default meta
type Story = StoryObj<typeof meta>

const uiConfig: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
}

const defaultArgs = {
  ...ActionsData,
  uiConfig,
  image: exampleImage,
  possibleLabels: exampleLabels.voc,
}

/**
 * SIA with dummy data
 */
export const Default: Story = {
  args: defaultArgs,
}

/**
 * Minimal SIA example
 */
export const Minimal: Story = {
  args: {
    ...defaultArgs,
    possibleLabels: exampleLabels.minimal,
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
    ...defaultArgs,
    isLoading: true,
  },
}

export const Junk: Story = {
  args: {
    ...defaultArgs,
    initialIsImageJunk: true,
  },
}
