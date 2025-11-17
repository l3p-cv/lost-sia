import { CSSProperties, useEffect, useState } from 'react'
import { Point } from '../../../types'
import AnnotationMode from '../../../models/AnnotationMode'
import { AnnotationSettings } from '../../../types'

type PolygonAreaProps = {
  coordinates: Point[]
  isSelected: boolean
  isDisabled?: boolean
  annotationMode: AnnotationMode
  annotationSettings: AnnotationSettings
  pageToStageOffset: Point
  svgScale: number
  style: CSSProperties
  onFinishAnnoCreate?: () => void
  onMouseDown: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
  onMouseUp?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
  onMouseMove: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
  onIsDraggingStateChanged: (bool) => void
}

const PolygonArea = ({
  coordinates,
  isSelected,
  isDisabled = false,
  annotationMode,
  style,
  onFinishAnnoCreate = () => {},
  onMouseDown,
  onMouseUp = () => {},
  onMouseMove,
}: PolygonAreaProps) => {
  // draw line between nodes
  const svgLineCoords: string = coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(' ')

  const [cursorStyle, setCursorStyle] = useState<string>('pointer')

  useEffect(() => {
    if (isDisabled) return setCursorStyle('not-allowed')
    if (isSelected) setCursorStyle('grab')
    else setCursorStyle('pointer')
  }, [isSelected, isDisabled])

  // adjust style for polyline
  const polyLineStyle = { ...style }
  polyLineStyle.cursor = cursorStyle
  polyLineStyle.fillOpacity = isSelected ? 0 : 0.3

  // dont show the polygon edges (the line does what as a stripe if enabled)
  if (isSelected && isDisabled) polyLineStyle.stroke = 'none'

  return (
    <polygon
      points={svgLineCoords}
      style={polyLineStyle}
      onMouseDown={(e) => {
        if (isSelected) setCursorStyle('grabbing')
        onMouseDown(e)
      }}
      onMouseUp={(e) => {
        setCursorStyle('grab')
        onMouseUp(e)
      }}
      onDoubleClick={() =>
        annotationMode === AnnotationMode.CREATE && onFinishAnnoCreate()
      }
      onMouseMove={onMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}

export default PolygonArea
