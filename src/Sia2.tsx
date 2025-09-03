import { useEffect, useState, ReactElement } from "react";
import { CContainer, CRow, CSpinner } from "@coreui/react";
import Canvas from "./Canvas/Canvas";
import AllowedTools from "./models/AllowedTools";
import AnnotationTool from "./models/AnnotationTool";
import Toolbar from "./Toolbar/Toolbar";
import UiConfig from "./models/UiConfig";
import Label from "./models/Label";
import Annotation from "./Annotation/logic/Annotation";
import ExternalAnnotation from "./models/ExternalAnnotation";
import AnnotationMode from "./models/AnnotationMode";
import AnnotationStatus from "./models/AnnotationStatus";
import AnnotationSettings from "./models/AnnotationSettings";

type SiaProps = {
  allowedTools?: AllowedTools;
  additionalButtons?: ReactElement | undefined;
  annotationSettings?: AnnotationSettings;
  defaultAnnotationTool?: AnnotationTool;
  image: string;
  isLoading?: boolean;
  initialAnnotations?: ExternalAnnotation[];
  initialImageLabelIds?: number[];
  possibleLabels: Label[];
  uiConfig: UiConfig;
  onAnnoCreated?: (createdAnno: Annotation, allAnnos: Annotation[]) => void;
  onAnnoCreationFinished?: (
    createdAnno: Annotation,
    allAnnos: Annotation[],
  ) => void;
  onAnnoChanged?: (changedAnno: Annotation, allAnnos: Annotation[]) => void;
  onAnnoDeleted?: (deletedAnno: Annotation, allAnnos: Annotation[]) => void;
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
};

const Sia2 = ({
  allowedTools: propAllowedTools,
  additionalButtons,
  annotationSettings: propAnnotationSettings,
  uiConfig,
  defaultAnnotationTool,
  image,
  isLoading = false,
  initialAnnotations = [],
  initialImageLabelIds = [],
  possibleLabels,
  onAnnoCreated = (_, __) => {},
  onAnnoCreationFinished = (_, __) => {},
  onAnnoChanged = (_, __) => {},
  onAnnoDeleted = (_, __) => {},
  onImageLabelsChanged = () => {},
}: SiaProps) => {
  const [allowedTools, setAllowedTools] = useState<AllowedTools>();

  const [siaInitialized, setSiaInitialized] = useState<boolean>(false);

  const [annotations, setAnnotations] = useState<Annotation[]>();
  const [annotationSettings, setAnnotationSettings] =
    useState<AnnotationSettings>();

  const [selectedAnnoTool, setSelectedAnnoTool] = useState<AnnotationTool>(
    defaultAnnotationTool !== undefined
      ? defaultAnnotationTool
      : AnnotationTool.Point,
  );

  const [imageLabelIds, setImageLabelIds] =
    useState<number[]>(initialImageLabelIds);

  // keep track which numbers are already used for annotation ids - even if they are deleted
  const [usedInternalIds, setUsedInternalIds] = useState<number[]>([]);

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

  // reset SIA on image change
  useEffect(() => {
    if (siaInitialized) setSiaInitialized(false);
  }, [image]);

  useEffect(() => {
    if (siaInitialized) return;

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
          status: AnnotationStatus.NEW,
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
    setSiaInitialized(true);
  }, [initialAnnotations, siaInitialized]);

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

  if (allowedTools === undefined || siaInitialized === false)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );

  return (
    <CContainer>
      <div style={{ marginBottom: 10 }}>
        <Toolbar
          annotationSettings={annotationSettings}
          allowedTools={allowedTools}
          additionalButtons={additionalButtons}
          isDisabled={isLoading}
          imageLabelIds={imageLabelIds}
          possibleLabels={possibleLabels}
          selectedTool={selectedAnnoTool}
          onImageLabelsChanged={(newImageLabelIds: number[]) => {
            setImageLabelIds(newImageLabelIds);
            onImageLabelsChanged(newImageLabelIds);
          }}
          onSetSelectedTool={setSelectedAnnoTool}
        />
      </div>
      <CRow>
        {isLoading && (
          <div className="d-flex justify-content-center">
            <CSpinner
              color="primary"
              style={{ width: "5rem", height: "5rem", marginTop: 200 }}
            />
          </div>
        )}
        {!isLoading && (
          <Canvas
            annotations={annotations}
            annotationSettings={annotationSettings}
            image={image}
            selectedAnnoTool={selectedAnnoTool}
            possibleLabels={possibleLabels}
            uiConfig={uiConfig}
            onAnnoCreated={(annotation: Annotation) => {
              const _annotations: Annotation[] = [...annotations];
              _annotations.push(annotation);
              setAnnotations(_annotations);
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
              const annoListIndex: number = annotations.findIndex(
                (anno) => anno.internalId === changedAnno.internalId,
              );
              const _annotations: Annotation[] = [...annotations];
              _annotations[annoListIndex] = changedAnno;
              setAnnotations(_annotations);
              onAnnoCreationFinished(changedAnno, _annotations);
            }}
            onRequestNewAnnoId={createNewInternalAnnotationId}
          />
        )}
      </CRow>
    </CContainer>
  );
};

export default Sia2;
