import { useEffect, useRef, useState } from "react";
import AnnotationTool from "../models/AnnotationTool";
import EditorModes from "../models/EditorModes";
import KeyMapper from "../utils/KeyMapper";
import KeyAction from "../models/KeyAction";
import Annotation from "../Annotation/logic/Annotation";
import CanvasAction from "../models/CanvasAction";
import AnnotationComponent from "../Annotation/ui/AnnotationComponent";
import Label from "../models/Label";
import UiConfig from "../models/UiConfig";
import Point from "../models/Point";
import mouse2 from "../utils/mouse2";
import AnnotationMode from "../models/AnnotationMode";
import LabelInput from "./LabelInput";
import AnnotationSettings from "../models/AnnotationSettings";

type CanvasProps = {
  annotations?: Annotation[];
  annotationSettings?: AnnotationSettings;
  image: string;
  selectedAnnoTool: AnnotationTool;
  possibleLabels: Label[];
  preventScrolling?: boolean;
  uiConfig: UiConfig;
  onAnnoEvent?: (
    annotation: Annotation,
    canvasAction: CanvasAction,
  ) => void | undefined;
  onKeyDown?: (e) => void | undefined;
  onKeyUp?: (e) => void | undefined;
  onAnnoCreated: (createdAnno: Annotation) => void;
  onAnnoCreationFinished: (createdAnno: Annotation) => void;
  onAnnoChanged: (changedAnno: Annotation) => void;
  // onAnnoDeleted: (deletedAnno: Annotation, allAnnos: Annotation[]) => void;
  onRequestNewAnnoId: () => number;
};

