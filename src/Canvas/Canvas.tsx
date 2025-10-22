import React, {
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from "react";
import AnnotationTool from "../models/AnnotationTool";
import EditorModes from "../models/EditorModes";
import KeyMapper from "../utils/KeyMapper";
import KeyAction from "../models/KeyAction";
import Annotation from "../Annotation/logic/Annotation";
import CanvasAction from "../models/CanvasAction";
import AnnotationComponent from "../Annotation/ui/AnnotationComponent";
import { AnnotationSettings, Label, UiConfig } from "../types";
import {
  Point,
  PolygonOperationResult,
  SIANotification,
  ToolCoordinates,
  Vector2,
} from "../types";
import mouse2 from "../utils/mouse2";
import AnnotationMode from "../models/AnnotationMode";
import LabelInput from "./LabelInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AnnotationStatus from "../models/AnnotationStatus";
import transform2 from "../utils/transform2";
import NotificationType from "../models/NotificationType";

type CanvasProps = {
  annotations?: Annotation[];
  annotationSettings: AnnotationSettings;
  defaultLabelId?: number;
  image: string;
  isFullscreen?: boolean;
  isImageJunk?: boolean;
  isPolygonSelectionMode?: boolean;
  selectedAnnotation: Annotation | undefined;
  selectedAnnoTool: AnnotationTool;
  toolbarHeight?: number;
  polygonOperationResult?: PolygonOperationResult;
  possibleLabels: Label[];
  preventScrolling?: boolean;
  uiConfig: UiConfig;
  // onKeyDown?: (e) => void | undefined;
  // onKeyUp?: (e) => void | undefined;
  onAnnoCreated: (createdAnno: Annotation) => void;
  onAnnoCreationFinished: (
    createdAnno: Annotation,
    hasAnnotationExisted: boolean,
  ) => void;
  onAnnoChanged: (changedAnno: Annotation) => void;
  onAnnoEditing: (annoToEdit: Annotation) => void;
  // onAnnoDeleted: (deletedAnno: Annotation, allAnnos: Annotation[]) => void;
  onNotification?: (notification: SIANotification) => void;
  onRequestNewAnnoId: () => number;
  onSelectAnnotation: (annotation?: Annotation) => void;
  onSetSelectedTool: (tool: AnnotationTool) => void;
  onShouldDeleteAnno: (internalAnnoId: number) => void;
};

const Canvas = ({
  annotations = [],
  annotationSettings,
  defaultLabelId,
  image,
  isFullscreen = false,
  isImageJunk = false,
  isPolygonSelectionMode = false,
  polygonOperationResult = { annotationsToDelete: [], polygonsToCreate: [] },
  possibleLabels,
  preventScrolling = true,
  selectedAnnotation,
  selectedAnnoTool,
  toolbarHeight = 0,
  uiConfig,
  // onKeyDown: propOnKeyDown,
  // onKeyUp: propsOnKeyUp,
  onAnnoCreated,
  onAnnoCreationFinished,
  onAnnoChanged,
  onAnnoEditing = (_) => {},
  onNotification = (_) => {},
  onRequestNewAnnoId,
  onSelectAnnotation,
  onSetSelectedTool = (_) => {},
  onShouldDeleteAnno,
}: CanvasProps) => {
  const [editorMode, setEditorMode] = useState<EditorModes>(EditorModes.VIEW);

  // remember which label was added last
  const [currentLabelId, setCurrentLabelId] = useState<number | undefined>(
    defaultLabelId,
  );

  // vector from the top left of the DOM document to the top left of the stage
  // (events are emitting page coordinates, so we need this to convert them)
  const [pageToCanvasOffset, setPageToCanvasOffset] = useState<Point>({
    x: -1,
    y: -1,
  });

  // space to add to the x translation to center the image
  const [imageCenteringSpace, setImageCenteringSpace] = useState<number>(0);

  // the stage can be horizontally centered - apply offset on x axis
  const pageToStageOffset: Vector2 = {
    // x: pageToCanvasOffset.x + imageCenteringSpace,
    x: pageToCanvasOffset.x,
    y: pageToCanvasOffset.y,
  };

  // default (unscaled) image and canvas sizes (for stage calculation)
  // invalid default value, so that the image uses its default values at first
  const [imgSize, setImgSize] = useState<Vector2>({ x: -1, y: -1 });
  const [canvasSize, setCanvasSize] = useState<Vector2>({ x: -1, y: -1 });

  // largest possible annotation size fitting the whole image
  const [stageSize, setStageSize] = useState<Vector2>({ x: -1, y: -1 });

  const [svgScale, setSvgScale] = useState<number>(1.0);
  const [svgTranslation, setSvgTranslation] = useState<Vector2>({ x: 0, y: 0 });
  const centeredSvgTranslation: Vector2 = {
    x: svgTranslation.x + imageCenteringSpace,
    y: svgTranslation.y,
  };

  // label input will be opened if a position is set here
  const [labelInputPosition, setLabelInputPosition] = useState<Point>();
  const [isLabelInputVisible, setIsLabelInputVisible] =
    useState<boolean>(false);

  // available canvas area - all possible space for creating a canvas
  const canvasRef = useRef(null);

  // used to get the size of the dynamically loaded image
  const imageRef = useRef(null);

  // returns the aspect ratio of the largest image size fitting onto the canvas without changing the aspect ratio
  const getFittedImageScale = (imgSize: Vector2, svgSize: Vector2): number => {
    if (
      imgSize.x === 0 ||
      imgSize.y === 0 ||
      svgSize.x === 0 ||
      svgSize.y === 0
    )
      return 0;

    const scaleX = svgSize.x / imgSize.x;
    const scaleY = svgSize.y / imgSize.y;

    return Math.min(scaleX, scaleY);
  };

  // factor to convert coordinates from an (untransformed) image into the stage
  const imageToStageFactor = getFittedImageScale(imgSize, canvasSize);

  // store + update the vector between start of the page and start of the (translated) image to be able to do transformations
  const calculatePageToCanvasOffset = () => {
    if (imageRef?.current === null) return { x: 0, y: 0 };

    // if image can and should be centered
    const resizedImageWidth: number = imgSize.x * imageToStageFactor;
    if (uiConfig.imageCentered && canvasSize.x > resizedImageWidth) {
      // image is at (0,0) - get the blanc space at the right side of the image
      const remainingSpace: number = canvasSize.x - resizedImageWidth;

      // divide remaining space to be equal to the left and right side
      const spaceToLeft: number = remainingSpace / 2;

      // page to stage offset marks the top left point of the stage
      // add the space to the translation to center the image
      setImageCenteringSpace(spaceToLeft);
    } else {
      setImageCenteringSpace(0);
    }

    // get image starting position in window coordinates
    const { top, left } = canvasRef.current.getBoundingClientRect();

    // top and left are in window coordinates
    // we need to convert them to page coordinates
    const pageOffset: Point = {
      x: left + window.scrollX,
      y: top + window.scrollY,
    };

    setPageToCanvasOffset(pageOffset);
  };

  // const pageToStageOffset = calculatePageToStageOffset();

  const keyMapper = new KeyMapper((keyAction: KeyAction) =>
    handleKeyAction(keyAction),
  );

  const createNewAnnotation = (antiScaledMouseStagePosition: Point) => {
    // switch to editing mode
    setEditorMode(EditorModes.CREATE);

    // we get the mouse position in the stage coordinate system
    // to use it as annotation coordinates, convert it into a list in the percentage coordinates
    const percentagedInitialCoords =
      transform2.convertStageCoordinatesToPercentaged(
        [antiScaledMouseStagePosition],
        imageToStageFactor,
        imgSize,
      );

    // bbox always require 2 points - add first coordinate again
    if (selectedAnnoTool === AnnotationTool.BBox)
      percentagedInitialCoords.push(percentagedInitialCoords[0]);

    const newAnnotationInternalId: number = onRequestNewAnnoId();
    const newAnnotation = new Annotation(
      newAnnotationInternalId,
      selectedAnnoTool,
      percentagedInitialCoords,
    );

    // automatically select the last used label
    if (currentLabelId !== undefined) newAnnotation.labelIds = [currentLabelId];

    onAnnoCreated(newAnnotation);

    // points are created in only one frame
    // (no size / shape has to be defined)
    // throw the creation event directly from here and skip it inside the point component
    if (selectedAnnoTool === AnnotationTool.Point) {
      // onFinishCreateAnno assumes coordinates are in stage
      // quickly convert them before calling it
      const newPointAnnotation = {
        ...newAnnotation,
        coordinates: [antiScaledMouseStagePosition],
      };
      onFinishCreateAnno(newPointAnnotation);
    }
  };

  // @TODO
  const editSelectedAnnotation = () => {
    if (
      selectedAnnotation &&
      ![AnnotationTool.Line, AnnotationTool.Polygon].includes(
        selectedAnnotation!.type,
      )
    )
      return;

    // selectedAnnotation!.mode = AnnotationMode.CREATE;

    const newSelectedAnnotation: Annotation | undefined = annotations.find(
      (annotation: Annotation) =>
        annotation.internalId === selectedAnnotation?.internalId,
    );

    if (newSelectedAnnotation === undefined) return;

    newSelectedAnnotation.mode = AnnotationMode.CREATE;
    newSelectedAnnotation.status = AnnotationStatus.CREATING;
    newSelectedAnnotation.selectedNode =
      newSelectedAnnotation.coordinates.length - 1;
    setEditorMode(EditorModes.ADD);
    onSetSelectedTool(newSelectedAnnotation.type);

    // replace annotation in list
    // const selectedAnnotationId: number = annotations.findIndex((annotation: Annotation) => annotation.internalId === selectedAnnotation?.internalId)
    // const newAnnotations = [...annotations]
    // newAnnotations[selectedAnnotationId] = newSelectedAnnotation
    onAnnoEditing(newSelectedAnnotation);
    // onShouldDeleteAnno(selectedAnnotation!.internalId);
  };

  const traverseAnnos = () => {
    const currentId = selectedAnnotation ? selectedAnnotation.internalId : 0;

    // get the first annotation with an higher internal id
    const nextAnno: Annotation | undefined = annotations.find(
      (annotation: Annotation) => annotation.internalId > currentId,
    );

    if (nextAnno) return onSelectAnnotation(nextAnno);

    // fallback: there was no anno with an higher id -> just use first anno
    if (annotations.length > 0) return onSelectAnnotation(annotations[0]);
  };

  const traverseAnnosBackwards = () => {
    const currentId = selectedAnnotation ? selectedAnnotation.internalId : 0;

    // copy list (dont mutate original annotations)
    const newAnnotations: Annotation[] = [...annotations];

    // sort by internalId descending
    newAnnotations.sort((a, b) => b.internalId - a.internalId);

    // get the first annotation with an lower internal id than current
    const nextAnno: Annotation | undefined = newAnnotations.find(
      (annotation: Annotation) => annotation.internalId < currentId,
    );

    if (nextAnno) return onSelectAnnotation(nextAnno);

    // fallback: there was no anno with an higher id -> just use first anno
    if (annotations.length > 0)
      return onSelectAnnotation(annotations[annotations.length - 1]);
  };

  const copyCurrentAnnotation = () => {
    // set a copy of the annotation object to the clipboard in localstorage
    // if (selectedAnnotation) setAnnotationClipboard({ ...selectedAnnotation });
    if (selectedAnnotation) {
      const serializedAnnotation: string = JSON.stringify(selectedAnnotation);
      localStorage.setItem("lostAnnotationClipboard", serializedAnnotation);

      const copySuccessNotification: SIANotification = {
        title: "Success",
        message: "Annotation copied",
        type: NotificationType.SUCCESS,
      };

      onNotification(copySuccessNotification);
    }
  };

  const pasteAnnotation = () => {
    const clipboardAnnotation: string | null = localStorage.getItem(
      "lostAnnotationClipboard",
    );
    if (clipboardAnnotation == undefined) return;

    const annotationToPaste: Annotation = JSON.parse(clipboardAnnotation);

    // get a new temporary id
    annotationToPaste.internalId = onRequestNewAnnoId();
    annotationToPaste.externalId = "";

    onAnnoCreationFinished(annotationToPaste, true);

    onSelectAnnotation(annotationToPaste);
  };

  const handleKeyAction = (keyAction: KeyAction) => {
    switch (keyAction) {
      case KeyAction.EDIT_LABEL:
        if (selectedAnnotation) setIsLabelInputVisible(true);
        break;
      case KeyAction.DELETE_ANNO:
        if (selectedAnnotation)
          onShouldDeleteAnno(selectedAnnotation.internalId);
        break;
      // case KeyAction.TOGGLE_ANNO_COMMENT_INPUT:
      //   console.log("KeyAction TODO: TOGGLE_ANNO_COMMENT_INPUT");
      //   break;
      case KeyAction.DELETE_ANNO_IN_CREATION:
        // remove an unfinished annotation
        if (editorMode === EditorModes.CREATE) {
          onShouldDeleteAnno(selectedAnnotation!.internalId);
          setEditorMode(EditorModes.VIEW);
        }
        break;
      case KeyAction.ENTER_ANNO_ADD_MODE:
        console.log("KeyAction TODO: ENTER_ANNO_ADD_MODE");
        break;
      case KeyAction.LEAVE_ANNO_ADD_MODE:
        console.log("KeyAction TODO: LEAVE_ANNO_ADD_MODE");
        break;
      case KeyAction.UNDO:
        console.log("KeyAction TODO: UNDO");
        break;
      case KeyAction.REDO:
        console.log("KeyAction TODO: REDO");
        break;
      case KeyAction.TRAVERSE_ANNOS:
        traverseAnnos();
        break;
      case KeyAction.TRAVERSE_ANNOS_BACKWARDS:
        traverseAnnosBackwards();
        break;
      case KeyAction.CAM_MOVE_LEFT:
        moveCamera(20 * svgScale, 0);
        break;
      case KeyAction.CAM_MOVE_RIGHT:
        moveCamera(-20 * svgScale, 0);
        break;
      case KeyAction.CAM_MOVE_UP:
        moveCamera(0, 20 * svgScale);
        break;
      case KeyAction.CAM_MOVE_DOWN:
        moveCamera(0, -20 * svgScale);
        break;
      case KeyAction.CAM_MOVE_STOP:
        console.log("KeyAction TODO: CAM_MOVE_STOP");
        break;
      case KeyAction.COPY_ANNOTATION:
        copyCurrentAnnotation();
        break;
      case KeyAction.PASTE_ANNOTATION:
        pasteAnnotation();
        break;
      case KeyAction.RECREATE_ANNO:
        console.log("KeyAction TODO: RECREATE_ANNO");
        editSelectedAnnotation();
        break;
      default:
        console.log("Unknown KeyAction", keyAction);
        break;
    }
  };

  const moveCamera = (movementX: number, movementY: number) => {
    let newTransX = svgTranslation.x + movementX / svgScale;
    let newTransY = svgTranslation.y + movementY / svgScale;

    // at least one quarter of the image should always be visible
    const minTransX = canvasSize.x * -0.25;
    const minTransY = canvasSize.y * -0.25;
    const maxTransX = canvasSize.x * 0.75;
    const maxTransY = canvasSize.y * 0.75;

    // move image a bit back inside the canvas
    if (newTransX < minTransX) newTransX += 25;
    if (newTransX > maxTransX) newTransX -= 25;
    if (newTransY < minTransY) newTransY += 25;
    if (newTransY > maxTransY) newTransY -= 25;

    setSvgTranslation({ x: newTransX, y: newTransY });
  };

  const calculateScaledAnnotations = (_annotations: Annotation[]) => {
    if (
      stageSize.x <= 0 ||
      stageSize.y <= 0 ||
      imgSize.x <= 0 ||
      imgSize.y <= 0
    )
      return [];

    const newScaledAnnotations = annotations.map((annotation: Annotation) => ({
      ...annotation,
      coordinates: transform2.convertPercentagedCoordinatesToStage(
        annotation.coordinates,
        imgSize,
        stageSize,
      ),
    }));

    return newScaledAnnotations;
  };

  const scaledAnnotations = calculateScaledAnnotations(annotations);

  const resetCanvas = () => {
    setEditorMode(EditorModes.VIEW);

    // largest possible annotation size fitting the whole image
    setStageSize({ x: -1, y: -1 });

    if (imageRef.current !== null) {
      const { width, height } = imageRef.current.getBoundingClientRect();
      setImgSize({ x: width, y: height });
    }

    setSvgScale(1.0);
    setSvgTranslation({ x: 0, y: 0 });

    setLabelInputPosition(undefined);
    setIsLabelInputVisible(false);
  };

  // image changed after init -> reset everything
  useEffect(() => {
    if (canvasRef?.current !== undefined) {
      const { width, height } = canvasRef!.current!.getBoundingClientRect();

      // for whatever reason the ref adds the toolbars height to the available space, leading to a container size reaching outside the bottom
      // remove its height here manually
      const heightWithoutToolbar: number = height - toolbarHeight;

      setCanvasSize({ x: width, y: heightWithoutToolbar });

      // listen for size changes on div element
      const resizeObserver = new ResizeObserver(() => {
        const { width, height } = canvasRef!.current!.getBoundingClientRect();
        const heightWithoutToolbar: number = height - toolbarHeight;

        setCanvasSize({ x: width, y: heightWithoutToolbar });
      });
      resizeObserver.observe(canvasRef!.current!);

      // cleanup
      return () => resizeObserver.disconnect();
    }

    resetCanvas();
  }, [image, isFullscreen]);

  useEffect(() => {
    calculatePageToCanvasOffset();
  }, [imageRef, svgTranslation, canvasSize]);

  // notify component about available size
  useEffect(() => {
    if (canvasRef.current === null) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();

    // for whatever reason the ref adds the toolbars height to the available space, leading to a container size reaching outside the bottom
    // remove its height here manually
    const heightWithoutToolbar: number = height - toolbarHeight;

    setCanvasSize({ x: width, y: heightWithoutToolbar });
  }, [canvasRef]);

  // notify component about default image size
  useEffect(() => {
    if (imageRef.current === null) return;

    const { width, height } = imageRef.current.getBoundingClientRect();

    setImgSize({ x: width, y: height });

    // listen for size changes on div element
    const imgResizeObserver = new ResizeObserver(() => {
      const { width, height } = imageRef!.current!.getBoundingClientRect();

      setImgSize({ x: width, y: height });
    });
    imgResizeObserver.observe(imageRef!.current!);

    return () => imgResizeObserver.disconnect();
  }, [imageRef]);

  useEffect(() => {
    if (imageToStageFactor === 0) return;

    const newStageSize: Vector2 = {
      x: imgSize.x * imageToStageFactor,
      y: imgSize.y * imageToStageFactor,
    };

    setStageSize(newStageSize);
  }, [imageToStageFactor, imgSize]);

  useEffect(() => {
    if (!isPolygonSelectionMode) return;

    const newAnnotationInternalId: number = onRequestNewAnnoId();

    if (polygonOperationResult.polygonsToCreate === undefined) return;

    // create all polygons calculated from the outside world
    polygonOperationResult.polygonsToCreate.forEach(
      (polygonToCreate: ToolCoordinates) => {
        const newAnnotation: Annotation = new Annotation(
          newAnnotationInternalId,
          polygonToCreate.type,
          transform2.convertPercentagedCoordinatesToStage(
            polygonToCreate.coordinates,
            imgSize,
            stageSize,
          ),
          AnnotationMode.VIEW,
          AnnotationStatus.CREATED,
        );

        onFinishCreateAnno(newAnnotation);
      },
    );
  }, [polygonOperationResult]);

  const onFinishCreateAnno = (fullyCreatedAnnotation: Annotation) => {
    setEditorMode(EditorModes.VIEW);

    fullyCreatedAnnotation.mode = AnnotationMode.VIEW;

    // convert the coordinates from our local scaled sytem into the percentaged one
    const percentagedCoordinates =
      transform2.convertStageCoordinatesToPercentaged(
        fullyCreatedAnnotation.coordinates,
        imageToStageFactor,
        imgSize,
      );
    fullyCreatedAnnotation.coordinates = percentagedCoordinates;

    onAnnoChanged(fullyCreatedAnnotation);

    // if point: inform annotation that we just created it
    onAnnoCreationFinished(
      fullyCreatedAnnotation,
      selectedAnnoTool === AnnotationTool.Point,
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    keyMapper.keyDown(e.key, e.shiftKey, e.ctrlKey);
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    // @TODO implement keyMapper
    // this.keyMapper.keyUp(e.key);
    // if (propsOnKeyUp) propsOnKeyUp(e);
  };

  const onMouseDown = (e: React.MouseEvent<SVGImageElement, MouseEvent>) => {
    if (e.button === 0) {
      // left click
    } else if (e.button === 1) {
      // click on mouse wheel
      setEditorMode(EditorModes.CAMERA_MOVE);
    } else if (e.button === 2) {
      // check if annotation creation allowed in settings
      if (!annotationSettings!.canCreate) return;

      if (editorMode === EditorModes.ADD) return;

      // right click -> start new annotation
      // clicks during annotation creation will be handled inside the AnnotationComponent
      const antiScaledMouseStageMovedPosition: Point =
        mouse2.getAntiScaledMouseStagePosition(
          e,
          pageToStageOffset,
          svgScale,
          svgTranslation,
        );

      // remove translation when image was horizontally centered
      const antiScaledMouseStagePosition: Point = {
        x: antiScaledMouseStageMovedPosition.x - imageCenteringSpace,
        y: antiScaledMouseStageMovedPosition.y,
      };

      createNewAnnotation(antiScaledMouseStagePosition);
    }
  };

  const onMouseOver = () => {
    // this.svg.current.focus();
    //Prevent scrolling on svg
    if (preventScrolling) {
      document.body.style.overflow = "hidden";
    }
  };

  const onMouseUp = (e) => {
    switch (e.button) {
      case 1:
        setEditorMode(EditorModes.VIEW);
        break;
      default:
        break;
    }
  };

  const onMouseMove = (movementX: number, movementY: number) => {
    if (editorMode === EditorModes.CAMERA_MOVE) {
      moveCamera(movementX, movementY);
    }
  };

  const onMouseLeave = () => {
    if (preventScrolling) {
      document.body.style.overflow = "";
    }
  };

  const onWheel = (e: WheelEvent) => {
    const scaleFactor = 1.25;
    const scrollDirection = e.deltaY < 0 ? 1 : -1;

    // calculate scaling based on scroll wheel direction
    const newScale =
      scrollDirection > 0 ? svgScale * scaleFactor : svgScale / scaleFactor;

    // zoom in/out without affecting the pixel the mouse is at
    const mousePositionInStage: Point = mouse2.getAntiScaledMouseStagePosition(
      e,
      pageToStageOffset,
      svgScale,
      svgTranslation,
    );

    // set translation around mouse pixel
    const scaleChangeFactor: number = svgScale / newScale;
    const newTranslation: Vector2 = {
      x:
        scaleChangeFactor * (mousePositionInStage.x + svgTranslation.x) -
        mousePositionInStage.x,
      y:
        scaleChangeFactor * (mousePositionInStage.y + svgTranslation.y) -
        mousePositionInStage.y,
    };

    // contstrain zoom
    if (newScale < 1.0) {
      setSvgScale(1);
      if (svgTranslation.x != 0 || svgTranslation.y != 0)
        setSvgTranslation({ x: 0, y: 0 });
    } else if (newScale > 200) {
      setSvgScale(200);
      setSvgTranslation(newTranslation);
    } else {
      setSvgScale(newScale);
      setSvgTranslation(newTranslation);
    }
  };

  const onAnnoAction = (annotation: Annotation, canvasAction: CanvasAction) => {
    if (canvasAction !== CanvasAction.ANNO_SELECTED) {
      console.log("Unknown Canvas Action:", canvasAction);
      return;
    }

    const percentagedAnnotation = {
      ...annotation,
      coordinates: transform2.convertStageCoordinatesToPercentaged(
        [...annotation.coordinates],
        imageToStageFactor,
        imgSize,
      ),
    };

    onSelectAnnotation(percentagedAnnotation);

    // get top left point of annotation
    const leftPoints: Point[] = transform2.getMostLeftPoints(
      annotation.coordinates,
    );
    const topLeftPoint: Point = transform2.getTopPoint(leftPoints)[0];
    const pageTopLeftPoint: Point = transform2.convertStageToPage(
      topLeftPoint,
      pageToStageOffset,
      svgScale,
      svgTranslation,
    );

    setLabelInputPosition(pageTopLeftPoint);
  };

  const handleOnAnnoChanged = (annotation: Annotation) => {
    const percentagedCoordinates =
      transform2.convertStageCoordinatesToPercentaged(
        annotation.coordinates,
        imageToStageFactor,
        imgSize,
      );

    const newAnnotation = {
      ...annotation,
      coordinates: percentagedCoordinates,
    };

    // send event to parent component
    onAnnoChanged(newAnnotation);
  };

  const renderAnnotations = (): ReactElement => {
    // hide all annotations when image is moved
    if (editorMode === EditorModes.CAMERA_MOVE) return <></>;

    // draw the annotation using the AnnotationComponent and the scaled coordinates
    const annos: ReactElement[] = scaledAnnotations.map(
      (scaledAnnotation: Annotation): ReactElement => {
        // only show selected anno in specific editor modes
        const editorModesOtherAnnosShouldBeHiddenIn = [
          EditorModes.CREATE,
          EditorModes.ADD,
          EditorModes.MOVE,
        ];

        if (
          editorModesOtherAnnosShouldBeHiddenIn.includes(editorMode) &&
          scaledAnnotation.internalId !== selectedAnnotation?.internalId
        )
          return <></>;

        return (
          <AnnotationComponent
            key={`annotationComponent_${scaledAnnotation.internalId}`}
            scaledAnnotation={scaledAnnotation}
            annotationSettings={annotationSettings}
            possibleLabels={possibleLabels}
            svgScale={svgScale}
            svgTranslation={centeredSvgTranslation}
            pageToStageOffset={pageToStageOffset}
            nodeRadius={uiConfig.nodeRadius}
            strokeWidth={uiConfig.strokeWidth}
            isSelected={
              scaledAnnotation.internalId === selectedAnnotation?.internalId
            }
            isDisabled={
              // dont let annotation be selected twice in polygon selection mode
              isPolygonSelectionMode &&
              scaledAnnotation.internalId === selectedAnnotation?.internalId
            }
            onFinishAnnoCreate={onFinishCreateAnno}
            onLabelIconClicked={() => setIsLabelInputVisible(true)}
            onAction={onAnnoAction}
            onAnnoChanged={handleOnAnnoChanged}
            onAnnotationModeChange={(annotationMode: AnnotationMode) => {
              if (annotationMode === AnnotationMode.MOVE)
                setEditorMode(EditorModes.MOVE);
              if (
                editorMode === EditorModes.MOVE &&
                annotationMode === AnnotationMode.VIEW
              )
                setEditorMode(EditorModes.VIEW);
            }}
            onNotification={onNotification}
          />
        );
      },
    );

    return <g>{annos}</g>;
  };

  const renderInfiniteSelectionArea = (): ReactElement => {
    // block changing annotations while label selector is open
    // close label selector when clicked onto canvas
    return (
      <circle
        cx={stageSize.x / 2}
        cy={stageSize.y / 2}
        r={"100%"}
        style={{ opacity: 0 }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          setIsLabelInputVisible(false);
        }}
      />
    );
  };

  // calculate the center of the canvas in page coordinates
  const junkTextStart: Vector2 = {
    x: pageToCanvasOffset.x + canvasSize.x / 2,
    y: pageToCanvasOffset.y + canvasSize.y / 2,
  };

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: labelInputPosition?.x !== undefined ? labelInputPosition.x : 0,
          top: labelInputPosition?.y !== undefined ? labelInputPosition.y : 0,
          display: labelInputPosition?.y !== undefined ? "inherit" : "none",
          zIndex: 7000,
        }}
      >
        <LabelInput
          defaultLabelId={defaultLabelId}
          isVisible={isLabelInputVisible}
          selectedLabelsIds={selectedAnnotation?.labelIds}
          possibleLabels={possibleLabels}
          isMultilabel={annotationSettings!.canHaveMultipleLabels}
          onLabelSelect={(selectedLabelIds: number[]) => {
            // close the input popup
            setIsLabelInputVisible(false);

            // inform parent which label was chosen
            if (selectedLabelIds.length > 0) {
              const newLabelIds: number[] = selectedLabelIds.filter(
                (labelId: number) =>
                  !selectedAnnotation!.labelIds!.includes(labelId),
              );

              if (newLabelIds.length > 0) {
                setCurrentLabelId(newLabelIds[0]);
              }
            }

            // change the status to CHANGED when the annotation was loaded (initialAnnotations)
            const newAnnotationStatus: AnnotationStatus =
              selectedAnnotation.status === AnnotationStatus.LOADED
                ? AnnotationStatus.CHANGED
                : selectedAnnotation.status;

            // selectedAnnotation comes from SIA and is therefore in the percentaged system
            // convert it first
            // also update the new labels
            const updatedAnno: Annotation = {
              ...selectedAnnotation,
              coordinates: transform2.convertPercentagedCoordinatesToStage(
                selectedAnnotation!.coordinates,
                imgSize,
                stageSize,
              ),
              labelIds: [...selectedLabelIds],
              status: newAnnotationStatus,
            };
            handleOnAnnoChanged(updatedAnno);
          }}
        />
      </div>

      {isImageJunk && (
        <div
          style={{
            position: "absolute",
            left: junkTextStart.x,
            top: junkTextStart.y,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
          }}
        >
          <FontAwesomeIcon
            icon={faBan as IconProp}
            size="5x"
            style={{ marginBottom: 15 }}
          />
          <h2>Marked as Junk</h2>
        </div>
      )}

      <svg
        // ref={svgRef}
        // width={svgSize[0] > 0 ? svgSize[0] : "100%"}
        // height={svgSize[1] > 0 ? svgSize[1] : "100%"}
        width="100%"
        height="100%"
        //   width={
        //     this.props.fixedImageSize
        //       ? this.props.fixedImageSize
        //       : this.state.svg.width
        //   }
        //   height={
        //     this.props.fixedImageSize
        //       ? this.props.fixedImageSize
        //       : this.state.svg.height
        //   }
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseMove={(e) => onMouseMove(e.movementX, e.movementY)}
        // onMouseMove={(e) => this.handleSvgMouseMove(e)}
        tabIndex={0}
        // width="100%"
        // height="100%"
        // style={{ position: "absolute" }}
      >
        <g
          transform={`scale(${svgScale}) translate(${centeredSvgTranslation.x}, ${centeredSvgTranslation.y})`}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          // onMouseEnter={() => this.svg.current.focus()}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          onMouseMove={(e) => onMouseMove(e.movementX, e.movementY)}
          onClick={() => {
            // clicked onto canvas => clear selected anno
            onSelectAnnotation(undefined);
          }}
        >
          <image
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => onMouseDown(e)}
            href={image}
            ref={imageRef}
            // undefined -> use default (unscaled) size of image
            // when stageSize is set, the image is scaled to the stageSize
            width={stageSize.x > 0 ? stageSize.x : undefined}
            height={stageSize.y > 0 ? stageSize.y : undefined}
          />
          {renderAnnotations()}
        </g>
        {isLabelInputVisible && renderInfiniteSelectionArea()}

        {isImageJunk && (
          <rect
            x="0"
            y="0"
            width={canvasSize.x}
            height={canvasSize.y}
            style={{ opacity: 0.8 }}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => {
              setLabelInputPosition(undefined);
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default Canvas;
