import { CSSProperties, MouseEvent, useEffect, useState } from "react";
import Point from "../../../models/Point";
import mouse2 from "../../../utils/mouse2";

type NodeProps = {
  index: number;
  coordinates: Point;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onMoving: (index: number, coordinates: Point) => void;
  onMoved: () => void;
  onIsDraggingStateChanged: (bool) => void;
};

const Node = ({
  index,
  coordinates,
  pageToStageOffset,
  svgScale,
  style,
  onMoving, // during moving - update coordinates in parent
  onMoved, // moving finished - send annotation changed event
  onIsDraggingStateChanged,
}: NodeProps) => {
  const [hasHalo, setHasHalo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const antiScaledMousePositionInStageCoordinates =
      mouse2.getAntiScaledMouseStagePosition(e, pageToStageOffset, svgScale);

    onMoving(index, antiScaledMousePositionInStageCoordinates);
  };

  useEffect(() => {
    onIsDraggingStateChanged(isDragging);
    if (!isDragging) return;

    const handleMouseUp = () => {
      setIsDragging(false);
      onMoved();
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const renderHalo = () => {
    return (
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={12 / svgScale}
        onMouseLeave={(e) => setHasHalo(false)}
        onMouseDown={() => setIsDragging(true)}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  const renderInfiniteSelectionArea = () => {
    return (
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={"100%"}
        style={{ opacity: 0 }}
        onMouseMove={(e) => onMouseMove(e)}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  return (
    <g>
      {isDragging && renderInfiniteSelectionArea()}
      {hasHalo && renderHalo()}
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={10 / svgScale}
        style={style}
        onMouseOver={() => {
          setHasHalo(true);
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={(e) => onMouseMove(e)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </g>
  );
};

export default Node;
