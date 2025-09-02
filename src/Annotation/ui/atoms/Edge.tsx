import { CSSProperties } from "react";
import Point from "../../../models/Point";
import mouse2 from "../../../utils/mouse2";

type EdgeProps = {
  startCoordinate: Point;
  endCoordinate: Point;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onAddNode?: (coordinate: Point) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
};

const Edge = ({
  startCoordinate,
  endCoordinate,
  pageToStageOffset,
  style,
  svgScale,
  onAddNode = () => {},
  onDoubleClick = () => {},
  onMouseDown,
  onMouseMove,
}: EdgeProps) => {
  const addNode = (e: MouseEvent) => {
    const mouseStageCoords: Point = mouse2.getAntiScaledMouseStagePosition(
      e,
      pageToStageOffset,
      svgScale,
    );

    onAddNode(mouseStageCoords);
  };

  return (
    <line
      x1={startCoordinate.x}
      y1={startCoordinate.y}
      x2={endCoordinate.x}
      y2={endCoordinate.y}
      style={style}
      onClick={(e) => e.ctrlKey && addNode(e)}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Edge;
