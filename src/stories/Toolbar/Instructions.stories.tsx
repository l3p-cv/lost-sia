import type { Meta, StoryObj } from '@storybook/react'

import Toolbar from '../../Toolbar/Toolbar'
import '../main.scss'
import Instructions from '../../Toolbar/ToolbarItems/Instructions'

const meta = {
  title: 'Components/Toolbar/Instructions',
  component: Instructions,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs = {}

export const Default: Story = {
  args: defaultArgs,
}
