// import { within, userEvent, expect } from '@storybook/test';
import { Provider } from "react-redux";
import { store } from "./store";
import {
  canvasConfig,
  filter,
  uiConfig,
  selectedTool,
  imgMeta,
  toolbarEnabled,
  noAnnos,
  annos,
  defaultLabel,
  possibleLabels,
  imgBlob,
} from "./siaDummyData";

import Sia from "../Sia";

export default {
  title: "Example/SIA",
  component: Sia,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    isJunk: false,
    fullscreen: false,
  },
};

/**
 * SIA with dummy data
 */
export const Default = {
  decorators: [
    (Story, { args }) => (
      <Provider store={store}>
        <Sia
          annos={annos}
          possibleLabels={possibleLabels}
          imageBlob={imgBlob}
          imageMeta={imgMeta}
          // isJunk={false}
          uiConfig={uiConfig}
          layoutUpdate={0}
          selectedTool={selectedTool}
          canvasConfig={canvasConfig}
          // fullscreen={false}
          preventScrolling={false}
          lockedAnnos={[]}
          filter={filter}
          toolbarEnabled={toolbarEnabled}
          {...args}
        />
      </Provider>
    ),
  ],
};
