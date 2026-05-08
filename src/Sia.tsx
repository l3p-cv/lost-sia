import { useEffect, useState, ReactElement, useRef, CSSProperties } from 'react'
import { CSpinner } from '@coreui/react'
import Canvas from './Canvas/Canvas'
import AnnotationTool from './models/AnnotationTool'
import Toolbar from './Toolbar/Toolbar'
import Annotation from './Annotation/logic/Annotation'
import AnnotationMode from './models/AnnotationMode'
import AnnotationStatus from './models/AnnotationStatus'
import {
  AllowedTools,
  AnnotationSettings,
  ExternalAnnotation,
  Label,
  PolygonOperationResult,
  SIANotification,
  TimeTravelChanges,
  UiConfig,
} from './types'

type SiaProps = {
  additionalButtons?: ReactElement
  allowedTools?: AllowedTools
  polygonOperationResult?: PolygonOperationResult
  annotationSettings?: AnnotationSettings
  defaultAnnotationTool?: AnnotationTool
  defaultLabelId?: number
  image?: string
  isLoading?: boolean
  isPolygonSelectionMode?: boolean
  initialAnnotations?: ExternalAnnotation[]
  initialImageLabelIds?: number[]
  initialIsImageJunk?: boolean
  possibleLabels: Label[]
  uiConfig?: UiConfig
  onAnnoCreated?: (createdAnno: Annotation, allAnnos: Annotation[]) => void
  onAnnoCreationFinished?: (createdAnno: Annotation) => void
  onAnnoChanged?: (changedAnno: Annotation) => void
  onAnnoDeleted?: (deletedAnno: Annotation, allAnnos?: Annotation[]) => void
  onImageLabelsChanged?: (selectedImageIds: number[]) => void
  onIsImageJunk?: (isJunk: boolean) => void
  onNotification?: (notification: SIANotification) => void
  onSelectAnnotation?: (annotation: Annotation) => void
  onTimeTravel?: (timeTravelAction: TimeTravelChanges) => void
}

/**
 * Main SIA component
 */
