import { CSSProperties } from "react";

// rename type to avoid naming conflict
import TPoint from "../../../models/Point";

type PointProps = {
  coordinates: TPoint;
  isSelected: boolean;
  style: CSSProperties;
};

const Point = ({ coordinates, isSelected, style }: PointProps) => {
  return (
    <g>
      <circle cx={coordinates.x} cy={coordinates.y} r={10} style={style} />
    </g>
  );
};

export default Point;
