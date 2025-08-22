import { CSSProperties, MouseEvent, useEffect, useState } from "react";
import Point from "../../../models/Point";

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

  const onMouseDown = () => {
    setIsDragging(true);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // get page coordinates of current mouse position
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems
    // convert them into image coordinates by subtrating the offset between image and page
    const mousePositionInImageCoordinates: Point = {
      x: e.pageX - pageToStageOffset.x,
      y: e.pageY - pageToStageOffset.y,
    };

    // now we need to counter the canvas scaling, because it will be automatically applied when rendering the annotation coordinates
    const antiScaledMousePositionInImageCoordinates: Point = {
      x: mousePositionInImageCoordinates.x / svgScale,
      y: mousePositionInImageCoordinates.y / svgScale,
    };

    onMoving(index, antiScaledMousePositionInImageCoordinates);
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
        onMouseDown={(e) => onMouseDown()}
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
        onMouseDown={(e) => onMouseDown()}
        onMouseMove={(e) => onMouseMove(e)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </g>
  );
};

export default Node;
