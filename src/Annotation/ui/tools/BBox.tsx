import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";

type BBoxProps = {
  startCoords: Point;
  endCoords: Point;
  isSelected: boolean;
  style: CSSProperties;
};

const BBox = ({ startCoords, endCoords, isSelected, style }: BBoxProps) => {
  // build up 4 coordinates ("u"-style, 1 for each corner)
  const coordinates: Point[] = [
    startCoords,
    { x: startCoords.x, y: endCoords.y },
    endCoords,
    { x: endCoords.x, y: startCoords.y },
  ];

  // draw nodes
  let svgNodes: ReactElement[] = [];
  if (isSelected) {
    svgNodes = coordinates.map((coordinate: Point) => (
      <circle cx={coordinate.x} cy={coordinate.y} r={10} style={style} />
    ));
  }

  // add start coorinate to add the last line of the rectangle
  coordinates.push(startCoords);

  // draw line between nodes
  const svgLineCoords: string = coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  const polylineStlye = isSelected
    ? { ...style, fill: "none" }
    : { ...style, fillOpacity: 0.3 };

  return (
    <g>
      {svgNodes}
      <polyline points={svgLineCoords} style={polylineStlye} />
    </g>
  );
};

export default BBox;
