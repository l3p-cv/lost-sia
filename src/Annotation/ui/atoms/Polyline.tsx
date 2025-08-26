import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import Point from "../../../models/Point";
import AnnotationMode from "../../../models/AnnotationMode";
import mouse2 from "../../../utils/mouse2";
import AnnotationSettings from "../../../models/AnnotationSettings";

type PolylineProps = {
  coordinates: Point[];
  isSelected: boolean;
  annotationMode: AnnotationMode;
  annotationSettings: AnnotationSettings;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onAddNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: () => void; // moving finished - send annotation changed event
  onIsDraggingStateChanged: (bool) => void;
};

const Polyline = ({
  coordinates,
  isSelected,
  annotationMode,
  annotationSettings,
  pageToStageOffset,
  style,
  svgScale,
  onAddNode,
  onFinishAnnoCreate,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PolylineProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // onMove and onMouseUp events are fired in the same frame
  // use a ref to access the updated value without waiting until the next frame
  const [didItActuallyMove, setDidItActuallyMove] = useState<boolean>(false);
  const didItActuallyMoveRef = useRef<boolean>(didItActuallyMove);

  useEffect(() => {
    didItActuallyMoveRef.current = didItActuallyMove;
  }, [didItActuallyMove]);

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // apply mouse move to all coordinates
      const movedCoordinates: Point[] = coordinates.map((coordinate: Point) => {
        return {
          // counter the canvas scaling (it will be automatically applied when rendering the annotation coordinates)
          x: (coordinate.x += e.movementX / svgScale),
          y: (coordinate.y += e.movementY / svgScale),
        };
      });

      // only escalate event when mouse actually moved
      if (e.movementX !== 0 || e.movementY !== 0) {
        setDidItActuallyMove(true);
        onMoving(movedCoordinates);
      }
    }

    if (annotationMode === AnnotationMode.CREATE) {
      const mousePointInStage = mouse2.getAntiScaledMouseStagePosition(
        e,
        pageToStageOffset,
        svgScale,
      );

      let newCoords: Point[] = [...coordinates];

      // last coordinate = mouse position - update it
      if (coordinates.length > 1) newCoords = coordinates.slice(0, -1);

      newCoords.push(mousePointInStage);

      onMoving(newCoords);
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

  // only modify for rendering
  const _coordinates = [...coordinates];

  // add the first coordinate again as the last one
  _coordinates.push(_coordinates[0]);

  // draw line between nodes
  const svgLineCoords: string = _coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  const mouseDown = (e: MouseEvent) => {
    if (annotationSettings.canEdit === false) return;

    if (
      isSelected &&
      annotationMode !== AnnotationMode.CREATE &&
      e.button === 0
    )
      setIsDragging(true);

    if (e.button === 2 && annotationMode == AnnotationMode.CREATE) {
      const antiScaledMousePositionInStageCoordinates =
        mouse2.getAntiScaledMouseStagePosition(e, pageToStageOffset, svgScale);

      let newCoordinates = [...coordinates];
      newCoordinates.push(antiScaledMousePositionInStageCoordinates);

      onAddNode(newCoordinates);
    }
  };

  const renderInfiniteSelectionArea = () => {
    return (
      <circle
        cx={coordinates[0].x}
        cy={coordinates[0].y}
        r={"100%"}
        style={{ opacity: 0 }}
        onMouseDown={mouseDown}
        onMouseMove={onMouseMove}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  // adjust style for polyline
  const polyLineStyle = { ...style };
  polyLineStyle.cursor = "pointer";
  polyLineStyle.fillOpacity = isSelected ? 0 : 0.3;

  return (
    <>
      {(isDragging || annotationMode === AnnotationMode.CREATE) &&
        renderInfiniteSelectionArea()}
      <polyline
        points={svgLineCoords}
        style={polyLineStyle}
        onMouseDown={mouseDown}
        onDoubleClick={() =>
          annotationMode === AnnotationMode.CREATE && onFinishAnnoCreate()
        }
        onMouseMove={onMouseMove}
        onContextMenu={(e) => e.preventDefault()}
      />
    </>
  );
};

export default Polyline;
