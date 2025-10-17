import type { Meta, StoryObj } from "@storybook/react";

import Sia2 from "../Sia2";
import type { Label } from "../types";
import { imgBlob } from "./siaDummyData";

export const ActionsData = {};

const meta = {
  title: "Minimal SIA",
  component: Sia2,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padding",
  },
  tags: ["!autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "50vw",
          height: "65vh",
          padding: 10,
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sia2>;

export default meta;
type Story = StoryObj<typeof meta>;

const minimalExampleLabels: Label[] = [
  {
    id: 1,
    name: "Cat",
    description: "Includes all cats",
  },
  {
    id: 2,
    name: "Dog",
    description: "Includes all dogs",
  },
];

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

        <Sia2
          image={imageBlob}
          possibleLabels={possibleLabels}
        />`,
      },
    },
  },
};
