import { CSSProperties, MouseEvent, useEffect, useState } from "react";
import Point from "../../../models/Point";
import AnnotationMode from "../../../models/AnnotationMode";
import mouse2 from "../../../utils/mouse2";

type PolylineProps = {
  coordinates: Point[];
  isSelected: boolean;
  annotationMode: AnnotationMode;
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

      onMoving(movedCoordinates);
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
      onMoved();
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
      // if (coordinates.length > 1) newCoordinates = newCoordinates.splice(0, -1);
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
