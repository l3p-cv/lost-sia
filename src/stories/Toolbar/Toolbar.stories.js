import { fn } from "@storybook/test";
import Toolbar from '../../Toolbar/Toolbar';
// import '../../scss/main.scss'
import '../main.scss';
import AnnotationTool from "../../models/AnnotationTool";

export default {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
  argTypes: {
    defaultTool: {
        control: 'select',
        options: AnnotationTool,
        description: 'Select the right annotation tool'
    }
  }
};

export const Primary = {
  args: {
    defaultTool: AnnotationTool.Line
  }
};

export const DifferentDefaultTool = {
  args: {
    defaultTool: AnnotationTool.Polygon
  }
};
