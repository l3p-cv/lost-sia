import { useEffect, useState, ReactElement, useRef } from "react";
import { CSpinner } from "@coreui/react";
import Canvas from "./Canvas/Canvas";
import AllowedTools from "./models/AllowedTools";
import AnnotationTool from "./models/AnnotationTool";
import Toolbar from "./Toolbar/Toolbar";
import UiConfig from "./models/UiConfig";
import Label from "./models/Label";
import Annotation from "./Annotation/logic/Annotation";
import ExternalAnnotation from "./models/ExternalAnnotation";
import AnnotationMode from "./models/AnnotationMode";
import AnnotationSettings from "./models/AnnotationSettings";
import AnnotationStatus from "./models/AnnotationStatus";

type SiaProps = {
  allowedTools?: AllowedTools;
  additionalButtons?: ReactElement | undefined;
  annotationSettings?: AnnotationSettings;
  defaultAnnotationTool?: AnnotationTool;
  image: string;
  isLoading?: boolean;
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
};

const Sia2 = ({
  allowedTools: propAllowedTools,
  additionalButtons,
  annotationSettings: propAnnotationSettings,
  uiConfig: propUiConfig,
  defaultAnnotationTool,
  image,
  isLoading = false,
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
  const [toolbarHeight, setToolbarHeight] = useState<number>(-1);

  const [outerContainerStyle, setOuterContainerStyle] = useState({
    height: `100%`,
  });

  const [imageLabelIds, setImageLabelIds] =
    useState<number[]>(initialImageLabelIds);

  const [isImageJunk, setIsImageJunk] = useState<boolean>(initialIsImageJunk);

  // keep track which numbers are already used for annotation ids - even if they are deleted
  const [usedInternalIds, setUsedInternalIds] = useState<number[]>([]);

  const deleteSelectedAnnotation = () => {
    if (selectedAnnotation === undefined) return;

    // get index of selected annotation
    const annoListIndex: number = annotations!.findIndex(
      (anno) => anno.internalId === selectedAnnotation.internalId,
    );

    // dereference list to force state update
    const _annotations: Annotation[] = [...annotations];

    // remove annotation
    _annotations.splice(annoListIndex, 1);

    setAnnotations(_annotations);

    // inform the outside world about our changes
    onAnnoDeleted(selectedAnnotation, _annotations);
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
          timestamp:
            externalAnno.timestamp !== undefined
              ? externalAnno.timestamp
              : performance.now(),
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

  useEffect(() => {
    // update the initial annotations only when the image is not set
    // (the annotations are always loaded before the image)
    if (image !== undefined) return;

    createInitialAnnotations();
  }, [initialAnnotations]);

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

  if (allowedTools === undefined)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );

  return (
    <>
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
          isImageJunk={isImageJunk}
          imageLabelIds={imageLabelIds}
          possibleLabels={possibleLabels}
          selectedTool={selectedAnnoTool}
          onImageLabelsChanged={(newImageLabelIds: number[]) => {
            setImageLabelIds(newImageLabelIds);
            onImageLabelsChanged(newImageLabelIds);
          }}
          onSetSelectedTool={setSelectedAnnoTool}
          onSetIsImageJunk={(newJunkState: boolean) => {
            setIsImageJunk(newJunkState);
            onIsImageJunk(newJunkState);
          }}
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
            image={image}
            isImageJunk={isImageJunk}
            selectedAnnotation={selectedAnnotation}
            selectedAnnoTool={selectedAnnoTool}
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
              const _annotations: Annotation[] = [...annotations];
              _annotations[annoListIndex] = changedAnno;
              setAnnotations(_annotations);

              // inform the outside world about our change
              onAnnoChanged(changedAnno, _annotations);
            }}
            onAnnoCreationFinished={(changedAnno: Annotation) => {
              // update annotation list
              const _annotations: Annotation[] = [...annotations];

              // point annotations are created in one frame
              // they dont exist in the annotations list yet, so just append them
              if (changedAnno.type === AnnotationTool.Point)
                _annotations.push(changedAnno);
              else {
                // all other annotation types
                const annoListIndex: number = annotations.findIndex(
                  (anno) => anno.internalId === changedAnno.internalId,
                );
                _annotations[annoListIndex] = changedAnno;
              }

              // mark annotation as fully created
              changedAnno.status = AnnotationStatus.CREATED;
              setAnnotations(_annotations);

              // inform the outer world about our changes
              onAnnoCreationFinished(changedAnno, _annotations);
            }}
            onRequestNewAnnoId={createNewInternalAnnotationId}
            onSelectAnnotation={setSelectedAnnotation}
            // eventDeleteSelectedAnnotation={deleteSelectedAnnotation}
          />
        )}
      </div>
    </>
  );
};

export default Sia2;
