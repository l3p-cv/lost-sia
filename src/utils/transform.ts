import type { Point, Vector2 } from '../types'

const convertImageCoordinatesToStage = (
  imageCoordinates: Point[],
  imageSize: Vector2,
  stageSize: Vector2,
): Point[] => {
  // the image is scaled to match the width of the canvas
  // assume the aspect ratio is kept
  const imageToCanvasScale = stageSize.x / imageSize.x

  const stageCoordinates = imageCoordinates.map((imagePoint: Point) => ({
    x: imagePoint.x * imageToCanvasScale,
    y: imagePoint.y * imageToCanvasScale,
  }))

  return stageCoordinates
}

const convertPercentagedCoordinatesToImage = (
  percentagedCoordinates: Point[],
  imageSize: Vector2,
): Point[] => {
  const imageCoordinates: Point[] = percentagedCoordinates.map((point: Point) => {
    return {
      x: point.x * imageSize.x,
      y: point.y * imageSize.y,
    }
  })

  return imageCoordinates
}

const convertPercentagedCoordinatesToStage = (
  percentagedCoordinates: Point[],
  imageSize: Vector2,
  stageSize: Vector2,
): Point[] => {
  const imageCoordinates = convertPercentagedCoordinatesToImage(
    percentagedCoordinates,
    imageSize,
  )
  const stageCoordinates = convertImageCoordinatesToStage(
    imageCoordinates,
    imageSize,
    stageSize,
  )
  return stageCoordinates
}

const convertStageCoordinatesToImage = (
  stageCoordinates: Point[],
  imageToStageFactor: number,
): Point[] => {
  const coordinatesInImageSpace: Point[] = stageCoordinates.map((coordinate: Point) => {
    return {
      x: coordinate.x / imageToStageFactor,
      y: coordinate.y / imageToStageFactor,
    }
  })
  return coordinatesInImageSpace
}

const convertStageCoordinatesToPercentaged = (
  scaledCoordinates: Point[],
  imageToStageFactor: number,
  imageSize: Vector2,
): Point[] => {
  const imageCoordinates: Point[] = convertStageCoordinatesToImage(
    scaledCoordinates,
    imageToStageFactor,
  )

  // make sure the coordinates are inside the image bounds
  const polishedImageCoordinates = imageCoordinates.map((point: Point) => {
    if (point.x < 0) point.x = 0
    if (point.y < 0) point.y = 0
    if (point.x > imageSize.x) point.x = imageSize.x
    if (point.y > imageSize.y) point.y = imageSize.y

    return point
  })

  // someone decided to use percentages as the image coordinates
  // convert them from pixel coordinates back to percentages here
  const percentagedCoordinates = polishedImageCoordinates.map((point: Point) => {
    return {
      x: point.x / imageSize.x,
      y: point.y / imageSize.y,
    }
  })

  return percentagedCoordinates
}

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
  }

  // now we need to counter the scaling to get from the transformation system into the stage system
  const transformedStageCoordinates: Point = {
    x: scaledStageCoordinates.x * svgScale,
    y: scaledStageCoordinates.y * svgScale,
  }

  // convert them into (translated) stage coordinates by subtracting the offset between the page (0,0) and the stage (0,0)
  const pageCoordinates: Point = {
    x: transformedStageCoordinates.x + pageToStageOffset.x,
    y: transformedStageCoordinates.y + pageToStageOffset.y,
  }

  return pageCoordinates
}

/**
 * Get point that is closest to the left browser side.
 *
 * @param points list of points {x,y}
 * @returns {object} A list of point [{x,y}...]. Multiple points are
 *  returned when multiple points have the same distance to the left side.
 */
export const getMostLeftPoints = (points: Point[]): Point[] => {
  let minX = Infinity
  let minXList: Point[] = []
  points.forEach((point: Point) => {
    if (point.x < minX) {
      // new most left point - replace list
      minX = point.x
      minXList = []
      minXList.push(point)
    } else if (point.x === minX) {
      // same x as current most left point - add to list
      minXList.push(point)
    }
  })
  return minXList
}

/**
 * Get point that is closest to the top of the browser.
 *
 * @param points list of points [x,y]
 * @returns A list of point [[x,y]...]. Multiple points are
 *  returned when multiple points have the same distance to the top.
 */
export const getTopPoint = (points: Point[]): Point[] => {
  let minY = Infinity
  let minYList: Point[] = []
  points.forEach((point: Point) => {
    if (point.y < minY) {
      // new hightest point - replace list
      minY = point.y
      minYList = []
      minYList.push(point)
    } else if (point.y === minY) {
      // same height as highest point - add to list
      minYList.push(point)
    }
  })
  return minYList
}

export default {
  convertImageCoordinatesToStage,
  convertPercentagedCoordinatesToImage,
  convertPercentagedCoordinatesToStage,
  convertStageCoordinatesToImage,
  convertStageCoordinatesToPercentaged,
  convertStageToPage,
  getMostLeftPoints,
  getTopPoint,
}
