import { CSSProperties, useEffect } from "react";

// rename type to avoid naming conflict
import TPoint from "../../../models/Point";
import AnnotationSettings from "../../../models/AnnotationSettings";
import Node from "../atoms/Node";
import AnnotationMode from "../../../models/AnnotationMode";

type PointProps = {
  annotationMode: AnnotationMode;
  annotationSettings: AnnotationSettings;
  coordinates: TPoint;
  pageToStageOffset: TPoint;
  svgScale: number;
  style: CSSProperties;
  onDeleteNode: (coordinates: TPoint) => void;
  onFinishAnnoCreate: () => void;
  onIsDraggingStateChanged: (bool) => void;
  onMoving: (coordinates: TPoint) => void; // during moving - update coordinates in parent
  onMoved: (coordinates: TPoint[]) => void; // moving finished - send annotation changed event
};

const Point = ({
  annotationMode,
  annotationSettings,
  coordinates,
  pageToStageOffset,
  svgScale,
  style,
  onFinishAnnoCreate,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PointProps) => {
  useEffect(() => {
    console.log("HAHA", annotationMode);

    if (annotationMode === AnnotationMode.CREATE) onFinishAnnoCreate();
  }, []);

  return (
    <Node
      index={0}
      annotationSettings={annotationSettings}
      coordinates={coordinates}
      pageToStageOffset={pageToStageOffset}
      svgScale={svgScale}
      style={style}
      onDeleteNode={
        // just remove da whole thing
        () => {}
      }
      onMoving={(_, newPoint) => onMoving(newPoint)}
      onMoved={() => onMoved([coordinates])}
      onIsDraggingStateChanged={onIsDraggingStateChanged}
    />
  );
};

export default Point;