const Canvas = ({
  annotations = [],
  annotationSettings,
  image,
  selectedAnnoTool,
  possibleLabels,
  preventScrolling = true,
  uiConfig,
  onAnnoEvent: propsOnAnnoEvent,
  onKeyDown: propOnKeyDown,
  onKeyUp: propsOnKeyUp,
  onAnnoCreated,
  onAnnoCreationFinished,
  onAnnoChanged,
  onRequestNewAnnoId,
}: CanvasProps) => {
  // modified annotation coordinates to match the resized image
  const [scaledAnnotations, setScaledAnnotations] = useState<Annotation[]>([]);

  const [editorMode, setEditorMode] = useState<EditorModes>(EditorModes.VIEW);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>();

  // factor to convert coordinates from an (untransformed) image into the stage
  const [imageToStageFactor, setImageToStageFactor] = useState<number>(0);

  // vector from the top left of the DOM document to the top left of the stage
  // (events are emitting page coordinates, so we need this to convert them)
  const [pageToStageOffset, setPageToStageOffset] = useState<Point>({
    x: -1,
    y: -1,
  });

  // default image and svg sizes (for canvas calculation)
  // invalid default value, so that the image uses its default values at first
  const [imgSize, setImgSize] = useState<[number, number]>([-1, -1]);
  // const [svgSize, setSvgSize] = useState<[number, number]>([-1, -1]);
  const [containerSize, setContainerSize] = useState<[number, number]>([
    -1, -1,
  ]);

  // largest possible annotation size fitting the whole image
  const [canvasSize, setCanvasSize] = useState<[number, number]>([-1, -1]);

  const [svgScale, setSvgScale] = useState<number>(1.0);
  const [svgTranslation, setSvgTranslation] = useState<[number, number]>([
    0, 0,
  ]);

  const [isLabelInputOpen, setIsLabelInputOpen] = useState<boolean>(false);
  const [labelInputPosition, setLabelInputPosition] = useState<Point>();

  // const [showAnnoLabelInput, setShowAnnoLabelInput] = useState<boolean>(false);

  // outer container - all possible space for creating a canvas
  const containerRef = useRef(null);

  // const svgRef = useRef(null);

  // used to get the size of the dynamically loaded image
  const imageRef = useRef(null);

  const keyMapper = new KeyMapper((keyAction: KeyAction) =>
    handleKeyAction(keyAction),
  );

  const createNewAnnotation = (antiScaledMouseStagePosition: Point) => {
    // switch to editing mode
    setEditorMode(EditorModes.CREATE);

    const initialCoords = convertStageCoordinatesToImage([
      antiScaledMouseStagePosition,
    ]);

    const newAnnotationInternalId: number = onRequestNewAnnoId();
    const newAnnotation = new Annotation(
      newAnnotationInternalId,
      selectedAnnoTool,
      initialCoords,
    );
    setSelectedAnnotation(newAnnotation);
    onAnnoCreated(newAnnotation);

    // handleAnnoEvent(newAnnotation, CanvasAction.ANNO_ENTER_CREATE_MODE);
  };

  // store + update the vector between start of the page and start of the (translated) image to be able to to transformations
  useEffect(() => {
    // get image starting position in window coordinates
    const { top, left } = imageRef.current.getBoundingClientRect();

    // top and left are in window coordinates
    // we need to convert them to page coordinates
    const pageOffset = {
      x: left + window.scrollX,
      y: top + window.scrollY,
    };

    setPageToStageOffset(pageOffset);
  }, [imageRef, imageToStageFactor, svgTranslation]);

  // returns the aspect ratio of the largest image size fitting onto the canvas without changing the aspect ratio
  const getFittedImageScale = (
    imgSize: [number, number],
    svgSize: [number, number],
  ): number => {
    if (
      imgSize[0] === 0 ||
      imgSize[1] === 0 ||
      svgSize[0] === 0 ||
      svgSize[1] === 0
    )
      return 0;

    const scaleX = svgSize[0] / imgSize[0];
    const scaleY = svgSize[1] / imgSize[1];

    return Math.min(scaleX, scaleY);
  };

  const handleAnnoEvent = (
    annotation: Annotation,
    canvasAction: CanvasAction,
  ) => {
    switch (canvasAction) {
      case CanvasAction.ANNO_ENTER_CREATE_MODE:
        // setEditorMode(EditorModes.CREATE);
        break;
      case CanvasAction.ANNO_MARK_EXAMPLE:
        console.log("TODO HANDLE ACTION ANNO_MARK_EXAMPLE");
        break;
      case CanvasAction.ANNO_SELECTED:
        console.log("TODO HANDLE ACTION ANNO_SELECTED");
        break;
      case CanvasAction.ANNO_START_CREATING:
        console.log("TODO HANDLE ACTION ANNO_START_CREATING");
        break;
      case CanvasAction.ANNO_CREATED:
        console.log("TODO HANDLE ACTION ANNO_CREATED");
        break;
      case CanvasAction.ANNO_MOVED:
        console.log("TODO HANDLE ACTION ANNO_MOVED");
        break;
      case CanvasAction.ANNO_ENTER_MOVE_MODE:
        console.log("TODO HANDLE ACTION ANNO_ENTER_MOVE_MODE");
        break;
      case CanvasAction.ANNO_ENTER_EDIT_MODE:
        console.log("TODO HANDLE ACTION ANNO_ENTER_EDIT_MODE");
        break;
      case CanvasAction.ANNO_ADDED_NODE:
        console.log("TODO HANDLE ACTION ANNO_ADDED_NODE");
        break;
      case CanvasAction.ANNO_REMOVED_NODE:
        console.log("TODO HANDLE ACTION ANNO_REMOVED_NODE");
        break;
      case CanvasAction.ANNO_EDITED:
        console.log("TODO HANDLE ACTION ANNO_EDITED");
        break;
      case CanvasAction.ANNO_DELETED:
        console.log("TODO HANDLE ACTION ANNO_DELETED");
        break;
      case CanvasAction.ANNO_COMMENT_UPDATE:
        console.log("TODO HANDLE ACTION ANNO_COMMENT_UPDATE");
        break;
      case CanvasAction.ANNO_LABEL_UPDATE:
        console.log("TODO HANDLE ACTION ANNO_LABEL_UPDATE");
        break;
      case CanvasAction.ANNO_CREATED_NODE:
        console.log("TODO HANDLE ACTION ANNO_CREATED_NODE");
        break;
      case CanvasAction.ANNO_CREATED_FINAL_NODE:
        console.log("TODO HANDLE ACTION ANNO_CREATED_FINAL_NODE");
        break;
      default:
        console.log("Unknown CanvasAction", canvasAction);
        break;
    }

    if (propsOnAnnoEvent) propsOnAnnoEvent(annotation, canvasAction);
  };

  const handleKeyAction = (keyAction: KeyAction) => {
    switch (keyAction) {
      case KeyAction.EDIT_LABEL:
        console.log("KeyAction TODO: EDIT_LABEL");
        break;
      case KeyAction.DELETE_ANNO:
        console.log("KeyAction TODO: DELETE_ANNO");
        break;
      case KeyAction.TOGGLE_ANNO_COMMENT_INPUT:
        console.log("KeyAction TODO: TOGGLE_ANNO_COMMENT_INPUT");
        break;
      case KeyAction.DELETE_ANNO_IN_CREATION:
        console.log("KeyAction TODO: DELETE_ANNO_IN_CREATION");
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
        console.log("KeyAction TODO: TRAVERSE_ANNOS");
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
        console.log("KeyAction TODO: COPY_ANNOTATION");
        break;
      case KeyAction.PASTE_ANNOTATION:
        console.log("KeyAction TODO: PASTE_ANNOTATION");
        break;
      case KeyAction.RECREATE_ANNO:
        console.log("KeyAction TODO: RECREATE_ANNO");
        break;
      default:
        console.log("Unknown KeyAction", keyAction);
        break;
    }
  };

  const moveCamera = (movementX: number, movementY: number) => {
    let newTransX = svgTranslation[0] + movementX / svgScale;
    let newTransY = svgTranslation[1] + movementY / svgScale;

    // at least one quarter of the image should always be visible
    const minTransX = containerSize[0] * -0.25;
    const minTransY = containerSize[1] * -0.25;
    const maxTransX = containerSize[0] * 0.75;
    const maxTransY = containerSize[1] * 0.75;

    // move image a bit back inside the canvas
    if (newTransX < minTransX) newTransX += 25;
    if (newTransX > maxTransX) newTransX -= 25;
    if (newTransY < minTransY) newTransY += 25;
    if (newTransY > maxTransY) newTransY -= 25;

    setSvgTranslation([newTransX, newTransY]);
  };

  // apply translations to annotations
  useEffect(() => {
    if (
      annotations.length == 0 ||
      canvasSize[0] <= 0 ||
      canvasSize[1] <= 0 ||
      imgSize[0] <= 0 ||
      imgSize[1] <= 0
    )
      return;

    // the image is scaled to match the width of the canvas
    // assume the aspect ratio is kept
    const imageToCanvasScale = canvasSize[0] / imgSize[0];

    const newTranslatedAnnotations = annotations.map(
      (annotation: Annotation) => {
        // destroy reference
        const newAnnotation = { ...annotation };

        newAnnotation.coordinates = newAnnotation.coordinates.map(
          (point: Point) => {
            return {
              x: point.x * imageToCanvasScale,
              y: point.y * imageToCanvasScale,
            };
          },
        );

        return newAnnotation;
      },
    );

    setScaledAnnotations(newTranslatedAnnotations);
  }, [annotations, canvasSize, imgSize]);

  // notify component about available size
  useEffect(() => {
    if (containerRef.current === null) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    // setSvgSize([width, height]);
    setContainerSize([width, height]);
  }, [containerRef]);

  // notify component about default image size
  useEffect(() => {
    if (imageRef.current === null) return;
    const { width, height } = imageRef.current.getBoundingClientRect();
    setImgSize([width, height]);

    console.log("IMG SET", width, height);
  }, [imageRef]);

  // update the image + svg to the biggest possible size keeping aspect ratio
  useEffect(() => {
    if (
      containerSize[0] <= 0 ||
      containerSize[1] <= 0 ||
      imgSize[0] <= 0 ||
      imgSize[1] <= 0
    )
      return;

    const newImageToStageFactor: number = getFittedImageScale(
      imgSize,
      containerSize,
    );

    setImageToStageFactor(newImageToStageFactor);
  }, [containerSize, imgSize]);

  useEffect(() => {
    if (imageToStageFactor === 0) return;

    const newCanvasSize: [number, number] = [
      imgSize[0] * imageToStageFactor,
      imgSize[1] * imageToStageFactor,
    ];

    setCanvasSize(newCanvasSize);
  }, [imageToStageFactor]);

  // const moveCamera = (movementX, movementY) => {
  // console.log("MOVE CAMERA", movementX, movementY);
  // let trans_x = svgTranslation[0] + movementX / svgScale;
  // let trans_y = svgTranslation[1] + movementY / svgScale;
  // const vXMin = this.state.svg.width * 0.25;
  // const vXMax = this.state.svg.width * 0.75;
  // const yXMin = this.state.svg.height * 0.25;
  // const yXMax = this.state.svg.height * 0.75;
  // const vLeft = wv.getViewportCoordinates({ x: 0, y: 0 }, this.state.svg);
  // const vRight = wv.getViewportCoordinates(
  //   { x: this.state.svg.width, y: this.state.svg.height },
  //   this.state.svg,
  // );

  // if (vLeft.vX >= vXMin) {
  //   trans_x = svgTranslation[0] - 5;
  // } else if (vRight.vX <= vXMax) {
  //   trans_x = svgTranslation[0] + 5;
  // }
  // if (vLeft.vY >= yXMin) {
  //   trans_y = svgTranslation[1] - 5;
  // } else if (vRight.vY <= yXMax) {
  //   trans_y = svgTranslation[1] + 5;
  // }
  // setSvgTranslation([trans_x, trans_y]);
  // };

  const onFinishCreateAnno = (fullyCreatedAnnotation: Annotation) => {
    setEditorMode(EditorModes.VIEW);

    fullyCreatedAnnotation.mode = AnnotationMode.VIEW;

    // convert stage coordinates to image coordinates
    fullyCreatedAnnotation.coordinates = convertStageCoordinatesToImage(
      fullyCreatedAnnotation.coordinates,
    );

    onAnnoChanged(fullyCreatedAnnotation);
    onAnnoCreationFinished(fullyCreatedAnnotation);
  };

  const onKeyDown = (e) => {
    e.preventDefault();

    keyMapper.keyDown(e.key);
    if (propOnKeyDown) propOnKeyDown(e);
  };

  const onKeyUp = (e) => {
    e.preventDefault();
    // @TODO implement keyMapper
    // this.keyMapper.keyUp(e.key);
    if (propsOnKeyUp) propsOnKeyUp(e);
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      // left click
    } else if (e.button === 1) {
      // click on mouse wheel
      setEditorMode(EditorModes.CAMERA_MOVE);
    } else if (e.button === 2) {
      // check if annotation creation allowed in settings
      if (!annotationSettings!.canCreate) return;

      // right click -> start new annotation
      // clicks during annotation creation will be handled inside the AnnotationComponent
      const antiScaledMouseStagePosition: Point =
        mouse2.getAntiScaledMouseStagePosition(e, pageToStageOffset, svgScale);

      createNewAnnotation(antiScaledMouseStagePosition);
    }
  };

  const convertStageCoordinatesToImage = (
    stageCoordinates: Point[],
  ): Point[] => {
    const coordinatesInImageSpace: Point[] = stageCoordinates.map(
      (coordinate: Point) => {
        return {
          x: coordinate.x / imageToStageFactor,
          y: coordinate.y / imageToStageFactor,
        };
      },
    );
    return coordinatesInImageSpace;
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

  const onMouseMove = (e: MouseEvent) => {
    if (editorMode === EditorModes.CAMERA_MOVE) {
      moveCamera(e.movementX, e.movementY);
    }
  };

  const onMouseLeave = () => {
    if (preventScrolling) {
      document.body.style.overflow = "";
    }
  };

  const onWheel = (e) => {
    const scaleFactor = 1.25;
    const scrollDirection = e.deltaY < 0 ? 1 : -1;

    // current mouse coordinates according to container
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // calculate scaling based on scroll wheel direction
    let newScale =
      scrollDirection > 0 ? svgScale * scaleFactor : svgScale / scaleFactor;

    // calculate mouse position in rescaled coordinate system
    const svgMouseX = (mouseX - svgTranslation[0] * svgScale) / svgScale;
    const svgMouseY = (mouseY - svgTranslation[1] * svgScale) / svgScale;

    // new translation, so that svgMouseX/Y is at mouseX/Y after scaling
    const newTransX = mouseX / newScale - svgMouseX;
    const newTransY = mouseY / newScale - svgMouseY;

    if (newScale < 1.0) {
      setSvgScale(1);
      setSvgTranslation([0, 0]);
    } else if (newScale > 200) {
      setSvgScale(200);
      setSvgTranslation([newTransX, newTransY]);
    } else {
      setSvgScale(newScale);
      setSvgTranslation([newTransX, newTransY]);
    }
  };

  const onAnnoAction = (annotation: Annotation, canvasAction: CanvasAction) => {
    switch (canvasAction) {
      case CanvasAction.ANNO_SELECTED:
        setSelectedAnnotation(annotation);
        break;
      default:
        console.log("Unknown Canvas Action:", canvasAction);
    }
  };

  const renderAnnotations = () => {
    if (editorMode == EditorModes.CAMERA_MOVE) return "";

    // draw the annotation using the AnnotationComponent and the scaled coordinates
    const annos = scaledAnnotations.map((scaledAnnotation: Annotation) => (
      <AnnotationComponent
        key={`annotationComponent_${scaledAnnotation.internalId}`}
        scaledAnnotation={scaledAnnotation}
        annotationSettings={annotationSettings}
        possibleLabels={possibleLabels}
        svgScale={svgScale}
        pageToStageOffset={pageToStageOffset}
        nodeRadius={uiConfig.nodeRadius}
        strokeWidth={uiConfig.strokeWidth}
        isSelected={
          selectedAnnotation !== undefined &&
          scaledAnnotation.internalId === selectedAnnotation.internalId
        }
        onFinishAnnoCreate={onFinishCreateAnno}
        onLabelIconClicked={(markerPosition) => {
          // counter scaling
          const newMarkerPosition = {
            x: markerPosition.x,
            y: markerPosition.y,
          };

          setLabelInputPosition(newMarkerPosition);
          setIsLabelInputOpen(true);
        }}
        onAction={onAnnoAction}
        onAnnoChanged={(annotation: Annotation) => {
          // convert stage coordinates to image coordinates
          const newCoordinates: Point[] = convertStageCoordinatesToImage(
            annotation.coordinates,
          );

          const newAnnotation = { ...annotation, coordinates: newCoordinates };

          // send event to parent component
          onAnnoChanged(newAnnotation);
        }}
      />
    ));

    return <g>{annos}</g>;
  };

  const renderInfiniteSelectionArea = () => {
    // block changing annotations while label selector is open
    // close label selector when clicked onto canvas
    return (
      <circle
        cx={canvasSize[0] / 2}
        cy={canvasSize[1] / 2}
        r={"100%"}
        style={{ opacity: 0 }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          setIsLabelInputOpen(false);
        }}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      {isLabelInputOpen && (
        <div
          style={{
            position: "absolute",
            left: labelInputPosition.x,
            top: labelInputPosition.y,
          }}
        >
          <LabelInput
            selectedLabelsIds={selectedAnnotation.labelIds}
            possibleLabels={possibleLabels}
            isMultilabel={annotationSettings!.canHaveMultipleLabels}
            onLabelSelect={(selectedLabelIds: number[]) => {
              setIsLabelInputOpen(false);

              const updatedAnno = {
                ...selectedAnnotation,
                labelIds: [...selectedLabelIds],
              };
              onAnnoChanged(updatedAnno);
            }}
          />
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
        onMouseMove={onMouseMove}
        // onMouseMove={(e) => this.handleSvgMouseMove(e)}
        tabIndex={0}
        // width="100%"
        // height="100%"
        // style={{ position: "absolute" }}
      >
        <g
          transform={`scale(${svgScale}) translate(${svgTranslation[0]}, ${svgTranslation[1]})`}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          // onMouseEnter={() => this.svg.current.focus()}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          onMouseMove={onMouseMove}
          onClick={() => {
            // clicked onto canvas => clear selected anno
            setSelectedAnnotation(undefined);
          }}
        >
          <image
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={onMouseDown}
            href={image}
            ref={imageRef}
            width={canvasSize[0] > 0 ? canvasSize[0] : undefined}
            height={canvasSize[1] > 0 ? canvasSize[1] : undefined}
          />
          {renderAnnotations()}
        </g>
        {isLabelInputOpen && renderInfiniteSelectionArea()}
      </svg>
    </div>
  );
};

export default Canvas;
