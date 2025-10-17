import type { Meta, StoryObj } from "@storybook/react";

import TagLabel from "../../../Toolbar/ToolbarItems/ImageToolItems/TagLabel";

const meta = {
  title: "Components/Toolbar/TagLabel",
  component: TagLabel,
  argTypes: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TagLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "I'm a label",
  },
};

export const DifferentColor: Story = {
  args: {
    name: "I'm green",
    color: "#2ecc71",
  },
};

export const DifferentSize: Story = {
  args: {
    name: "I'm a big one",
    size: 200,
    triangleSize: 142,
  },
};
