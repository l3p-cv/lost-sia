import { Point, Vector2 } from "../types";

/**
 * Get point that is closest to the left browser side.
 *
 * @param points list of points {x,y}
 * @returns {object} A list of point [{x,y}...]. Multiple points are
 *  returned when multiple points have the same distance to the left side.
 */
export const getMostLeftPoints = (points: Point[]): Point[] => {
  let minX = Infinity;
  let minXList: Point[] = [];
  points.forEach((point: Point) => {
    if (point.x < minX) {
      // new most left point - replace list
      minX = point.x;
      minXList = [];
      minXList.push(point);
    } else if (point.x === minX) {
      // same x as current most left point - add to list
      minXList.push(point);
    }
  });
  return minXList;
};

/**
 * Get point that is closest to the top of the browser.
 *
 * @param points list of points [x,y]
 * @returns A list of point [[x,y]...]. Multiple points are
 *  returned when multiple points have the same distance to the top.
 */
export const getTopPoint = (points: Point[]): Point[] => {
  let minY = Infinity;
  let minYList: Point[] = [];
  points.forEach((point: Point) => {
    if (point.y < minY) {
      // new hightest point - replace list
      minY = point.y;
      minYList = [];
      minYList.push(point);
    } else if (point.y === minY) {
      // same height as highest point - add to list
      minYList.push(point);
    }
  });
  return minYList;
};

/**
 * converts coordinates from the stage system into the page system
 * the coordinates are
 * @param pageToStageOffset vector2 from the start of the page to the start of the stage
 * @param svgScale the scaling factor of the canvas svg element (can be zoomed in by user)
 * @returns
 */
const convertStageToPage = (
  stageCoordinates: Point,
  pageToStageOffset: Point,
  svgScale: number,
  svgTranslation: Vector2,
): Point => {
  const scaledStageCoordinates: Point = {
    x: stageCoordinates.x + svgTranslation.x,
    y: stageCoordinates.y + svgTranslation.y,
  };

  // now we need to counter the scaling to get from the transformation system into the stage system
  const transformedStageCoordinates: Point = {
    x: scaledStageCoordinates.x * svgScale,
    y: scaledStageCoordinates.y * svgScale,
  };

  // convert them into (translated) stage coordinates by subtracting the offset between the page (0,0) and the stage (0,0)
  const pageCoordinates: Point = {
    x: transformedStageCoordinates.x + pageToStageOffset.x,
    y: transformedStageCoordinates.y + pageToStageOffset.y,
  };

  return pageCoordinates;
};

export default {
  convertStageToPage,
  getMostLeftPoints,
  getTopPoint,
};
