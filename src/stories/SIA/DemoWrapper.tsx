import Annotation from '../../Annotation/logic/Annotation'
import AnnotationTool from '../../models/AnnotationTool'

import Sia from '../../Sia'

import type { AnnotationSettings, ExternalAnnotation, UiConfig } from '../../types'
import exampleLabels from '../exampleData/exampleLabels'
import exampleImage from '../exampleData/exampleImage'

type DemoWrapperProps = {
  annotations?: ExternalAnnotation[]
  annotationSettings?: AnnotationSettings
  isLoading?: boolean
}

const DemoWrapper = ({
  annotations = [],
  annotationSettings,
  isLoading = false,
}: DemoWrapperProps) => {
  const uiConfig: UiConfig = {
    nodeRadius: 4,
    strokeWidth: 4,
    imageCentered: false,
  }

  return (
    <Sia
      annotationSettings={annotationSettings}
      initialAnnotations={annotations}
      isLoading={isLoading}
      possibleLabels={exampleLabels.voc}
      uiConfig={uiConfig}
      image={exampleImage}
      defaultAnnotationTool={AnnotationTool.Polygon}
      onAnnoCreated={(anno: Annotation, _: Annotation[]) => {
        console.log('CREATED', anno)
      }}
      onAnnoCreationFinished={(anno: Annotation, _: Annotation[]) => {
        console.log('FINISHED CREATION', anno)
      }}
      onAnnoChanged={(anno: Annotation, _: Annotation[]) => {
        console.log('CHANGED', anno)
      }}
      onAnnoDeleted={(anno: Annotation, annos: Annotation[]) => {
        console.log('DELETED', anno, annos)
      }}
      onImageLabelsChanged={(imageLabelIds: number[]) => {
        console.log('IMAGE LABEL IDS CHANGED', imageLabelIds)
      }}
    />
  )
}

export default DemoWrapper
