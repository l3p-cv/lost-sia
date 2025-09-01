import { CSSProperties, useEffect, useRef, useState } from "react";

// rename type to avoid naming conflict
import Point from "../../../models/Point";
import Node from "../atoms/Node";
import PolygonArea from "../atoms/PolygonArea";
import AnnotationMode from "../../../models/AnnotationMode";
import AnnotationSettings from "../../../models/AnnotationSettings";
import Edge from "../atoms/Edge";
import mouse2 from "../../../utils/mouse2";

type PolygonProps = {
  annotationSettings: AnnotationSettings;
  coordinates: Point[];
  isSelected: boolean;
  annotationMode: AnnotationMode;
  setAnnotationMode: (annotationMode: AnnotationMode) => void;
  pageToStageOffset: Point;
  svgScale: number;
  style: CSSProperties;
  onAddNode: (coordinates: Point[]) => void;
  onDeleteNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onIsDraggingStateChanged: (bool) => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: () => void; // moving finished - send annotation changed event
};

const Polygon = ({
  annotationSettings,
  coordinates,
  isSelected,
  annotationMode,
  pageToStageOffset,
  svgScale,
  style,
  onAddNode,
  onDeleteNode,
  onFinishAnnoCreate,
  onMoving,
  onMoved,
  onIsDraggingStateChanged,
}: PolygonProps) => {
  const [isAnnoDragging, setIsAnnoDragging] = useState<boolean>(false);

  // onMove and onMouseUp events are fired in the same frame
  // use a ref to access the updated value without waiting until the next frame
  const [didAnnoActuallyMove, setDidAnnoActuallyMove] =
    useState<boolean>(false);
  const didAnnoActuallyMoveRef = useRef<boolean>(didAnnoActuallyMove);

  useEffect(() => {
    didAnnoActuallyMoveRef.current = didAnnoActuallyMove;
  }, [didAnnoActuallyMove]);

  const onMouseDown = (e: MouseEvent) => {
    if (annotationSettings.canEdit === false) return;

    if (
      isSelected &&
      annotationMode !== AnnotationMode.CREATE &&
      e.button === 0
    )
      setIsAnnoDragging(true);

    if (e.button === 2 && annotationMode == AnnotationMode.CREATE) {
      const antiScaledMousePositionInStageCoordinates =
        mouse2.getAntiScaledMouseStagePosition(e, pageToStageOffset, svgScale);

      let newCoordinates = [...coordinates];
      newCoordinates.push(antiScaledMousePositionInStageCoordinates);

      onAddNode(newCoordinates);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isAnnoDragging) {
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
        setDidAnnoActuallyMove(true);
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
    onIsDraggingStateChanged(isAnnoDragging);
    if (!isAnnoDragging) return;

    const handleMouseUp = () => {
      setIsAnnoDragging(false);

      if (didAnnoActuallyMoveRef.current) onMoved();
      setDidAnnoActuallyMove(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isAnnoDragging]);

  const renderNodes = () => {
    const svgNodes = coordinates.map((coordinate: Point, index: number) => (
      <Node
        key={`node_${index}`}
        index={index}
        annotationSettings={annotationSettings}
        coordinates={coordinate}
        pageToStageOffset={pageToStageOffset}
        svgScale={svgScale}
        style={style}
        onDeleteNode={() => {
          const newCoordinates = [...coordinates];
          newCoordinates.splice(index, 1);
          onDeleteNode(newCoordinates);
        }}
        onMoving={(index, newPoint) => {
          const newCoordinates = [...coordinates];
          newCoordinates[index] = newPoint;
          onMoving(newCoordinates);
        }}
        onMoved={() => onMoved()}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
    ));

    return svgNodes;
  };

  const renderEdges = () => {
    const svgEdges = coordinates.map((coordinate: Point, index: number) => {
      const endCoordinates: Point =
        index + 1 < coordinates.length
          ? coordinates[index + 1]
          : coordinates[0];

      return (
        <Edge
          key={`edge_${index}`}
          startCoordinate={coordinate}
          endCoordinate={endCoordinates}
          pageToStageOffset={pageToStageOffset}
          svgScale={svgScale}
          style={style}
          onAddNode={(coordinate: Point) => {
            const newCoordinates = [...coordinates];
            newCoordinates.splice(index + 1, 0, coordinate);

            onAddNode(newCoordinates);
          }}
          onDoubleClick={() =>
            annotationMode === AnnotationMode.CREATE && onFinishAnnoCreate()
          }
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
        />
      );
    });
    return svgEdges;
  };

  const renderInfiniteSelectionArea = () => {
    return (
      <circle
        cx={coordinates[0].x}
        cy={coordinates[0].y}
        r={"100%"}
        style={{ opacity: 0 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  // nodes need to be drawn after the polyline to make them clickable
  return (
    <g>
      {(isAnnoDragging || annotationMode === AnnotationMode.CREATE) &&
        renderInfiniteSelectionArea()}
      <PolygonArea
        annotationSettings={annotationSettings}
        coordinates={coordinates}
        isSelected={isSelected}
        annotationMode={annotationMode}
        pageToStageOffset={pageToStageOffset}
        style={style}
        svgScale={svgScale}
        onAddNode={onAddNode}
        onFinishAnnoCreate={onFinishAnnoCreate}
        onMoving={onMoving}
        onMoved={() => onMoved()}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      />
      {isSelected && annotationSettings.canEdit && renderEdges()}
      {isSelected && annotationMode !== AnnotationMode.CREATE && renderNodes()}
    </g>
  );
};

export default Polygon;
