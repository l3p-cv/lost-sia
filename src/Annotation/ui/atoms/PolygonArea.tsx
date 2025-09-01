import { CSSProperties } from "react";
import Point from "../../../models/Point";
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
  onAddNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMoved: () => void; // moving finished - send annotation changed event
  onIsDraggingStateChanged: (bool) => void;
};

const PolygonArea = ({
  coordinates,
  isSelected,
  annotationMode,
  style,
  onFinishAnnoCreate,
  onMouseDown,
  onMouseMove,
}: PolygonAreaProps) => {
  // draw line between nodes
  const svgLineCoords: string = coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  // adjust style for polyline
  const polyLineStyle = { ...style };
  polyLineStyle.cursor = "pointer";
  polyLineStyle.fillOpacity = isSelected ? 0 : 0.3;

  return (
    <polygon
      points={svgLineCoords}
      style={polyLineStyle}
      onMouseDown={onMouseDown}
      onDoubleClick={() =>
        annotationMode === AnnotationMode.CREATE && onFinishAnnoCreate()
      }
      onMouseMove={onMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default PolygonArea;
