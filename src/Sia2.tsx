import {
  useEffect,
  useState,
  ReactElement,
  useRef,
  CSSProperties,
} from "react";
import { CSpinner } from "@coreui/react";
import Canvas from "./Canvas/Canvas";
import AnnotationTool from "./models/AnnotationTool";
import Toolbar from "./Toolbar/Toolbar";
import Annotation from "./Annotation/logic/Annotation";
import AnnotationMode from "./models/AnnotationMode";
import AnnotationStatus from "./models/AnnotationStatus";
import {
  AllowedTools,
  AnnotationSettings,
  ExternalAnnotation,
  Label,
  PolygonOperationResult,
  SIANotification,
  UiConfig,
} from "./types";

type SiaProps = {
  additionalButtons?: ReactElement | undefined;
  allowedTools?: AllowedTools;
  polygonOperationResult?: PolygonOperationResult;
  annotationSettings?: AnnotationSettings;
  defaultAnnotationTool?: AnnotationTool;
  defaultLabelId?: number;
  image?: string;
  isLoading?: boolean;
  isPolygonSelectionMode?: boolean;
  initialAnnotations?: ExternalAnnotation[];
  initialImageLabelIds?: number[];
  initialIsImageJunk?: boolean;
  possibleLabels: Label[];
  uiConfig?: UiConfig;
  onAnnoCreated?: (createdAnno: Annotation, allAnnos: Annotation[]) => void;
  onAnnoCreationFinished?: (
    createdAnno: Annotation,
    allAnnos: Annotation[],
  ) => void;
  onAnnoChanged?: (changedAnno: Annotation, allAnnos: Annotation[]) => void;
  onAnnoDeleted?: (deletedAnno: Annotation, allAnnos: Annotation[]) => void;
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
  onIsImageJunk?: (isJunk: boolean) => void;
  onNotification?: (notification: SIANotification) => void;
  onSelectAnnotation?: (annotation: Annotation) => void;
};

/**
 * Main SIA component
 */
