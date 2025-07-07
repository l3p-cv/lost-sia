export function getViewportCoordinates(w, svg) {
  const window = {
    xMin: -1 * svg.translateX,
    xMax: -1 * svg.translateX + svg.width / svg.scale,
    yMin: -1 * svg.translateY,
    yMax: -1 * svg.translateY + svg.height / svg.scale,
  };
  const viewport = {
    xMin: 0,
    xMax: svg.width,
    yMin: 0,
    yMax: svg.height,
  };
  const scaleX = (viewport.xMax - viewport.xMin) / (window.xMax - window.xMin);
  const scaleY = (viewport.yMax - viewport.yMin) / (window.yMax - window.yMin);

  const vX = viewport.xMin + (w.x - window.xMin) * scaleX;
  const vY = viewport.yMin + (w.y - window.yMin) * scaleY;
  return { window, viewport, vX, vY, scaleX, scaleY };
}

/**
 *
 * @param w0 Point in image coordinate system
 * @param svg Svg with old translation values and old scales
 * @param newScale New scale/zoom
 * @returns new translation (x,y)
 */
export const getZoomTranslation = (
  centerPoint: [number, number],
  currentTranslations: [number, number],
  currentScale: number,
  newScale: number,
): [number, number] => {
  console.log(
    "NEW TRANS",
    centerPoint,
    currentTranslations,
    currentScale,
    newScale,
  );
  const scaleRatio = currentScale / newScale;
  const x =
    scaleRatio * (centerPoint[0] + currentTranslations[0]) - centerPoint[0];
  const y =
    scaleRatio * (centerPoint[1] + currentTranslations[1]) - centerPoint[1];
  // return centerPoint;
  return [x, y];
  return [-100, -100];
};
