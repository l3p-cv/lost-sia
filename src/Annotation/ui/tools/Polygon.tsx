import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";

type PolygonProps = {
  coordinates: Point[];
  isSelected: boolean;
  style: CSSProperties;
};

const Polygon = ({ coordinates, isSelected, style }: PolygonProps) => {
  // draw nodes
  let svgNodes: ReactElement[] = [];
  if (isSelected) {
    svgNodes = coordinates.map((coordinate: Point) => (
      <circle cx={coordinate.x} cy={coordinate.y} r={10} style={style} />
    ));
  }

  // only modify for rendering
  const _coordinates = [...coordinates];

  // add the first coordinate again as the last one
  _coordinates.push(_coordinates[0]);

  // draw line between nodes
  const svgLineCoords: string = _coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  const lineStyle = isSelected
    ? { ...style, fill: "none" }
    : { ...style, fillOpacity: 0.3 };

  return (
    <g>
      {svgNodes}
      <polyline points={svgLineCoords} style={lineStyle} />
    </g>
  );
};

export default Polygon;
