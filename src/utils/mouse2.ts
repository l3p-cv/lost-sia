import { Point } from "../types";

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
): Point => {
  // get page coordinates of current mouse position relative to the start of the page
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems
  // convert them into stage coordinates by subtrating the offset between image and page
  const mousePositionInStageCoordinates: Point = {
    x: e.pageX - pageToStageOffset.x,
    y: e.pageY - pageToStageOffset.y,
  };

  // now we need to counter the stage scaling, because it will be automatically applied when rendering the annotation coordinates
  const antiScaledMousePositionInStageCoordinates: Point = {
    x: mousePositionInStageCoordinates.x / svgScale,
    y: mousePositionInStageCoordinates.y / svgScale,
  };

  return antiScaledMousePositionInStageCoordinates;
};

export default {
  getAntiScaledMouseStagePosition,
};
