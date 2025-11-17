import { CCol, CRow } from '@coreui/react'

import AnnoToolSelector from './ToolbarItems/AnnoToolSelector'
import ImageTools from './ToolbarItems/ImageTools'
import AnnotationTool from '../models/AnnotationTool'
import AccessibilityTools from './ToolbarItems/AccessibilityTools'
import { ReactElement } from 'react'
import { AllowedTools, AnnotationSettings, Label } from '../types'

type ToolbarProps = {
  annotationSettings: AnnotationSettings
  allowedTools: AllowedTools
  additionalButtons?: ReactElement | undefined
  isImageJunk?: boolean
  imageLabelIds?: number[]
  isDisabled?: boolean
  isFullscreen?: boolean
  possibleLabels: Label[]
  selectedTool: AnnotationTool
  onImageLabelsChanged?: (selectedImageIds: number[]) => void
  onSetIsFullscreen?: (isFullscreen: boolean) => void
  onSetIsImageJunk?: (isImageJunk: boolean) => void
  onSetSelectedTool?: (selectedTool: AnnotationTool) => void
  onShouldDeleteSelectedAnnotation?: () => void
}

const Toolbar = ({
  annotationSettings,
  allowedTools,
  additionalButtons,
  isImageJunk = false,
  imageLabelIds = [],
  isDisabled = false,
  isFullscreen = false,
  possibleLabels,
  selectedTool,
  onImageLabelsChanged = () => {},
  onSetIsFullscreen = () => {},
  onSetIsImageJunk = () => {},
  onSetSelectedTool = () => {},
  onShouldDeleteSelectedAnnotation = () => {},
}: ToolbarProps) => {
  return (
    <CRow className="d-flex justify-content-center flex-wrap align-items-center gap-0 py-2 px-4">
      <CCol xs="auto">
        <ImageTools
          canJunk={allowedTools.junk}
          isImageJunk={isImageJunk}
          imageLabelIds={imageLabelIds}
          isDisabled={isDisabled}
          isFullscreen={isFullscreen}
          possibleLabels={possibleLabels}
          onImageLabelsChanged={onImageLabelsChanged}
          onSetIsImageJunk={onSetIsImageJunk}
        />
      </CCol>

      <CCol xs="auto">
        <AccessibilityTools
          isDisabled={isDisabled}
          isFullscreen={isFullscreen}
          onSetIsFullscreen={onSetIsFullscreen}
        />
      </CCol>

      {annotationSettings.canCreate && (
        <CCol xs="auto">
          <AnnoToolSelector
            allowedTools={allowedTools}
            isDisabled={isDisabled}
            selectedTool={selectedTool}
            onSetSelectedTool={onSetSelectedTool}
            onShouldDeleteSelectedAnnotation={onShouldDeleteSelectedAnnotation}
          />
        </CCol>
      )}

      {additionalButtons && additionalButtons}
    </CRow>
  )
}

export default Toolbar
