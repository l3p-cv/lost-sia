import { CSSProperties } from "react";

// rename type to avoid naming conflict
import TPoint from "../../../models/Point";
import AnnotationSettings from "../../../models/AnnotationSettings";
import Node from "../atoms/Node";

type PointProps = {
  annotationSettings: AnnotationSettings;
  coordinates: TPoint;
  isSelected: boolean;
  pageToStageOffset: TPoint;
  svgScale: number;
  style: CSSProperties;
  onIsDraggingStateChanged: (bool) => void;
  onMoving: (coordinates: TPoint) => void; // during moving - update coordinates in parent
  onMoved: (coordinates: TPoint[]) => void; // moving finished - send annotation changed event
};

const Point = ({
  annotationSettings,
  coordinates,
  isSelected,
  pageToStageOffset,
  svgScale,
  style,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PointProps) => {
  return (
    <Node
      index={0}
      annotationSettings={annotationSettings}
      coordinates={coordinates}
      pageToStageOffset={pageToStageOffset}
      svgScale={svgScale}
      style={style}
      onDeleteNode={
        // just do nothing (we cannot delete a node from a point - delete the whole point instead)
        () => {}
      }
      onMoving={(_, newPoint) => isSelected && onMoving(newPoint)}
      onMoved={() => onMoved([coordinates])}
      onIsDraggingStateChanged={onIsDraggingStateChanged}
    />
  );
};

export default Point;
