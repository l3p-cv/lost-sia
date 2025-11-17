import { CButton, CButtonGroup } from '@coreui/react'
import * as siaIcons from '../../utils/siaIcons'

import AnnotationTool from '../../models/AnnotationTool'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { AllowedTools } from '../../types'

type AnnoToolSelectorProps = {
  allowedTools: AllowedTools
  isDisabled?: boolean
  selectedTool: AnnotationTool
  onSetSelectedTool: (selectedTool: AnnotationTool) => void
  onShouldDeleteSelectedAnnotation?: () => void
}

const AnnoToolSelector = ({
  allowedTools,
  isDisabled = false,
  selectedTool,
  onSetSelectedTool,
  onShouldDeleteSelectedAnnotation = () => {},
}: AnnoToolSelectorProps) => {
  return (
    <CButtonGroup role="group" aria-label="Basic example">
      {allowedTools.point && (
        <CButton
          color="primary"
          disabled={isDisabled}
          variant={selectedTool == AnnotationTool.Point ? undefined : 'outline'}
          onClick={() => onSetSelectedTool(AnnotationTool.Point)}
        >
          {siaIcons.pointIcon()}
        </CButton>
      )}

      {allowedTools.line && (
        <CButton
          color="primary"
          disabled={isDisabled}
          variant={selectedTool == AnnotationTool.Line ? undefined : 'outline'}
          onClick={() => onSetSelectedTool(AnnotationTool.Line)}
        >
          {siaIcons.lineIcon()}
        </CButton>
      )}

      {allowedTools.bbox && (
        <CButton
          color="primary"
          disabled={isDisabled}
          variant={selectedTool == AnnotationTool.BBox ? undefined : 'outline'}
          onClick={() => onSetSelectedTool(AnnotationTool.BBox)}
        >
          {siaIcons.bBoxIcon()}
        </CButton>
      )}

      {allowedTools.polygon && (
        <CButton
          color="primary"
          disabled={isDisabled}
          variant={selectedTool == AnnotationTool.Polygon ? undefined : 'outline'}
          onClick={() => onSetSelectedTool(AnnotationTool.Polygon)}
        >
          {siaIcons.polygonIcon()}
        </CButton>
      )}

      <CButton
        color="primary"
        variant="outline"
        disabled={isDisabled}
        onClick={onShouldDeleteSelectedAnnotation}
      >
        <FontAwesomeIcon icon={faTrash as IconProp} size="lg" />
      </CButton>
    </CButtonGroup>
  )
}

export default AnnoToolSelector
