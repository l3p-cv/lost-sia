import { CSSProperties, ReactElement } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";

type LineProps = {
  coordinates: Point[];
  isSelected: boolean;
  style: CSSProperties;
};

const Line = ({ coordinates, isSelected, style }: LineProps) => {
  // draw nodes
  let svgNodes: ReactElement[] = [];
  if (isSelected) {
    svgNodes = coordinates.map((coordinate: Point) => (
      <circle cx={coordinate.x} cy={coordinate.y} r={10} style={style} />
    ));
  }

  // draw line between nodes
  const svgLineCoords: string = coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <g>
      {svgNodes}
      <polyline points={svgLineCoords} style={{ ...style, fill: "none" }} />
    </g>
  );
};

export default Line;
