import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { Point } from "../../../types";
import mouse2 from "../../../utils/mouse2";
import AnnotationSettings from "../../../models/AnnotationSettings";

type NodeProps = {
  index: number;
  coordinates: Point;
  annotationSettings: AnnotationSettings;
  pageToStageOffset: Point;
  svgScale: number;
  svgTranslation: Point;
  style: CSSProperties;
  onDeleteNode: () => void;
  onMoving: (index: number, coordinates: Point) => void;
  onMoved: () => void;
  onIsDraggingStateChanged: (bool) => void;
};

const Node = ({
  index,
  coordinates,
  annotationSettings,
  pageToStageOffset,
  svgScale,
  svgTranslation,
  style,
  onDeleteNode,
  onMoving, // during moving - update coordinates in parent
  onMoved, // moving finished - send annotation changed event
  onIsDraggingStateChanged,
}: NodeProps) => {
  const [hasHalo, setHasHalo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // onMove and onMouseUp events are fired in the same frame
  // use a ref to access the updated value without waiting until the next frame
  const [didItActuallyMove, setDidItActuallyMove] = useState<boolean>(false);
  const didItActuallyMoveRef = useRef<boolean>(didItActuallyMove);

  useEffect(() => {
    didItActuallyMoveRef.current = didItActuallyMove;
  }, [didItActuallyMove]);

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const antiScaledMousePositionInStageCoordinates =
      mouse2.getAntiScaledMouseStagePosition(
        e,
        pageToStageOffset,
        svgScale,
        svgTranslation,
      );

    // only escalate event when mouse actually moved
    if (e.movementX !== 0 || e.movementY !== 0) {
      setDidItActuallyMove(true);
      onMoving(index, antiScaledMousePositionInStageCoordinates);
    }
  };

  useEffect(() => {
    onIsDraggingStateChanged(isDragging);
    if (!isDragging) return;

    const handleMouseUp = () => {
      setIsDragging(false);
      if (didItActuallyMoveRef.current) onMoved();
      setDidItActuallyMove(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const onMouseDown = (e: MouseEvent) => {
    if (!annotationSettings.canEdit) return;

    if (e.ctrlKey) onDeleteNode();
    else setIsDragging(true);
  };

  const renderHalo = () => {
    return (
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={12 / svgScale}
        onMouseLeave={(_) => annotationSettings.canEdit && setHasHalo(false)}
        onMouseDown={onMouseDown}
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
          if (annotationSettings.canEdit) setHasHalo(true);
        }}
        onMouseDown={onMouseDown}
        onMouseMove={(e) => onMouseMove(e)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </g>
  );
};

export default Node;
