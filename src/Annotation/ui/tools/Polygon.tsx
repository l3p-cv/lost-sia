import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";

// rename type to avoid naming conflict
import { Point, SIANotification } from "../../../types";
import Node from "../atoms/Node";
import PolygonArea from "../atoms/PolygonArea";
import AnnotationMode from "../../../models/AnnotationMode";
import Edge from "../atoms/Edge";
import mouse2 from "../../../utils/mouse2";
import { NotificationType } from "../../../models";
import { AnnotationSettings } from "../../../types";

type PolygonProps = {
  annotationSettings: AnnotationSettings;
  coordinates: Point[];
  isSelected: boolean;
  isDisabled?: boolean;
  annotationMode: AnnotationMode;
  setAnnotationMode: (annotationMode: AnnotationMode) => void;
  pageToStageOffset: Point;
  svgScale: number;
  svgTranslation: Point;
  style: CSSProperties;
  onAddNode: (coordinates: Point[]) => void;
  onDeleteNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onIsDraggingStateChanged: (newDraggingState: boolean) => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: () => void; // moving finished - send annotation changed event
  onNotification?: (notification: SIANotification) => void;
};

const Polygon = ({
  annotationSettings,
  coordinates,
  isSelected,
  isDisabled = false,
  annotationMode,
  pageToStageOffset,
  svgScale,
  svgTranslation,
  style,
  onAddNode,
  onDeleteNode,
  onFinishAnnoCreate,
  onIsDraggingStateChanged,
  onMoving,
  onMoved,
  onNotification = (_) => {},
}: PolygonProps) => {
  const [isAnnoDragging, setIsAnnoDragging] = useState<boolean>(false);

  // onMove and onMouseUp events are fired in the same frame
  // use a ref to access the updated value without waiting until the next frame
  const [didAnnoActuallyMove, setDidAnnoActuallyMove] =
    useState<boolean>(false);
  const didAnnoActuallyMoveRef = useRef<boolean>(didAnnoActuallyMove);

  const handleFinishAnnoCreate = () => {
    if (coordinates.length < 3)
      return onNotification({
        message: "Polygons must have at least 3 nodes",
        title: "Polygon Error",
        type: NotificationType.ERROR,
      });

    onFinishAnnoCreate();
  };

  useEffect(() => {
    didAnnoActuallyMoveRef.current = didAnnoActuallyMove;
  }, [didAnnoActuallyMove]);

  const onMouseDown = (e: MouseEvent) => {
    if (annotationSettings.canEdit === false) return;

    if (
      isSelected &&
      annotationMode !== AnnotationMode.CREATE &&
      annotationMode !== AnnotationMode.ADD &&
      e.button === 0
    )
      setIsAnnoDragging(true);

    if (
      e.button === 2 &&
      [AnnotationMode.CREATE, AnnotationMode.ADD].includes(annotationMode)
    ) {
      const antiScaledMousePositionInStageCoordinates =
        mouse2.getAntiScaledMouseStagePosition(
          e,
          pageToStageOffset,
          svgScale,
          svgTranslation,
        );

      const newCoordinates = [...coordinates];
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
        svgTranslation,
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
        svgTranslation={svgTranslation}
        style={style}
        onDeleteNode={() => {
          // 4 is the lowest node count where we can delete one
          if (coordinates.length < 4)
            return onNotification({
              message: "Polygons must have at least 3 nodes",
              title: "Polygon Error",
              type: NotificationType.ERROR,
            });

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
          isDisabled={isDisabled && isSelected}
          pageToStageOffset={pageToStageOffset}
          svgScale={svgScale}
          svgTranslation={svgTranslation}
          style={style}
          onAddNode={(coordinate: Point) => {
            const newCoordinates = [...coordinates];
            newCoordinates.splice(index + 1, 0, coordinate);

            onAddNode(newCoordinates);
          }}
          onDoubleClick={() =>
            annotationMode === AnnotationMode.CREATE && handleFinishAnnoCreate()
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
      {(isAnnoDragging ||
        annotationMode === AnnotationMode.CREATE ||
        annotationMode === AnnotationMode.ADD) &&
        renderInfiniteSelectionArea()}
      <PolygonArea
        annotationSettings={annotationSettings}
        coordinates={coordinates}
        isSelected={isSelected}
        isDisabled={isDisabled}
        annotationMode={annotationMode}
        pageToStageOffset={pageToStageOffset}
        style={style}
        svgScale={svgScale}
        onFinishAnnoCreate={handleFinishAnnoCreate}
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
