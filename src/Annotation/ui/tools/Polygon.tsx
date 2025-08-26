import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";
import Polyline from "../atoms/Polyline";
import AnnotationMode from "../../../models/AnnotationMode";
import AnnotationSettings from "../../../models/AnnotationSettings";

type PolygonProps = {
  annotationSettings: AnnotationSettings;
  coordinates: Point[];
  isSelected: boolean;
  annotationMode: AnnotationMode;
  setAnnotationMode: (annotationMode: AnnotationMode) => void;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onAddNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onIsDraggingStateChanged: (bool) => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: (coordinates: Point[]) => void; // moving finished - send annotation changed event
};

const Polygon = ({
  annotationSettings,
  coordinates,
  isSelected,
  annotationMode,
  pageToStageOffset,
  svgScale,
  style,
  onAddNode,
  onFinishAnnoCreate,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  let svgNodes: ReactElement[] = [];
  if (isSelected && annotationMode !== AnnotationMode.CREATE) {
    svgNodes = coordinates.map((coordinate: Point, index: number) => (
      <Node
        key={`node_${index}`}
        index={index}
        annotationSettings={annotationSettings}
        coordinates={coordinate}
        pageToStageOffset={pageToStageOffset}
        svgScale={svgScale}
        style={style}
        onMoving={(index, newPoint) => {
          const newCoordinates = [...coordinates];
          newCoordinates[index] = newPoint;
          onMoving(newCoordinates);
        }}
        onMoved={() => onMoved(coordinates)}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
    ));
  }

  // nodes need to be drawn after the polyline to make them clickable
  return (
    <g>
      <Polyline
        annotationSettings={annotationSettings}
        coordinates={coordinates}
        isSelected={isSelected}
        annotationMode={annotationMode}
        pageToStageOffset={pageToStageOffset}
        style={style}
        svgScale={svgScale}
        onAddNode={onAddNode}
        onFinishAnnoCreate={onFinishAnnoCreate}
        onMoving={onMoving}
        onMoved={() => onMoved(coordinates)}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
      {svgNodes}
    </g>
  );
};

export default Polygon;
