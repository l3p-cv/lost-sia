import Point from "../models/Point";

/**
 * returns the position of the pouse relative to the (scaled) image
 * the coordinates are
 * @param e the mouse event
 * @param imagePageOffset vector2 from the start of the page to the start of the image
 * @param svgScale the scaling factor of the canvas svg element (can be zoomed in by user)
 * @returns
 */
const getAntiScaledMouseImagePosition = (
  e: MouseEvent,
  imagePageOffset: Point,
  svgScale: number,
): Point => {
  // get page coordinates of current mouse position relative to the start of the page
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems
  // convert them into image coordinates by subtrating the offset between image and page
  const mousePositionInImageCoordinates: Point = {
    x: e.pageX - imagePageOffset.x,
    y: e.pageY - imagePageOffset.y,
  };

  // now we need to counter the canvas scaling, because it will be automatically applied when rendering the annotation coordinates
  const antiScaledMousePositionInImageCoordinates: Point = {
    x: mousePositionInImageCoordinates.x / svgScale,
    y: mousePositionInImageCoordinates.y / svgScale,
  };

  return antiScaledMousePositionInImageCoordinates;
};

export default {
  getAntiScaledMouseImagePosition,
};
