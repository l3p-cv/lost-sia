import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";
import Polyline from "../atoms/Polyline";
import AnnotationMode from "../../../models/AnnotationMode";
import AnnotationSettings from "../../../models/AnnotationSettings";
import Edge from "../atoms/Edge";

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
  onDeleteNode: (coordinates: Point[]) => void;
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
  onDeleteNode,
  onFinishAnnoCreate,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  let svgNodes: ReactElement[] = [];
  let svgEdges: ReactElement[] = [];
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
        onDeleteNode={() => {
          const newCoordinates = [...coordinates];
          newCoordinates.splice(index, 1);
          onDeleteNode(newCoordinates);
        }}
        onMoving={(index, newPoint) => {
          const newCoordinates = [...coordinates];
          newCoordinates[index] = newPoint;
          onMoving(newCoordinates);
        }}
        onMoved={() => onMoved(coordinates)}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
    ));

    svgEdges = coordinates.map((coordinate: Point, index: number) => {
      const endCoordinates: Point =
        index + 1 < coordinates.length
          ? coordinates[index + 1]
          : coordinates[0];

      return (
        <Edge
          key={`edge_${index}`}
          startCoordinate={coordinate}
          endCoordinate={endCoordinates}
          pageToStageOffset={pageToStageOffset}
          svgScale={svgScale}
          style={style}
          onAddNode={(coordinate: Point) => {
            const newCoordinates = [...coordinates];
            newCoordinates.splice(index + 1, 0, coordinate);

            onAddNode(newCoordinates);
          }}
        />
      );
    });
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
      {isSelected && annotationSettings.canEdit && svgEdges}
      {isSelected && svgNodes}
    </g>
  );
};

export default Polygon;
