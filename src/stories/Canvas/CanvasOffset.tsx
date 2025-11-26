import { CSSProperties } from 'react'
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
  annotations = undefined,
  image,
  selectedAnnoTool,
  possibleLabels,
  preventScrolling,
  uiConfig,
}: CanvasProps) => {
  const forwardFlex: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',

    flex: '1 1 auto',
    minHeight: 0,
  }

  return (
    <>
      <h1>A line to generate offset</h1>
      <div
        style={{
          ...forwardFlex,
          background: 'green',
          padding: 100,
        }}
      >
        <div style={{ ...forwardFlex, background: 'white' }}>
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
      </div>
    </>
  )
}

export default CanvasWithOffset
