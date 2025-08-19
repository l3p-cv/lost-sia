import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";

type PolygonProps = {
  coordinates: Point[];
  isSelected: boolean;
  imagePageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onNodeMoved: (coordinates: Point[]) => void;
  onIsDraggingStateChanged: (bool) => void;
};

const Polygon = ({
  coordinates,
  isSelected,
  imagePageOffset,
  svgScale,
  style,
  onNodeMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  // only modify for rendering
  const _coordinates = [...coordinates];

  // add the first coordinate again as the last one
  _coordinates.push(_coordinates[0]);

  // draw line between nodes
  const svgLineCoords: string = _coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

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

  const lineStyle = isSelected
    ? { ...style, fill: "none" }
    : { ...style, fillOpacity: 0.3 };

  // nodes need to be drawn after the polyline to make them clickable
  return (
    <g>
      <polyline points={svgLineCoords} style={lineStyle} />
      {svgNodes}
    </g>
  );
};

export default Polygon;