const Sia = ({
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
  initialAnnotations = undefined,
  initialImageLabelIds = undefined,
  initialIsImageJunk = false,
  possibleLabels,
  onAnnoCreated = (_, __) => {},
  onAnnoCreationFinished = (_) => {},
  onAnnoChanged = (_) => {},
  onAnnoDeleted = (_, __) => {},
  onImageLabelsChanged = () => {},
  onIsImageJunk = () => {},
  onNotification = (_) => {},
  onSelectAnnotation = (_) => {},
  onTimeTravel = (_) => {},
}: SiaProps) => {
  const marginBetweenToolbarAndContainerPixels: number = 10

  // ref for accessing the toolbar height (adjustable by screen size + custom components)
  const toolbarContainerRef = useRef(null)

  const [allowedTools, setAllowedTools] = useState<AllowedTools>()

  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [annotationSettings, setAnnotationSettings] = useState<AnnotationSettings>()

  // tracks how far we went back in the history
  const [annotationHistoryIndex, setAnnotationHistoryIndex] = useState<
    number | undefined
  >()
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([])

  const [uiConfig, setUiConfig] = useState<UiConfig>()

  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>()

  const [selectedAnnoTool, setSelectedAnnoTool] = useState<AnnotationTool>(
    defaultAnnotationTool ?? AnnotationTool.Point,
  )

  const updateAnnotationHistory = (annotations: Annotation[]) => {
    const _annotations = [...annotations]
    const _annotationHistory = [...annotationHistory]

    // user did some changes from within the past
    // time to create an alternative timeline and delete the original one
    if (annotationHistoryIndex !== undefined) {
      // remove everything after the state the user is
      _annotationHistory.splice(annotationHistoryIndex + 1)
    }

    // update the list with out latest change (it is always living in the present)
    _annotationHistory.push(_annotations)

    // keep history index marker in the present
    setAnnotationHistoryIndex(undefined)

    setAnnotationHistory(_annotationHistory)
  }

  // for adjusting the container/canvas size
  // const [toolbarHeight, setToolbarHeight] = useState<number>(-1);

  // const [outerContainerStyle, setOuterContainerStyle] = useState<CSSProperties>({
  //   // use the max available height as a flex child
  //   flex: '1 1 auto',
  //   minHeight: 0,

  //   // give the max available height to the next child
  //   display: 'flex',
  //   flexDirection: 'column',
  // })

  const [imageLabelIds, setImageLabelIds] = useState<number[]>(initialImageLabelIds)

  const [isImageJunk, setIsImageJunk] = useState<boolean>()
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // keep track which numbers are already used for annotation ids - even if they are deleted
  const [usedInternalIds, setUsedInternalIds] = useState<number[]>([])

  const deleteAnnotationByInternalId = (internalId: number) => {
    // get index of selected annotation
    const annoListIndex: number = annotations.findIndex(
      (anno) => anno.internalId === internalId,
    )

    // dereference list to force state update
    const _annotations: Annotation[] = [...annotations]

    // remove annotation
    const removedAnno: Annotation = _annotations.splice(annoListIndex, 1)[0]

    setAnnotations(_annotations)
    setSelectedAnnotation(undefined)
    updateAnnotationHistory(_annotations)

    // inform the outside world about our changes
    onAnnoDeleted(removedAnno, _annotations)
  }

  const deleteSelectedAnnotation = () => {
    if (selectedAnnotation === undefined) return

    deleteAnnotationByInternalId(selectedAnnotation.internalId)
  }

  const createInitialAnnotations = () => {
    // this is only run during initialization, so internal id list is always empty at this point
    // fill this without the dedicated createNewInternalAnnotationId to avoid accessing old state
    // setState in loop thats depending on its value => you are in react hell
    let internalAnnoId: number = 0

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
          annoTime: externalAnno.annoTime ?? 0,
        }

        return _anno
      },
    )

    // list all used internal ids (from 0 to internalAnnoId)
    setUsedInternalIds([...new Array(internalAnnoId).keys()])

    setAnnotations(_annotations)
    updateAnnotationHistory(_annotations)
  }

  const createNewInternalAnnotationId = (): number => {
    // find the next free number
    let newInternalId: number = 0
    while (usedInternalIds.includes(newInternalId)) newInternalId++

    // add it to the used numbers (dereference list to trigger react state change)
    const _usedInternalIds = [...usedInternalIds]
    _usedInternalIds.push(newInternalId)
    setUsedInternalIds(_usedInternalIds)

    return newInternalId
  }

  const handleAnnoEditing = (annotation: Annotation) => {
    const _annotations: Annotation[] = [...annotations]

    // annotation is being edited - remove it from current annotations for this time
    const selectedAnnotationIndex: number = _annotations.findIndex(
      (annotation: Annotation) =>
        annotation.internalId === selectedAnnotation?.internalId,
    )

    if (selectedAnnotationIndex === -1) return

    // remove the old anno
    const removedAnno: Annotation = _annotations.splice(selectedAnnotationIndex, 1)[0]

    // do deletion state update without the new anno!
    onAnnoDeleted(removedAnno, _annotations)

    // add the new anno
    const newAnnoations: Annotation[] = [..._annotations]
    newAnnoations.push(annotation)

    // update the list
    setAnnotations(newAnnoations)

    setSelectedAnnotation(annotation)
  }

  const handleImageJunk = (newJunkState: boolean) => {
    setIsImageJunk(newJunkState)
    onIsImageJunk(newJunkState)
  }

  const handleTraverseAnnotationHistory = (isUndo: boolean) => {
    // undefined -> last element
    const _annotationHistoryIndex = annotationHistoryIndex ?? annotationHistory.length - 1

    const isPresent = _annotationHistoryIndex == annotationHistory.length - 1
    const isFirst = _annotationHistoryIndex == 0

    // we cannot go into the future (yet) or past the past
    if ((isPresent && !isUndo) || (isFirst && isUndo)) return

    // request time travel using state update
    const newHistoryIndex = _annotationHistoryIndex + (isUndo ? -1 : 1)
    setAnnotationHistoryIndex(newHistoryIndex)
  }

  const getTimeTravelInductedChanges = (
    timeTravelledAnnotations: Annotation[],
  ): TimeTravelChanges => {
    const addedAnnotations: Annotation[] = []
    const removedAnnotations: Annotation[] = []
    const changedAnnotations: Annotation[] = []

    // check which items have been added or changed
    for (const travelledAnno of timeTravelledAnnotations) {
      const currentAnno = annotations.find(
        (anno) => anno.internalId === travelledAnno.internalId,
      )

      if (!currentAnno) {
        addedAnnotations.push(travelledAnno)
      } else if (JSON.stringify(currentAnno) !== JSON.stringify(travelledAnno)) {
        changedAnnotations.push(travelledAnno)
      }
    }

    // check which items have been deleted
    for (const anno of annotations) {
      const travelledAnno = timeTravelledAnnotations.find(
        (tAnno) => tAnno.internalId === anno.internalId,
      )

      if (!travelledAnno) {
        removedAnnotations.push(anno)
      }
    }

    return { addedAnnotations, removedAnnotations, changedAnnotations }
  }

  useEffect(() => {
    if (
      annotationHistoryIndex == undefined ||
      annotationHistoryIndex < 0 ||
      annotationHistoryIndex > annotationHistory.length - 1
    )
      return

    // update the shown annotations when we travel in time using the history index
    const refSelectedAnnotationsFromHistory = annotationHistory[annotationHistoryIndex]
    const selectedAnnotationsFromHistory: Annotation[] = [
      ...refSelectedAnnotationsFromHistory,
    ]

    setAnnotations(selectedAnnotationsFromHistory)

    const timeTravelInductedChanges: TimeTravelChanges = getTimeTravelInductedChanges(
      selectedAnnotationsFromHistory,
    )
    onTimeTravel(timeTravelInductedChanges)
  }, [annotationHistoryIndex])

  useEffect(() => {
    // remove current annotations when the image changes
    if (image === undefined) {
      setAnnotations([])
      setSelectedAnnotation(undefined)

      // reset time machine
      setAnnotationHistory([])
      setAnnotationHistoryIndex(undefined)
    }
  }, [image])

  useEffect(() => {
    setIsImageJunk(initialIsImageJunk)

    // update the initial annotations only when the image is not set
    // (the annotations are always loaded before the image)
    // when we dont have any annos, we dont need to call it (prevents render errors on initialization)
    if (
      image !== undefined ||
      initialAnnotations === undefined ||
      initialAnnotations.length === 0
    )
      return

    createInitialAnnotations()
  }, [initialAnnotations])

  useEffect(() => {
    setImageLabelIds(initialImageLabelIds)
  }, [initialImageLabelIds])

  // update annotation settings if changed in the parent
  useEffect(() => {
    const defaultAnnotationSettigs: AnnotationSettings = {
      canCreate: true,
      canEdit: true,
      canHaveMultipleLabels: false,
      canLabel: true,
      minimalArea: 250,
    }

    // use default values if a key is not set
    const newAnnotationSettings = {
      ...defaultAnnotationSettigs,
      ...propAnnotationSettings,
    }

    setAnnotationSettings(newAnnotationSettings)
  }, [propAnnotationSettings])

  useEffect(() => {
    const defaultUiConfig: UiConfig = {
      nodeRadius: 4,
      strokeWidth: 4,
      imageCentered: false,
    }

    // use default values if a key is not set
    const newUiConfig = {
      ...defaultUiConfig,
      ...propUiConfig,
    }

    setUiConfig(newUiConfig)
  }, [propUiConfig])

  // set default allowed tools if user has not specified them
  useEffect(() => {
    const defaultAllowedTools: AllowedTools = {
      bbox: true,
      point: true,
      line: true,
      junk: true,
      polygon: true,
    }

    if (propAllowedTools === undefined) return setAllowedTools(defaultAllowedTools)

    setAllowedTools(propAllowedTools)
  }, [propAllowedTools])

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
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 6000,
    backgroundColor: '#ffff',
    width: '100%',
    height: '100%',
    padding: 15,
  }

  const outerContainerStyle: CSSProperties = {
    // use the max available height as a flex child
    flex: '1 1 auto',
    minHeight: 0,

    // give the max available height to the next child
    display: 'flex',
    flexDirection: 'column',
  }

  if (allowedTools === undefined)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" style={{ width: '5rem', height: '5rem' }} />
      </div>
    )

  return (
    <div
      style={{
        ...(isFullscreen ? fullscreenStyle : {}),
        // use the max available height as a flex child
        flex: '1 1 auto',
        minHeight: 0,

        // give the max available height to the next child
        display: 'flex',
        flexDirection: 'column',
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
            setImageLabelIds(newImageLabelIds)
            onImageLabelsChanged(newImageLabelIds)
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
              style={{ width: '5rem', height: '5rem', marginTop: 200 }}
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
              setAnnotations((prev) => {
                const _annotations = [...prev, annotation]
                onAnnoCreated(annotation, _annotations)
                return _annotations
              })
              setSelectedAnnotation(annotation)
              // dont update history here - we dont have a finished anno at this point
            }}
            onAnnoChanged={(changedAnno: Annotation) => {
              setAnnotations((prev) => {
                // update annotation list
                const annoListIndex: number = prev.findIndex(
                  (anno) => anno.internalId === changedAnno.internalId,
                )

                // only fire event if item found
                if (annoListIndex === -1) return prev

                const _annotations: Annotation[] = [...prev]
                _annotations[annoListIndex] = changedAnno

                // only update history for full/finished annotations
                if (changedAnno.status !== AnnotationStatus.CREATING) {
                  updateAnnotationHistory(_annotations)
                }

                return _annotations
              })

              // inform the outside world about our change
              // (kept outside the updater — side effects must not run inside setState)
              onAnnoChanged(changedAnno)
            }}
            onAnnoCreationFinished={(
              changedAnno: Annotation,
              hasAnnoJustBeenCreated: boolean,
            ) => {
              const finishedAnno: Annotation = {
                ...changedAnno,
                status: AnnotationStatus.CREATED, // copy and mark annotation as fully created
              }

              // Collect annotations to delete before entering the updater.
              // build a fresh array so we never mutate the prop from SiaWrapper.
              const annosToDelete: Annotation[] =
                isPolygonSelectionMode &&
                polygonOperationResult?.annotationsToDelete !== undefined
                  ? [
                      ...polygonOperationResult.annotationsToDelete,
                      ...(selectedAnnotation !== undefined ? [selectedAnnotation] : []),
                    ]
                  : []

              setAnnotations((prev) => {
                // update annotation list
                const _annotations: Annotation[] = [...prev]

                // remove the source annotations that were consumed by the polygon operation
                for (const annotation of annosToDelete) {
                  const annoListIndex: number = _annotations.findIndex(
                    (anno) => anno.internalId === annotation.internalId,
                  )
                  if (annoListIndex !== -1) _annotations.splice(annoListIndex, 1)
                }

                if (hasAnnoJustBeenCreated) _annotations.push(finishedAnno)
                else {
                  const annoListIndex: number = prev.findIndex(
                    (anno) => anno.internalId === finishedAnno.internalId,
                  )
                  _annotations[annoListIndex] = finishedAnno
                }

                updateAnnotationHistory(_annotations)

                return _annotations
              })

              // Notify the server about the deletions (outside of the updater/setState!!!)
              for (const annotation of annosToDelete) {
                onAnnoDeleted(annotation)
              }

              // inform the outer world about the new annotation (also outside of the updater/setState!!!)
              onAnnoCreationFinished(finishedAnno)
            }}
            onAnnoEditing={handleAnnoEditing}
            onSetIsImageJunk={handleImageJunk}
            onNotification={onNotification}
            onRequestNewAnnoId={createNewInternalAnnotationId}
            onSelectAnnotation={(annotation) => {
              setSelectedAnnotation(annotation)
              onSelectAnnotation(annotation)
            }}
            onSetSelectedTool={setSelectedAnnoTool}
            onShouldDeleteAnno={deleteAnnotationByInternalId}
            onTraverseAnnotationHistory={handleTraverseAnnotationHistory}
          />
        )}
      </div>
    </div>
  )
}

export default Sia
