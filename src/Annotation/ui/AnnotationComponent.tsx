import AnnotationTool from "../../models/AnnotationTool";
import Label from "../../models/Label";
import Annotation from "../logic/Annotation";
import * as colorUtils from "../../utils/color";
import PointTool from "./tools/Point";
import Line from "./tools/Line";
import AnnoBar from "./atoms/AnnoBar";
import CanvasAction from "../../models/CanvasAction";
import BBox from "./tools/BBox";
import Polygon from "./tools/Polygon";
import { useEffect, useRef, useState } from "react";
import transform2 from "../../utils/transform2";
import Point from "../../models/Point";
import AnnotationMode from "../../models/AnnotationMode";

type AnnotationComponentProps = {
  scaledAnnotation: Annotation;
  possibleLabels: Label[];
  svgScale: number;
  pageToStageOffset: Point;
  strokeWidth: number;
  nodeRadius: number;
  isSelected: boolean;
  onFinishAnnoCreate: (fullyCreatedAnnotation: Annotation) => void;
  onAction?: (annotation: Annotation, canvasAction: CanvasAction) => void;
  onAnnoChanged?: (annotation: Annotation) => void;
};

const AnnotationComponent = ({
  scaledAnnotation,
  possibleLabels,
  svgScale,
  pageToStageOffset,
  strokeWidth,
  nodeRadius,
  isSelected,
  onFinishAnnoCreate,
  onAction = (_, __) => {},
  onAnnoChanged = (_) => {},
}: AnnotationComponentProps) => {
  // const [topLeftPoint, setTopLeftPoint] = useState<Point>({ x: 0, y: 0 });

  const [isModified, setIsModified] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Point[]>(
    scaledAnnotation.coordinates,
  );

  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>(
    scaledAnnotation.mode,
  );

  /**
   * during user editing of the annotation, multiple events are fired by the children
   * onMoving for updating the data
   * onMoved for telling its parents (us) that the user has finished moving
   * onMoved has no access to up-to-date coordinates, because the state is always one render step behind the setState
   * since both events are fired during the same render, onMoved would give away old coorinates
   * use this reference as a workaround to get the up-to-date coordinates even in this edge-case
   */
  const coordinatesRef = useRef<Point[]>(coordinates);

  useEffect(() => {
    coordinatesRef.current = coordinates;
  }, [coordinates]);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // useEffect(() => {
  //   // recalculate all coordinates to match the resized image

  //   // get the most top left point
  //   const topPoints: Point[] = transform2.getTopPoint(
  //     scaledAnnotation.coordinates,
  //   );
  //   const newTopLeftPoint: Point = transform2.getMostLeftPoints(topPoints)[0];
  //   setTopLeftPoint(newTopLeftPoint);
  // }, [scaledAnnotation]);

  const finishAnnoCreate = () => {
    setAnnotationMode(AnnotationMode.VIEW);
    onFinishAnnoCreate(scaledAnnotation);
  };

  const getLabel = (labelId: number): Label | undefined => {
    return possibleLabels.find((label: Label) => {
      return label.id === labelId;
    });
  };

  const getColor = () => {
    if (!scaledAnnotation.labelIds || scaledAnnotation.labelIds.length == 0)
      return colorUtils.getDefaultColor();

    const label = getLabel(scaledAnnotation.labelIds[0]);

    if (label === undefined || label.color === undefined)
      return colorUtils.getDefaultColor();

    return label.color;
  };

  const color = getColor();
  const annotationStyle = {
    stroke: color,
    fill: color,
    strokeWidth: strokeWidth / svgScale,
    r: nodeRadius / svgScale,
  };

  const renderAnno = () => {
    switch (scaledAnnotation.type) {
      case AnnotationTool.Point:
        return (
          <PointTool
            coordinates={scaledAnnotation.coordinates[0]}
            isSelected={isSelected}
            style={annotationStyle}
          />
        );
      case AnnotationTool.Line:
        return (
          <Line
            coordinates={scaledAnnotation.coordinates}
            isSelected={isSelected}
            style={annotationStyle}
          />
        );
      case AnnotationTool.BBox:
        return (
          <BBox
            startCoords={scaledAnnotation.coordinates[0]}
            endCoords={scaledAnnotation.coordinates[1]}
            isSelected={isSelected}
            style={annotationStyle}
          />
        );
      case AnnotationTool.Polygon:
        return (
          <Polygon
            coordinates={coordinates}
            isSelected={isSelected}
            pageToStageOffset={pageToStageOffset}
            annotationMode={annotationMode}
            setAnnotationMode={setAnnotationMode}
            svgScale={svgScale}
            style={annotationStyle}
            onMoving={setCoordinates}
            onMoved={() => {
              // moving finished - send event to canvas
              onAnnoChanged({
                ...scaledAnnotation,
                coordinates: coordinatesRef.current,
              });
            }}
            onIsDraggingStateChanged={setIsDragging}
            onAddNode={(newCoordinates: Point[]) => {
              setCoordinates(newCoordinates);

              // last point is mouse - remove it before export
              let newCoordinatesWithoutMouse = newCoordinates.slice(0, -1);

              onAnnoChanged({
                ...scaledAnnotation,
                coordinates: newCoordinatesWithoutMouse,
              });
            }}
            onFinishAnnoCreate={finishAnnoCreate}
          />
        );
    }
  };

  return (
    <g
      // visibility={this.state.visibility}
      // onClick={(e) => this.onClick(e)}
      // onMouseDown={(e) => this.onMouseDown(e)}
      // onContextMenu={(e) => this.onContextMenu(e)}
      onClick={(e) => {
        e.stopPropagation();
        onAction(scaledAnnotation, CanvasAction.ANNO_SELECTED);
      }}
    >
      {!isDragging && annotationMode !== AnnotationMode.CREATE && (
        <AnnoBar
          annotationCoordinates={coordinates}
          labels={[]}
          color={color}
          isSelected={isSelected}
          style={annotationStyle}
          svgScale={svgScale}
        />
      )}
      {renderAnno()}
    </g>
  );
};

export default AnnotationComponent;