const Sia2 = ({
  additionalButtons,
  allowedTools: propAllowedTools,
  polygonOperationResult = { annotationsToDelete: [], polygonsToCreate: [] },
  annotationSettings: propAnnotationSettings,
  uiConfig: propUiConfig,
  defaultAnnotationTool,
  defaultLabelId,
  image,
  isLoading = false,
  isPolygonSelectionMode = false,
  initialAnnotations = [],
  initialImageLabelIds = [],
  initialIsImageJunk = false,
  possibleLabels,
  onAnnoCreated = (_, __) => {},
  onAnnoCreationFinished = (_, __) => {},
  onAnnoChanged = (_, __) => {},
  onAnnoDeleted = (_, __) => {},
  onImageLabelsChanged = () => {},
  onIsImageJunk = () => {},
  onNotification = (_) => {},
  onSelectAnnotation = (_) => {},
}: SiaProps) => {
  const marginBetweenToolbarAndContainerPixels: number = 10;

  // ref for accessing the toolbar height (adjustable by screen size + custom components)
  const toolbarContainerRef = useRef(null);

  const [allowedTools, setAllowedTools] = useState<AllowedTools>();

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationSettings, setAnnotationSettings] =
    useState<AnnotationSettings>();

  const [uiConfig, setUiConfig] = useState<UiConfig>();

  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>();

  const [selectedAnnoTool, setSelectedAnnoTool] = useState<AnnotationTool>(
    defaultAnnotationTool !== undefined
      ? defaultAnnotationTool
      : AnnotationTool.Point,
  );

  // for adjusting the container/canvas size
  // const [toolbarHeight, setToolbarHeight] = useState<number>(-1);

  const [outerContainerStyle, setOuterContainerStyle] = useState<CSSProperties>(
    {
      height: `100%`,
    },
  );

  const [imageLabelIds, setImageLabelIds] =
    useState<number[]>(initialImageLabelIds);

  const [isImageJunk, setIsImageJunk] = useState<boolean>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // keep track which numbers are already used for annotation ids - even if they are deleted
  const [usedInternalIds, setUsedInternalIds] = useState<number[]>([]);

  const deleteAnnotationByInternalId = (internalId: number) => {
    // get index of selected annotation
    const annoListIndex: number = annotations!.findIndex(
      (anno) => anno.internalId === internalId,
    );

    // dereference list to force state update
    const _annotations: Annotation[] = [...annotations];

    // remove annotation
    const removedAnno: Annotation = _annotations.splice(annoListIndex, 1)[0];

    setAnnotations(_annotations);

    // inform the outside world about our changes
    onAnnoDeleted(removedAnno, _annotations);
  };

  const deleteSelectedAnnotation = () => {
    if (selectedAnnotation === undefined) return;

    deleteAnnotationByInternalId(selectedAnnotation.internalId);
  };

  const createInitialAnnotations = () => {
    // this is only run during initialization, so internal id list is always empty at this point
    // fill this without the dedicated createNewInternalAnnotationId to avoid accessing old state
    // setState in loop thats depending on its value => you are in react hell
    let internalAnnoId: number = 0;

    // create internal annotation object from external annotations
    // assign internal id, add default data if not set from the outside
    const _annotations: Annotation[] = initialAnnotations.map(
      (externalAnno: ExternalAnnotation) => {
        const _anno: Annotation = {
          ...externalAnno,
          internalId: internalAnnoId++,
          mode: AnnotationMode.VIEW,
          selectedNode: 1,
          status: externalAnno.status,
          annoTime:
            externalAnno.annoTime !== undefined ? externalAnno.annoTime : 0.0,
        };

        return _anno;
      },
    );

    // list all used internal ids (from 0 to internalAnnoId)
    setUsedInternalIds([...Array(internalAnnoId).keys()]);

    setAnnotations(_annotations);
  };

  const createNewInternalAnnotationId = (): number => {
    // find the next free number
    let newInternalId: number = 0;
    while (usedInternalIds.includes(newInternalId)) newInternalId++;

    // add it to the used numbers (dereference list to trigger react state change)
    const _usedInternalIds = [...usedInternalIds];
    _usedInternalIds.push(newInternalId);
    setUsedInternalIds(_usedInternalIds);

    return newInternalId;
  };

  const handleImageJunk = (newJunkState: boolean) => {
    setIsImageJunk(newJunkState);
    onIsImageJunk(newJunkState);
  };

  useEffect(() => {
    // remove current annotations when the image changes
    if (image === undefined) {
      setAnnotations([]);
      setSelectedAnnotation(undefined);
    }
  }, [image]);

  useEffect(() => {
    setIsImageJunk(initialIsImageJunk);

    // update the initial annotations only when the image is not set
    // (the annotations are always loaded before the image)
    // when we dont have any annos, we dont need to call it (prevents render errors on initialization)
    if (image !== undefined || initialAnnotations.length === 0) return;

    createInitialAnnotations();
  }, [initialAnnotations]);

  useEffect(() => {
    setImageLabelIds(initialImageLabelIds);
  }, [initialImageLabelIds]);

  // update annotation settings if changed in the parent
  useEffect(() => {
    const defaultAnnotationSettigs: AnnotationSettings = {
      canCreate: true,
      canEdit: true,
      canHaveMultipleLabels: false,
      canLabel: true,
      minimalArea: 250,
    };

    // use default values if a key is not set
    const newAnnotationSettings = {
      ...defaultAnnotationSettigs,
      ...propAnnotationSettings,
    };

    setAnnotationSettings(newAnnotationSettings);
  }, [propAnnotationSettings]);

  useEffect(() => {
    const defaultUiConfig: UiConfig = {
      nodeRadius: 4,
      strokeWidth: 4,
      imageCentered: false,
    };

    // use default values if a key is not set
    const newUiConfig = {
      ...defaultUiConfig,
      ...propUiConfig,
    };

    setUiConfig(newUiConfig);
  }, [propUiConfig]);

  // set default allowed tools if user has not specified them
  useEffect(() => {
    const defaultAllowedTools: AllowedTools = {
      bbox: true,
      point: true,
      line: true,
      junk: true,
      polygon: true,
    };

    if (propAllowedTools === undefined)
      return setAllowedTools(defaultAllowedTools);

    setAllowedTools(propAllowedTools);
  }, [propAllowedTools]);

  // useEffect(() => {
  //   if (toolbarHeight < 0) return;

  //   setOuterContainerStyle({
  //     height: `calc(100% - ${toolbarHeight}px)`,
  //   });
  // }, [toolbarHeight]);

  // useEffect(() => {
  //   if (toolbarContainerRef.current === null) return;
  //   const { width, height } =
  //     toolbarContainerRef.current.getBoundingClientRect();

  //   setToolbarHeight(height + marginBetweenToolbarAndContainerPixels);
  // }, [toolbarContainerRef]);

  const fullscreenStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 6000,
    backgroundColor: "#ffff",
    width: "100%",
    height: "100%",
    padding: 15,
  };

  if (allowedTools === undefined)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );

  return (
    <div
      style={{
        ...(isFullscreen ? fullscreenStyle : {}),
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={toolbarContainerRef}
        style={{
          marginBottom: marginBetweenToolbarAndContainerPixels,
        }}
      >
        <Toolbar
          annotationSettings={annotationSettings}
          allowedTools={allowedTools}
          additionalButtons={additionalButtons}
          isDisabled={isLoading}
          isFullscreen={isFullscreen}
          isImageJunk={isImageJunk}
          imageLabelIds={imageLabelIds}
          possibleLabels={possibleLabels}
          selectedTool={selectedAnnoTool}
          onImageLabelsChanged={(newImageLabelIds: number[]) => {
            setImageLabelIds(newImageLabelIds);
            onImageLabelsChanged(newImageLabelIds);
          }}
          onSetIsFullscreen={setIsFullscreen}
          onSetIsImageJunk={handleImageJunk}
          onSetSelectedTool={setSelectedAnnoTool}
          onShouldDeleteSelectedAnnotation={deleteSelectedAnnotation}
        />
      </div>
      <div style={outerContainerStyle}>
        {isLoading && (
          <div className="d-flex justify-content-center">
            <CSpinner
              color="primary"
              style={{ width: "5rem", height: "5rem", marginTop: 200 }}
            />
          </div>
        )}

        {image && annotations && (
          <Canvas
            annotations={annotations}
            annotationSettings={annotationSettings}
            defaultLabelId={defaultLabelId}
            image={image}
            isFullscreen={isFullscreen}
            isImageJunk={isImageJunk}
            isPolygonSelectionMode={isPolygonSelectionMode}
            selectedAnnotation={selectedAnnotation}
            selectedAnnoTool={selectedAnnoTool}
            polygonOperationResult={polygonOperationResult}
            possibleLabels={possibleLabels}
            uiConfig={uiConfig}
            onAnnoCreated={(annotation: Annotation) => {
              const _annotations: Annotation[] = [...annotations];
              _annotations.push(annotation);
              setAnnotations(_annotations);
              setSelectedAnnotation(annotation);
              onAnnoCreated(annotation, _annotations);
            }}
            onAnnoChanged={(changedAnno: Annotation) => {
              // update annotation list
              const annoListIndex: number = annotations.findIndex(
                (anno) => anno.internalId === changedAnno.internalId,
              );

              // only fire event if item found
              if (annoListIndex === -1) return;

              const _annotations: Annotation[] = [...annotations];
              _annotations[annoListIndex] = changedAnno;
              setAnnotations(_annotations);

              // inform the outside world about our change
              onAnnoChanged(changedAnno, _annotations);
            }}
            onAnnoCreationFinished={(
              changedAnno: Annotation,
              hasAnnoJustBeenCreated: boolean,
            ) => {
              // update annotation list
              const _annotations: Annotation[] = [...annotations];

              // remove the previous annotations we used to do the operation with
              if (isPolygonSelectionMode) {
                if (polygonOperationResult?.annotationsToDelete !== undefined) {
                  // we also want to remove the current selected annotation
                  polygonOperationResult.annotationsToDelete.push(
                    selectedAnnotation!,
                  );

                  polygonOperationResult.annotationsToDelete.forEach(
                    (annotation) => {
                      // remove annotations "the official way" (inform the server what we did)
                      deleteAnnotationByInternalId(annotation.internalId);

                      // since we are updating the annotations list after all the deletions again, their disappearance wouldn't be noticed
                      // therefore also manually remove the annotations here

                      // get index of selected annotation
                      const annoListIndex: number = _annotations!.findIndex(
                        (anno) => anno.internalId === annotation.internalId,
                      );

                      // remove annotation from object
                      _annotations.splice(annoListIndex, 1);
                    },
                  );
                }
              }

              // are we just marking an existing annotation as finished or did we created it in the same frame
              if (hasAnnoJustBeenCreated) _annotations.push(changedAnno);
              else {
                // all other annotation types
                const annoListIndex: number = annotations.findIndex(
                  (anno) => anno.internalId === changedAnno.internalId,
                );
                _annotations[annoListIndex] = changedAnno;
              }

              setAnnotations(_annotations);

              // mark annotation as fully created
              changedAnno.status = AnnotationStatus.CREATED;

              // inform the outer world about our changes
              onAnnoCreationFinished(changedAnno, _annotations);
            }}
            onAnnoEditing={(annotation: Annotation) => {
              const _annotations: Annotation[] = [...annotations];

              const selectedAnnotationId: number = _annotations.findIndex(
                (annotation: Annotation) =>
                  annotation.internalId === selectedAnnotation?.internalId,
              );

              _annotations[selectedAnnotationId] = annotation;

              setAnnotations(_annotations);
            }}
            onSetIsImageJunk={handleImageJunk}
            onNotification={onNotification}
            onRequestNewAnnoId={createNewInternalAnnotationId}
            onSelectAnnotation={(annotation) => {
              setSelectedAnnotation(annotation);
              onSelectAnnotation(annotation);
            }}
            onSetSelectedTool={setSelectedAnnoTool}
            onShouldDeleteAnno={deleteAnnotationByInternalId}
            // eventDeleteSelectedAnnotation={deleteSelectedAnnotation}
          />
        )}
      </div>
    </div>
  );
};

export default Sia2;
