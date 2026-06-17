import { CSSProperties, useEffect, useState, WheelEvent } from 'react'
import Canvas from './Canvas/Canvas'
import Annotation from './Annotation/logic/Annotation'
import AnnotationMode from './models/AnnotationMode'
import AnnotationTool from './models/AnnotationTool'
import { AnnotationSettings, ExternalAnnotation, Label, UiConfig } from './types'

type SiaViewerProps = {
  image: string
  annotations?: ExternalAnnotation[]
  possibleLabels: Label[]
  isJunk?: boolean
  uiConfig?: Partial<UiConfig>
  enableZoom?: boolean
  canSelect?: boolean
  onSelectAnnotation?: (annotation?: Annotation) => void
}

const VIEW_ANNOTATION_SETTINGS: AnnotationSettings = {
  canCreate: false,
  canEdit: false,
  canLabel: false,
  canHaveMultipleLabels: false,
}

const DEFAULT_UI_CONFIG: UiConfig = {
  nodeRadius: 4,
  strokeWidth: 4,
  imageCentered: false,
}

const containerStyle: CSSProperties = {
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
}

/**
 * View-only SIA component. Renders image + annotations without a toolbar and
 * blocks all mutations (create / edit / delete / label). Zoom and selection
 * can be toggled via props.
 */
const SiaViewer = ({
  image,
  annotations: propAnnotations,
  possibleLabels,
  isJunk = false,
  uiConfig: propUiConfig,
  enableZoom = true,
  canSelect = true,
  onSelectAnnotation = () => {},
}: SiaViewerProps) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedAnnotation, setSelectedAnnotation] = useState<
    Annotation | undefined
  >()
  const [uiConfig, setUiConfig] = useState<UiConfig>(DEFAULT_UI_CONFIG)

  // (re)initialize annotations whenever the annotations or image prop changes
  useEffect(() => {
    if (image === undefined || propAnnotations === undefined) {
      setAnnotations([])
      setSelectedAnnotation(undefined)
      return
    }

    let internalId = 0
    const next: Annotation[] = propAnnotations.map((externalAnno) => ({
      ...externalAnno,
      internalId: internalId++,
      mode: AnnotationMode.VIEW,
      selectedNode: 1,
      status: externalAnno.status,
      annoTime: externalAnno.annoTime ?? 0,
    }))

    setAnnotations(next)
    setSelectedAnnotation(undefined)
  }, [propAnnotations, image])

  useEffect(() => {
    setUiConfig({ ...DEFAULT_UI_CONFIG, ...propUiConfig })
  }, [propUiConfig])

  const stopZoom = (e: WheelEvent) => {
    if (!enableZoom) e.stopPropagation()
  }

  return (
    <div style={containerStyle} onWheelCapture={stopZoom}>
      <Canvas
        annotations={annotations}
        annotationSettings={VIEW_ANNOTATION_SETTINGS}
        image={image}
        isImageJunk={isJunk}
        isPolygonSelectionMode={false}
        possibleLabels={possibleLabels}
        selectedAnnotation={canSelect ? selectedAnnotation : undefined}
        selectedAnnoTool={AnnotationTool.Point}
        uiConfig={uiConfig}
        onAnnoCreated={() => {}}
        onAnnoChanged={() => {}}
        onAnnoCreationFinished={() => {}}
        onAnnoEditing={() => {}}
        onNotification={() => {}}
        onRequestNewAnnoId={() => 0}
        onSelectAnnotation={
          canSelect
            ? (annotation) => {
                setSelectedAnnotation(annotation)
                onSelectAnnotation(annotation)
              }
            : () => {}
        }
        onSetIsImageJunk={() => {}}
        onSetSelectedTool={() => {}}
        onShouldDeleteAnno={() => {}}
        onTraverseAnnotationHistory={() => {}}
      />
    </div>
  )
}

export default SiaViewer
