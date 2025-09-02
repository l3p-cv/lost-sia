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
import Point from "../../models/Point";
import AnnotationMode from "../../models/AnnotationMode";
import AnnotationSettings from "../../models/AnnotationSettings";

type AnnotationComponentProps = {
  scaledAnnotation: Annotation;
  annotationSettings: AnnotationSettings;
  possibleLabels: Label[];
  svgScale: number;
  pageToStageOffset: Point;
  strokeWidth: number;
  nodeRadius: number;
  isSelected: boolean;
  onFinishAnnoCreate: (fullyCreatedAnnotation: Annotation) => void;
  onLabelIconClicked: (markerPosition: Point) => void;
  onAction?: (annotation: Annotation, canvasAction: CanvasAction) => void;
  onAnnoChanged?: (annotation: Annotation) => void;
  onAnnotationModeChange?: (annotationMode: AnnotationMode) => void;
};

const AnnotationComponent = ({
  scaledAnnotation,
  annotationSettings,
  possibleLabels,
  svgScale,
  pageToStageOffset,
  strokeWidth,
  nodeRadius,
  isSelected,
  onFinishAnnoCreate,
  onLabelIconClicked,
  onAction = (_, __) => {},
  onAnnoChanged = (_) => {},
  onAnnotationModeChange = (_) => {},
}: AnnotationComponentProps) => {
  const [coordinates, setCoordinates] = useState<Point[]>(
    scaledAnnotation.coordinates,
  );

  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>(
    scaledAnnotation.mode,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  const finishAnnoCreate = () => {
    setAnnotationMode(AnnotationMode.VIEW);

    const newAnnotation = {
      ...scaledAnnotation,
      coordinates: coordinatesRef.current,
    };

    onFinishAnnoCreate(newAnnotation);
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

  const changeAnnoCoords = (newCoordinates: Point[]) => {
    setCoordinates(newCoordinates);

    // last point is mouse - remove it before export
    let newCoordinatesWithoutMouse = newCoordinates.slice(0, -1);

    onAnnoChanged({
      ...scaledAnnotation,
      coordinates: newCoordinatesWithoutMouse,
    });
  };

  const onMoving = (newCoords: Point[]) => {
    if (annotationMode !== AnnotationMode.CREATE)
      setAnnotationMode(AnnotationMode.MOVE);

    setCoordinates(newCoords);
  };

  const onMoved = () => {
    setAnnotationMode(AnnotationMode.VIEW);

    // moving finished - send event to canvas
    onAnnoChanged({
      ...scaledAnnotation,
      coordinates: coordinatesRef.current,
    });
  };

  useEffect(() => {
    onAnnotationModeChange(annotationMode);
  }, [annotationMode]);

  // apply coordinate changes from sia (e.g. out of image fixes)
  // ignore outside changes while creating annotation
  useEffect(() => {
    if (annotationMode === AnnotationMode.CREATE) return;
    setCoordinates(scaledAnnotation.coordinates);
  }, [scaledAnnotation]);

  const renderAnno = () => {
    switch (scaledAnnotation.type) {
      case AnnotationTool.Point:
        return (
          <PointTool
            annotationMode={annotationMode}
            annotationSettings={annotationSettings}
            coordinates={coordinates[0]}
            pageToStageOffset={pageToStageOffset}
            svgScale={svgScale}
            style={annotationStyle}
            onDeleteNode={() => {
              console.log("TODO");
            }}
            onMoving={(newPoint: Point) => {
              setAnnotationMode(AnnotationMode.MOVE);
              setCoordinates([newPoint]);
            }}
            onMoved={onMoved}
            onIsDraggingStateChanged={setIsDragging}
            onFinishAnnoCreate={finishAnnoCreate}
          />
        );
      case AnnotationTool.Line:
        return (
          <Line
            annotationSettings={annotationSettings}
            coordinates={coordinates}
            isSelected={isSelected}
            pageToStageOffset={pageToStageOffset}
            annotationMode={annotationMode}
            setAnnotationMode={setAnnotationMode}
            svgScale={svgScale}
            style={annotationStyle}
            onAddNode={changeAnnoCoords}
            onDeleteNode={changeAnnoCoords}
            onMoving={onMoving}
            onMoved={onMoved}
            onIsDraggingStateChanged={setIsDragging}
            onFinishAnnoCreate={finishAnnoCreate}
          />
        );
      case AnnotationTool.BBox:
        return (
          <BBox
            annotationMode={annotationMode}
            annotationSettings={annotationSettings}
            startCoords={coordinates[0]}
            endCoords={coordinates[1]}
            isSelected={isSelected}
            pageToStageOffset={pageToStageOffset}
            style={annotationStyle}
            svgScale={svgScale}
            onDeleteNode={() => {
              console.log("TODO");
            }}
            onIsDraggingStateChanged={setIsDragging}
            onFinishAnnoCreate={finishAnnoCreate}
            onMoving={onMoving}
            onMoved={onMoved}
          />
        );
      case AnnotationTool.Polygon:
        return (
          <Polygon
            annotationSettings={annotationSettings}
            coordinates={coordinates}
            isSelected={isSelected}
            pageToStageOffset={pageToStageOffset}
            annotationMode={annotationMode}
            setAnnotationMode={setAnnotationMode}
            svgScale={svgScale}
            style={annotationStyle}
            onAddNode={changeAnnoCoords}
            onDeleteNode={changeAnnoCoords}
            onMoving={onMoving}
            onMoved={onMoved}
            onIsDraggingStateChanged={setIsDragging}
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
          canLabel={annotationSettings.canLabel}
          labels={possibleLabels}
          color={color}
          isSelected={isSelected}
          selectedLabelIds={scaledAnnotation.labelIds}
          style={annotationStyle}
          svgScale={svgScale}
          onLabelIconClicked={onLabelIconClicked}
        />
      )}
      {renderAnno()}
    </g>
  );
};

export default AnnotationComponent;
