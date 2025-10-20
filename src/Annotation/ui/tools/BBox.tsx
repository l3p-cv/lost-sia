import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";

// rename type to avoid naming conflict
import { AnnotationSettings, Point } from "../../../types";
import Node from "../atoms/Node";
import AnnotationMode from "../../../models/AnnotationMode";
import mouse2 from "../../../utils/mouse2";
import PolygonArea from "../atoms/PolygonArea";
import Edge from "../atoms/Edge";

type BBoxProps = {
  annotationMode: AnnotationMode;
  annotationSettings: AnnotationSettings;
  pageToStageOffset: Point;
  startCoords: Point;
  endCoords: Point;
  svgScale: number;
  svgTranslation: Point;
  isSelected: boolean;
  style: CSSProperties;
  onDeleteNode: (coordinates: Point[]) => void;
  onFinishAnnoCreate: () => void;
  onIsDraggingStateChanged: (newDraggingState: boolean) => void;
  onMoving: (coordinates: Point[]) => void; // during moving - update coordinates in parent
  onMoved: () => void; // moving finished - send annotation changed event
};

const BBox = ({
  annotationMode,
  annotationSettings,
  pageToStageOffset,
  startCoords,
  endCoords,
  svgScale,
  svgTranslation,
  isSelected,
  style,
  onDeleteNode,
  onFinishAnnoCreate,
  onIsDraggingStateChanged,
  onMoving,
  onMoved,
}: BBoxProps) => {
  // build up 4 coordinates ("u"-style, 1 for each corner)
  const coordinates: Point[] = [
    startCoords,
    { x: startCoords.x, y: endCoords.y },
    endCoords,
    { x: endCoords.x, y: startCoords.y },
  ];

  const [isAnnoCreating, setIsAnnoCreating] = useState<boolean>(
    annotationMode === AnnotationMode.CREATE,
  );
  const [isAnnoDragging, setIsAnnoDragging] = useState<boolean>(false);
  const [isEdgeDragging, setIsEdgeDragging] = useState<boolean>(false);
  const [dragSelectedEdgeIndex, setDragSelectedEdgeIndex] = useState<number>(0);

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
  };

  const onMouseEdgeDown = (e: MouseEvent) => {
    if (annotationSettings.canEdit === false) return;

    if (
      isSelected &&
      annotationMode !== AnnotationMode.CREATE &&
      e.button === 0
    )
      setIsEdgeDragging(true);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isAnnoDragging) {
      // we always get 4 coordinates (the rectangle corners)
      // only the top left and bottom right corner are important - other coordinates are redundant
      const newRectangle: Point[] = [
        { ...coordinates[0] },
        { ...coordinates[2] },
      ];

      // apply mouse move to the rectangle coordinates
      const movedCoordinates: Point[] = newRectangle.map(
        (coordinate: Point) => {
          return {
            // counter the canvas scaling (it will be automatically applied when rendering the annotation coordinates)
            x: (coordinate.x += e.movementX / svgScale),
            y: (coordinate.y += e.movementY / svgScale),
          };
        },
      );

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

      const newCoords: Point[] = [...coordinates];

      // we always get 4 coordinates (the rectangle corners)
      // only the top left (start) is important - the end will be our mouse position and the others are redundant
      const newRectangle: Point[] = [newCoords[0], mousePointInStage];

      onMoving(newRectangle);
    }
  };

  useEffect(() => {
    if (!isAnnoCreating) return;

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      if (e.button === 2) {
        onFinishAnnoCreate();
        setIsAnnoCreating(false);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isAnnoCreating]);

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

  useEffect(() => {
    onIsDraggingStateChanged(isEdgeDragging);
    if (!isEdgeDragging) return;

    const handleMouseUp = () => {
      setIsEdgeDragging(false);

      if (didAnnoActuallyMoveRef.current) onMoved();
      setDidAnnoActuallyMove(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEdgeDragging]);

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
          const newCoordinates = [...coordinates];
          newCoordinates.splice(index, 1);
          onDeleteNode(newCoordinates);
        }}
        onMoving={(index: number, newPoint: Point) => {
          // we always get 4 coordinates (the rectangle corners)
          // only the top left and bottom right corner are important - other coordinates are redundant
          const newRectangle: Point[] = [coordinates[0], coordinates[2]];

          // update start + end coordinates depending on which corner is moved
          switch (index) {
            case 0: // top left corner
              newRectangle[0] = newPoint;
              break;
            case 1: // bottom left corner
              newRectangle[0].x = newPoint.x;
              newRectangle[1].y = newPoint.y;
              break;
            case 2: // bottom right corner
              newRectangle[1] = newPoint;
              break;
            case 3: // top right corner
              newRectangle[1].x = newPoint.x;
              newRectangle[0].y = newPoint.y;
              break;
          }

          onMoving(newRectangle);
        }}
        onMoved={() => onMoved()}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
      />
    ));

    return svgNodes;
  };

  const moveEdge = (edgeIndex: number, e: MouseEvent) => {
    // we always get 4 coordinates (the rectangle corners)
    // only the top left and bottom right corner are important - other coordinates are redundant
    const newRectangle: Point[] = [coordinates[0], coordinates[2]];
    switch (edgeIndex) {
      case 0:
        newRectangle[0].x += e.movementX / svgScale;
        break;
      case 1:
        newRectangle[1].y += e.movementY / svgScale;
        break;
      case 2:
        newRectangle[1].x += e.movementX / svgScale;
        break;
      case 3:
        newRectangle[0].y += e.movementY / svgScale;
        break;
    }

    // only escalate event when mouse actually moved
    if (e.movementX !== 0 || e.movementY !== 0) {
      setDidAnnoActuallyMove(true);
      onMoving(newRectangle);
    }
  };

  const renderEdges = () => {
    const svgEdges = coordinates.map((coordinate: Point, index: number) => {
      const endCoordinates: Point =
        index + 1 < coordinates.length
          ? coordinates[index + 1]
          : coordinates[0];

      // corresponding cursor for horizontal or vertical edges
      const cursor = index % 2 === 0 ? "ew-resize" : "ns-resize";

      return (
        <Edge
          key={`edge_${index}`}
          startCoordinate={coordinate}
          endCoordinate={endCoordinates}
          pageToStageOffset={pageToStageOffset}
          svgScale={svgScale}
          svgTranslation={svgTranslation}
          style={{ ...style, cursor }}
          onMouseDown={onMouseEdgeDown}
          onMouseMove={(e: MouseEvent) => {
            setDragSelectedEdgeIndex(index);
            if (isEdgeDragging) moveEdge(index, e);
          }}
        />
      );
    });
    return svgEdges;
  };

  const renderInfiniteSelectionArea = (isForEdge: boolean) => {
    return (
      <circle
        cx={coordinates[0].x}
        cy={coordinates[0].y}
        r={"100%"}
        style={{ opacity: 0 }}
        onMouseDown={onMouseDown}
        onMouseMove={(e: MouseEvent) => {
          if (isForEdge && isEdgeDragging) moveEdge(dragSelectedEdgeIndex, e);
          if (!isForEdge) onMouseMove(e);
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  return (
    <g>
      {(isAnnoDragging || annotationMode === AnnotationMode.CREATE) &&
        renderInfiniteSelectionArea(false)}
      <PolygonArea
        annotationSettings={annotationSettings}
        coordinates={coordinates}
        isSelected={isSelected}
        annotationMode={annotationMode}
        pageToStageOffset={pageToStageOffset}
        style={style}
        svgScale={svgScale}
        onIsDraggingStateChanged={onIsDraggingStateChanged}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      />
      {isEdgeDragging && renderInfiniteSelectionArea(true)}
      {isSelected && annotationSettings.canEdit && renderEdges()}
      {isSelected && annotationMode !== AnnotationMode.CREATE && renderNodes()}
    </g>
  );
};

export default BBox;
