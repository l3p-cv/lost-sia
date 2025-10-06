import { CSSProperties, MouseEvent } from "react";
import { Point, Vector2 } from "../../../types";
import mouse2 from "../../../utils/mouse2";

type EdgeProps = {
  startCoordinate: Point;
  endCoordinate: Point;
  isDisabled?: boolean;
  pageToStageOffset: Point;
  svgScale: number;
  svgTranslation: Vector2;
  style: CSSProperties;
  onAddNode?: (coordinate: Point) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
};

const Edge = ({
  startCoordinate,
  endCoordinate,
  isDisabled = false,
  pageToStageOffset,
  style,
  svgScale,
  svgTranslation,
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
      svgTranslation,
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
      strokeDasharray={isDisabled ? "10,5" : "0"}
    />
  );
};

export default Edge;
