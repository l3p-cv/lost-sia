import Annotation from '../../Annotation/logic/Annotation'
import Canvas from '../../Canvas/Canvas'
import AnnotationTool from '../../models/AnnotationTool'
import CanvasAction from '../../models/CanvasAction'
import type { AnnotationSettings, Label, UiConfig } from '../../types'

type CanvasProps = {
  annotations?: Annotation[]
  image: string
  selectedAnnoTool: AnnotationTool
  possibleLabels: Label[]
  preventScrolling: boolean
  uiConfig: UiConfig
  onAnnoEvent?: (annotation: Annotation, canvasAction: CanvasAction) => void | undefined
  onKeyDown?: (e) => void | undefined
  onKeyUp?: (e) => void | undefined
}

const annotationSettings: AnnotationSettings = {
  canHaveMultipleLabels: true,
  canCreate: true,
  canLabel: true,
}

const CanvasWithOffset = ({
  annotations = [],
  image,
  selectedAnnoTool,
  possibleLabels,
  preventScrolling,
  uiConfig,
}: CanvasProps) => {
  return (
    <>
      <h1>A line to generate offset</h1>
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: 200,
          background: 'green',
        }}
      >
        <Canvas
          annotations={annotations}
          annotationSettings={annotationSettings}
          image={image}
          selectedAnnotation={undefined}
          selectedAnnoTool={selectedAnnoTool}
          possibleLabels={possibleLabels}
          preventScrolling={preventScrolling}
          uiConfig={uiConfig}
          onAnnoCreated={() => {}}
          onAnnoChanged={() => {}}
          onAnnoCreationFinished={() => {}}
          onAnnoEditing={() => {}}
          onRequestNewAnnoId={() => 1}
          onSelectAnnotation={() => {}}
          onSetIsImageJunk={() => {}}
          onSetSelectedTool={() => {}}
          onShouldDeleteAnno={() => {}}
        />
      </div>
    </>
  )
}

export default CanvasWithOffset
