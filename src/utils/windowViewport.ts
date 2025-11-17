import { Point, Vector2 } from '../types'

const getViewportCoordinates = (
  svgTranslation: Vector2,
  canvasSize: Vector2,
  svgScale: number,
  pointInViewport: Point,
) => {
  const window = {
    xMin: -1 * svgTranslation.x,
    xMax: -1 * svgTranslation.x + canvasSize.x / svgScale,
    yMin: -1 * svgTranslation.y,
    yMax: -1 * svgTranslation.y + canvasSize.y / svgScale,
  }

  const viewport = {
    xMin: 0,
    xMax: canvasSize.x,
    yMin: 0,
    yMax: canvasSize.y,
  }

  const scaleX = (viewport.xMax - viewport.xMin) / (window.xMax - window.xMin)
  const scaleY = (viewport.yMax - viewport.yMin) / (window.yMax - window.yMin)

  const vX = viewport.xMin + (pointInViewport.x - window.xMin) * scaleX
  const vY = viewport.yMin + (pointInViewport.y - window.yMin) * scaleY

  return { window, viewport, vX, vY, scaleX, scaleY }
}

export default {
  getViewportCoordinates,
}
