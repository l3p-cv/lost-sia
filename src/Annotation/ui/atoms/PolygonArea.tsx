import { CSSProperties, useEffect, useState } from "react";
import { Point } from "../../../types";
import AnnotationMode from "../../../models/AnnotationMode";
import AnnotationSettings from "../../../models/AnnotationSettings";

type PolygonAreaProps = {
  coordinates: Point[];
  isSelected: boolean;
  annotationMode: AnnotationMode;
  annotationSettings: AnnotationSettings;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onFinishAnnoCreate?: () => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onIsDraggingStateChanged: (bool) => void;
};

const PolygonArea = ({
  coordinates,
  isSelected,
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
    .join(" ");

  const [cursorStyle, setCursorStyle] = useState<string>("pointer");

  useEffect(() => {
    if (isSelected) setCursorStyle("grab");
    else setCursorStyle("pointer");
  }, [isSelected]);

  // adjust style for polyline
  const polyLineStyle = { ...style };
  polyLineStyle.cursor = cursorStyle;
  polyLineStyle.fillOpacity = isSelected ? 0 : 0.3;

  return (
    <polygon
      points={svgLineCoords}
      style={polyLineStyle}
      onMouseDown={(e) => {
        isSelected && setCursorStyle("grabbing");
        onMouseDown(e);
      }}
      onMouseUp={(e) => {
        setCursorStyle("grab");
        onMouseUp(e);
      }}
      onDoubleClick={() =>
        annotationMode === AnnotationMode.CREATE && onFinishAnnoCreate()
      }
      onMouseMove={onMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default PolygonArea;
