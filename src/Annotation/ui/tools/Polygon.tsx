import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";
import Polyline from "../atoms/Polyline";

type PolygonProps = {
  coordinates: Point[];
  isSelected: boolean;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: (coordinates: Point[]) => void; // moving finished - send annotation changed event
  onIsDraggingStateChanged: (bool) => void;
};

const Polygon = ({
  coordinates,
  isSelected,
  pageToStageOffset,
  svgScale,
  style,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  let svgNodes: ReactElement[] = [];
  if (isSelected) {
    svgNodes = coordinates.map((coordinate: Point, index: number) => (
      <Node
        key={`node_${index}`}
        index={index}
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
        coordinates={coordinates}
        style={style}
        isSelected={isSelected}
        svgScale={svgScale}
        onMoving={onMoving}
        onMoved={() => onMoved(coordinates)}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
      {svgNodes}
    </g>
  );
};

export default Polygon;
