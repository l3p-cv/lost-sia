import { MouseEvent } from "react";
import { Point, Vector2 } from "../types";

/**
 * returns the position of the pouse relative to the (scaled) stage
 * the coordinates are
 * @param e the mouse event
 * @param pageToStageOffset vector2 from the start of the page to the start of the stage
 * @param svgScale the scaling factor of the canvas svg element (can be zoomed in by user)
 * @returns
 */
const getAntiScaledMouseStagePosition = (
  e: MouseEvent,
  pageToStageOffset: Point,
  svgScale: number,
  svgTranslation: Vector2,
): Point => {
  // get page coordinates of current mouse position relative to the start of the page
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems
  const pageCoordinates: Point = { x: e.pageX, y: e.pageY };

  // convert them into (translated) stage coordinates by subtracting the offset between the page (0,0) and the stage (0,0)
  const transformedStageCoordinates: Point = {
    x: pageCoordinates.x - pageToStageOffset.x,
    y: pageCoordinates.y - pageToStageOffset.y,
  };

  // now we need to counter the scaling to get from the transformation system into the stage system
  const scaledStageCoordinates: Point = {
    x: transformedStageCoordinates.x / svgScale,
    y: transformedStageCoordinates.y / svgScale,
  };

  const stageCoordinates: Point = {
    x: scaledStageCoordinates.x - svgTranslation.x,
    y: scaledStageCoordinates.y - svgTranslation.y,
  };

  return stageCoordinates;
};

export default {
  getAntiScaledMouseStagePosition,
};
