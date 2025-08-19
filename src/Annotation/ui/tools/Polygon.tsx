import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";
import Polyline from "../atoms/Polyline";

type PolygonProps = {
  coordinates: Point[];
  isSelected: boolean;
  imagePageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onNodeMoved: (coordinates: Point[]) => void;
  onAnnotationMoved: (coordinates: Point[]) => void;
  onIsDraggingStateChanged: (bool) => void;
};

const Polygon = ({
  coordinates,
  isSelected,
  imagePageOffset,
  svgScale,
  style,
  onNodeMoved,
  onAnnotationMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  let svgNodes: ReactElement[] = [];
  if (isSelected) {
    svgNodes = coordinates.map((coordinate: Point, index: number) => (
      <Node
        index={index}
        coordinates={coordinate}
        imagePageOffset={imagePageOffset}
        svgScale={svgScale}
        style={style}
        onNodeMoved={(index, newPoint) => {
          const newCoordinates = [...coordinates];
          newCoordinates[index] = newPoint;
          onNodeMoved(newCoordinates);
        }}
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
        onMoved={onAnnotationMoved}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
      {svgNodes}
    </g>
  );
};

export default Polygon;
