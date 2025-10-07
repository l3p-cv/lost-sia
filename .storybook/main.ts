import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)", "../src/stories/**/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-links"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
